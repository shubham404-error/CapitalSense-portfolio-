"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ExternalLink,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { fundOverviews } from "../lib/fund-overviews";
import { historyMfapi, type NavHistory } from "../lib/mfapi";
import {
  simulateHistory,
  xirr,
  type SimulationPoint,
  type SimulationResult,
} from "../lib/fund-simulation";

export type CartFund = {
  id: string;
  name: string;
  schemeCode: string;
  sipAmount: number;
};
type SimulatedFund = { fund: CartFund; result: SimulationResult | null };
const ORDER_WHATSAPP = "918850405723";
const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
const percent = (value: number | null) =>
  value === null || !Number.isFinite(value)
    ? "Not available"
    : `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;

function aggregatePoints(simulations: SimulatedFund[]) {
  const series = simulations.flatMap(({ result }) =>
    result ? [result.points] : [],
  );
  const months = Array.from(
    new Set(
      series.flatMap((points) => points.map((point) => point.date.slice(0, 7))),
    ),
  ).sort();
  const positions = series.map(() => 0);
  return months.map((month) => {
    let invested = 0,
      value = 0;
    series.forEach((points, index) => {
      while (
        positions[index] + 1 < points.length &&
        points[positions[index] + 1].date.slice(0, 7) <= month
      )
        positions[index]++;
      const point = points[positions[index]];
      if (point?.date.slice(0, 7) <= month) {
        invested += point.invested;
        value += point.value;
      }
    });
    return { date: `${month}-01`, invested, value };
  });
}

function BasketChart({ points }: { points: SimulationPoint[] }) {
  if (points.length < 2) return null;
  const data = points.filter(
    (_, index) =>
      index % Math.max(1, Math.ceil(points.length / 100)) === 0 ||
      index === points.length - 1,
  );
  const width = 760,
    height = 250,
    pad = 18,
    max = Math.max(
      ...data.flatMap((point) => [point.value, point.invested]),
      1,
    );
  const x = (index: number) =>
    pad + (index * (width - pad * 2)) / (data.length - 1);
  const y = (value: number) =>
    height - pad - (value * (height - pad * 2)) / max;
  const path = (key: "value" | "invested") =>
    data
      .map(
        (point, index) =>
          `${index ? "L" : "M"} ${x(index).toFixed(1)} ${y(point[key]).toFixed(1)}`,
      )
      .join(" ");
  return (
    <div className="cart-simulation-chart">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Historical SIP basket value compared with amount invested"
      >
        <path
          className="axis"
          d={`M ${pad} ${height - pad} H ${width - pad}`}
        />
        <path className="invested" d={path("invested")} />
        <path className="value" d={path("value")} />
      </svg>
      <div>
        <span>
          <i className="value" />
          Basket value
        </span>
        <span>
          <i />
          Amount invested
        </span>
      </div>
    </div>
  );
}

export default function FundCart({
  cart,
  onChange,
  onClose,
  onClear,
  onInvest,
}: {
  cart: CartFund[];
  onChange: (cart: CartFund[]) => void;
  onClose: () => void;
  onClear: () => void;
  onInvest: () => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [name, setName] = useState("");
  const [investorType, setInvestorType] = useState("new");
  const [sipDay, setSipDay] = useState("5");
  const [months, setMonths] = useState(36);
  const [stepUp, setStepUp] = useState(0);
  const [metric, setMetric] = useState<"absolute" | "xirr">("xirr");
  const [consent, setConsent] = useState(false);
  const [opened, setOpened] = useState(false);
  const [histories, setHistories] = useState<Record<string, NavHistory>>({});
  const [historyErrors, setHistoryErrors] = useState<Record<string, string>>(
    {},
  );
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [retry, setRetry] = useState(0);
  const total = useMemo(
    () => cart.reduce((sum, fund) => sum + fund.sipAmount, 0),
    [cart],
  );
  const validAmounts =
    cart.length > 0 &&
    cart.every(
      (fund) => Number.isFinite(fund.sipAmount) && fund.sipAmount >= 500,
    );
  const requestId = useMemo(
    () => `STRIDE-${Date.now().toString(36).toUpperCase()}`,
    [],
  );

  useEffect(() => {
    if (step !== 2) return;
    const missing = cart.filter((fund) => !histories[fund.schemeCode]);
    if (!missing.length) return;
    const controller = new AbortController();
    setLoadingHistory(true);
    setHistoryErrors({});
    Promise.all(
      missing.map(async (fund) => {
        try {
          return [
            fund.schemeCode,
            await historyMfapi(fund.schemeCode, controller.signal),
          ] as const;
        } catch (error) {
          if (!controller.signal.aborted)
            setHistoryErrors((current) => ({
              ...current,
              [fund.schemeCode]:
                error instanceof Error
                  ? error.message
                  : "NAV history unavailable",
            }));
          return null;
        }
      }),
    )
      .then((rows) => {
        if (!controller.signal.aborted)
          setHistories((current) => ({
            ...current,
            ...Object.fromEntries(
              rows.filter(Boolean) as [string, NavHistory][],
            ),
          }));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingHistory(false);
      });
    return () => controller.abort();
  }, [step, retry]);

  const simulations = useMemo<SimulatedFund[]>(
    () =>
      cart.map((fund) => ({
        fund,
        result: histories[fund.schemeCode]
          ? simulateHistory(histories[fund.schemeCode], {
              mode: "sip",
              amount: fund.sipAmount,
              months,
              annualStepUp: stepUp,
            })
          : null,
      })),
    [cart, histories, months, stepUp],
  );
  const completeSimulation =
    simulations.length > 0 &&
    simulations.every(({ result }) => result !== null);
  const aggregate = useMemo(() => {
    const results = simulations.flatMap(({ result }) =>
      result ? [result] : [],
    );
    const invested = results.reduce((sum, result) => sum + result.invested, 0);
    const value = results.reduce((sum, result) => sum + result.value, 0);
    const flows = results
      .flatMap((result) => result.cashflows)
      .sort((a, b) => a.date.localeCompare(b.date));
    return {
      invested,
      value,
      gain: value - invested,
      absolute: invested ? (value / invested - 1) * 100 : null,
      xirr: flows.length ? xirr(flows) : null,
      points: aggregatePoints(simulations),
    };
  }, [simulations]);
  const ready = name.trim().length >= 2 && validAmounts && completeSimulation;
  const updateAmount = (id: string, value: number) =>
    onChange(
      cart.map((fund) =>
        fund.id === id ? { ...fund, sipAmount: value } : fund,
      ),
    );
  const simulationSummary = completeSimulation
    ? `${months / 12}Y historical SIP replay: ${money(aggregate.invested)} invested, ${money(aggregate.value)} ending value, ${percent(aggregate.xirr)} XIRR. Historical only.`
    : "Simulation unavailable";
  const message = [
    "Hello Capital Sense, I would like help with this SIP basket.",
    "",
    `Request: ${requestId}`,
    `Name: ${name.trim()}`,
    `Investor: ${investorType === "new" ? "New mutual fund investor" : "Existing mutual fund investor"}`,
    `Preferred SIP date: ${sipDay} of each month`,
    "",
    "Monthly SIP basket:",
    ...cart.map(
      (fund, index) =>
        `${index + 1}. ${fund.name} (Regular Growth, code ${fund.schemeCode}) — ${money(fund.sipAmount)}/month`,
    ),
    `Total monthly commitment: ${money(total)}`,
    `Simulation reviewed: ${simulationSummary}`,
    "",
    "This is a request for assistance, not an executed order. Please guide me through AssetPlus onboarding, KYC/mandate and final confirmation. I will not share PAN, OTP or bank details in WhatsApp.",
  ].join("\n");
  const whatsappUrl = `https://wa.me/${ORDER_WHATSAPP}?text=${encodeURIComponent(message)}`;

  return (
    <div className="overlay cart-overlay" onClick={onClose}>
      <section
        className="modal fund-cart"
        role="dialog"
        aria-modal="true"
        aria-label="SIP cart and onboarding"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="close icon-btn"
          aria-label="Close SIP cart"
          onClick={onClose}
        >
          <X />
        </button>
        <header className="cart-header">
          <span className="cart-icon">
            <ShoppingBag size={22} />
          </span>
          <div>
            <span className="eyebrow">SIP CART</span>
            <h2>
              {step === 1
                ? "Build your monthly SIP."
                : step === 2
                  ? "Simulate the whole basket."
                  : step === 3
                    ? "Tell us how to help."
                    : "Send the request first."}
            </h2>
            <p>
              {step === 1
                ? "Set a monthly amount for every fund. Nothing is ordered yet."
                : step === 2
                  ? "Replay the selected SIPs using each scheme’s published NAV history."
                  : step === 3
                    ? "Only basic request details—no PAN, OTP, bank account or documents."
                    : "Capital Sense gets the WhatsApp intimation, then guides AssetPlus onboarding."}
            </p>
          </div>
        </header>
        <ol
          className="checkout-progress four"
          aria-label="SIP request progress"
        >
          {([
            [1, "Cart"],
            [2, "Simulation"],
            [3, "Details"],
            [4, "WhatsApp"],
          ] as const).map(([number, label]) => (
            <li key={number} className={step >= number ? "active" : ""}>
              <span>{step > number ? <Check size={13} /> : number}</span>
              {label}
            </li>
          ))}
        </ol>

        {step === 1 && (
          <div className="cart-step">
            <div className="cart-items">
              {cart.map((fund) => (
                <article key={fund.id}>
                  <div>
                    <b>{fund.name}</b>
                    <small>Regular Growth · Scheme {fund.schemeCode}</small>
                  </div>
                  <label>
                    <span>Monthly SIP</span>
                    <div>
                      <span>₹</span>
                      <input
                        aria-label={`${fund.name} monthly SIP`}
                        type="number"
                        min="500"
                        step="500"
                        value={fund.sipAmount}
                        onChange={(event) =>
                          updateAmount(fund.id, Number(event.target.value))
                        }
                      />
                    </div>
                  </label>
                  <button
                    className="icon-btn"
                    aria-label={`Remove ${fund.name} from cart`}
                    onClick={() =>
                      onChange(cart.filter((item) => item.id !== fund.id))
                    }
                  >
                    <Trash2 size={17} />
                  </button>
                </article>
              ))}
            </div>
            <div className="cart-total">
              <span>
                <small>
                  {cart.length} {cart.length === 1 ? "fund" : "funds"}
                </small>
                <b>Total monthly SIP</b>
              </span>
              <strong>{money(total)}</strong>
            </div>
            {!validAmounts && (
              <p className="cart-error" role="alert">
                Each SIP must be at least ₹500 for this request.
              </p>
            )}
            <div className="cart-actions">
              <button className="text-button" onClick={onClose}>
                <ArrowLeft size={15} />
                Add more funds
              </button>
              <button
                className="primary"
                disabled={!validAmounts}
                onClick={() => setStep(2)}
              >
                Simulate basket <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="cart-step simulation-step">
            <div className="simulation-toolbar">
              <div>
                <small>Historical period</small>
                <div className="period-chips">
                  {[
                    [12, "1Y"],
                    [36, "3Y"],
                    [60, "5Y"],
                    [120, "10Y"],
                  ].map(([value, label]) => (
                    <button
                      className={months === value ? "active" : ""}
                      key={value}
                      onClick={() => setMonths(Number(value))}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <label>
                <span>
                  Annual SIP step-up <b>{stepUp}%</b>
                </span>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="5"
                  value={stepUp}
                  onChange={(event) => setStepUp(Number(event.target.value))}
                />
              </label>
              <div className="segmented metric-toggle">
                <button
                  className={metric === "absolute" ? "active" : ""}
                  onClick={() => setMetric("absolute")}
                >
                  Absolute
                </button>
                <button
                  className={metric === "xirr" ? "active" : ""}
                  onClick={() => setMetric("xirr")}
                >
                  XIRR
                </button>
              </div>
            </div>
            {loadingHistory && (
              <div className="simulation-loading" role="status">
                <RefreshCw className="spin" size={19} />
                Loading selected funds’ NAV histories only…
              </div>
            )}
            {Object.keys(historyErrors).length > 0 && (
              <div className="cart-error" role="alert">
                Could not load every selected scheme.{" "}
                <button
                  className="text-button"
                  onClick={() => setRetry((value) => value + 1)}
                >
                  Retry histories
                </button>
              </div>
            )}
            {aggregate.points.length > 1 && (
              <>
                <section className="basket-result">
                  <div>
                    <small>TOTAL CONTRIBUTIONS</small>
                    <b>{money(aggregate.invested)}</b>
                  </div>
                  <div>
                    <small>HISTORICAL END VALUE</small>
                    <b>{money(aggregate.value)}</b>
                  </div>
                  <div>
                    <small>GAIN / LOSS</small>
                    <b className={aggregate.gain < 0 ? "negative" : "positive"}>
                      {money(aggregate.gain)}
                    </b>
                  </div>
                  <div>
                    <small>
                      {metric === "xirr" ? "BASKET XIRR" : "ABSOLUTE RETURN"}
                    </small>
                    <strong
                      className={
                        (metric === "xirr"
                          ? aggregate.xirr
                          : aggregate.absolute)! < 0
                          ? "negative"
                          : "positive"
                      }
                    >
                      {percent(
                        metric === "xirr" ? aggregate.xirr : aggregate.absolute,
                      )}
                    </strong>
                  </div>
                </section>
                <BasketChart points={aggregate.points} />
              </>
            )}
            <div className="simulated-funds">
              {simulations.map(({ fund, result }) => (
                <article key={fund.id}>
                  <div>
                    <b>{fund.name}</b>
                    <small>
                      {fundOverviews[fund.id]?.benchmark ||
                        "Benchmark in latest factsheet"}
                    </small>
                  </div>
                  {result ? (
                    <>
                      <span>
                        <small>Invested</small>
                        <b>{money(result.invested)}</b>
                      </span>
                      <span>
                        <small>End value</small>
                        <b>{money(result.value)}</b>
                      </span>
                      <span>
                        <small>XIRR</small>
                        <b
                          className={
                            (result.xirr || 0) < 0 ? "negative" : "positive"
                          }
                        >
                          {percent(result.xirr)}
                        </b>
                      </span>
                    </>
                  ) : (
                    <span className="simulation-pending">
                      {historyErrors[fund.schemeCode]
                        ? "Unavailable"
                        : "Loading…"}
                    </span>
                  )}
                </article>
              ))}
            </div>
            <p className="simulation-disclaimer">
              <ShieldCheck size={16} />
              Historical replay only—not a forecast. It excludes taxes, exit
              load, mandate failures and actual execution timing. The benchmark
              label is shown for context; no benchmark return is invented
              without verified TRI history.
            </p>
            <div className="cart-actions">
              <button className="text-button" onClick={() => setStep(1)}>
                <ArrowLeft size={15} />
                Edit cart
              </button>
              <button
                className="primary"
                disabled={!completeSimulation}
                onClick={() => setStep(3)}
              >
                Use these SIP amounts <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="cart-step">
            <div className="checkout-form">
              <label>
                Full name
                <input
                  aria-label="Full name"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="As you want Capital Sense to address you"
                />
              </label>
              <label>
                Investor status
                <select
                  aria-label="Investor status"
                  value={investorType}
                  onChange={(event) => setInvestorType(event.target.value)}
                >
                  <option value="new">New mutual fund investor</option>
                  <option value="existing">
                    Existing mutual fund investor
                  </option>
                </select>
              </label>
              <label>
                Preferred monthly SIP date
                <select
                  aria-label="Preferred monthly SIP date"
                  value={sipDay}
                  onChange={(event) => setSipDay(event.target.value)}
                >
                  {[1, 5, 10, 15, 20, 21, 25].map((day) => (
                    <option key={day} value={day}>
                      {day} of every month
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="privacy-note">
              <ShieldCheck size={18} />
              <p>
                First, send this request on WhatsApp. Capital Sense will reply
                and guide the AssetPlus onboarding, KYC, mandate and
                confirmation steps. Never send PAN, OTP or bank details in the
                chat.
              </p>
            </div>
            <div className="cart-actions">
              <button className="text-button" onClick={() => setStep(2)}>
                <ArrowLeft size={15} />
                Back to simulation
              </button>
              <button
                className="primary"
                disabled={!ready}
                onClick={() => setStep(4)}
              >
                Review WhatsApp message <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="cart-step">
            <section className="order-review">
              <div>
                <small>REQUEST ID</small>
                <b>{requestId}</b>
              </div>
              <div>
                <small>INVESTOR</small>
                <b>{name.trim()}</b>
              </div>
              <div>
                <small>MONTHLY TOTAL</small>
                <strong>{money(total)}</strong>
              </div>
              <div>
                <small>SIMULATION</small>
                <b>{months / 12}Y reviewed</b>
              </div>
            </section>
            <div className="review-funds">
              {cart.map((fund) => (
                <div key={fund.id}>
                  <span>
                    <b>{fund.name}</b>
                    <small>Regular Growth · {fund.schemeCode}</small>
                  </span>
                  <strong>{money(fund.sipAmount)}</strong>
                </div>
              ))}
            </div>
            <label className="order-consent">
              <input
                type="checkbox"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
              />
              <span>
                I want to send this SIP assistance request to Capital Sense on
                WhatsApp. I understand this does not create an order, mandate or
                payment. Final scheme documents, suitability, KYC and
                transaction details must be confirmed separately.
              </span>
            </label>
            <a
              className={`whatsapp-order ${consent ? "" : "disabled"}`}
              href={consent ? whatsappUrl : undefined}
              aria-disabled={!consent}
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              onClick={(event) => {
                if (!consent) event.preventDefault();
                else setOpened(true);
              }}
            >
              <MessageCircle size={20} />
              Review and send on WhatsApp <ExternalLink size={16} />
            </a>
            <small className="whatsapp-recipient">
              Draft addressed to Capital Sense at +91 88504 05723. You review it
              and press Send in WhatsApp.
            </small>
            {opened && (
              <div className="whatsapp-opened" role="status">
                <Check size={17} />
                <span>
                  <b>WhatsApp opened.</b> Press Send there. Capital Sense
                  receives the intimation first and then helps with onboarding.
                </span>
              </div>
            )}
            <div className="cart-actions">
              <button className="text-button" onClick={() => setStep(3)}>
                <ArrowLeft size={15} />
                Edit details
              </button>
              {opened && (
                <>
                  <button className="secondary" onClick={onClear}>
                    Clear cart
                  </button>
                  <button className="primary" onClick={onInvest}>
                    Continue to AssetPlus onboarding <ArrowRight size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
