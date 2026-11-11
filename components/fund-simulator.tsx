"use client";
import { useMemo, useState } from "react";
import { ArrowRight, Info, ShieldCheck, Trash2, X } from "lucide-react";
import type { NavHistory } from "../lib/mfapi";
import { simulateHistory, type SimulationMode } from "../lib/fund-simulation";
import { fundOverviews } from "../lib/fund-overviews";
import { AssetPlusEntry } from "./assetplus-onboarding";

export type BasketFund = { id: string; name: string; history: NavHistory };
const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
    notation: value >= 100000 ? "compact" : "standard",
  }).format(value);
const pct = (value: number | null) =>
  value === null
    ? "Not available"
    : `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
const date = (value: string) =>
  new Date(value + "T00:00:00Z").toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });

function ValueChart({
  points,
}: {
  points: { date: string; invested: number; value: number }[];
}) {
  const data = points.filter(
    (_, i) =>
      i % Math.max(1, Math.ceil(points.length / 120)) === 0 ||
      i === points.length - 1,
  );
  if (data.length < 2) return null;
  const width = 720,
    height = 230,
    pad = 18,
    max = Math.max(...data.flatMap((p) => [p.value, p.invested]), 1),
    x = (i: number) => pad + (i * (width - pad * 2)) / (data.length - 1),
    y = (v: number) => height - pad - (v * (height - pad * 2)) / max,
    path = (key: "value" | "invested") =>
      data
        .map(
          (p, i) =>
            `${i ? "L" : "M"} ${x(i).toFixed(1)} ${y(p[key]).toFixed(1)}`,
        )
        .join(" ");
  return (
    <div className="simulation-chart">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Historical value and amount invested"
      >
        <path
          className="simulation-grid"
          d={`M ${pad} ${height - pad} H ${width - pad}`}
        />
        <path className="simulation-invested-line" d={path("invested")} />
        <path className="simulation-value-line" d={path("value")} />
      </svg>
      <div className="simulation-legend">
        <span>
          <i className="value" />
          Fund value
        </span>
        <span>
          <i />
          Amount invested
        </span>
        <small>
          {date(data[0].date)} — {date(data.at(-1)!.date)}
        </small>
      </div>
    </div>
  );
}

export default function FundSimulator({
  basket,
  onRemove,
  onClose,
  onInvest,
}: {
  basket: BasketFund[];
  onRemove: (id: string) => void;
  onClose: () => void;
  onInvest: () => void;
}) {
  const [active, setActive] = useState(basket[0]?.id || ""),
    [mode, setMode] = useState<SimulationMode>("sip"),
    [amount, setAmount] = useState(5000),
    [months, setMonths] = useState(60),
    [stepUp, setStepUp] = useState(0),
    [metric, setMetric] = useState<"absolute" | "annualized">("annualized");
  const item = basket.find((f) => f.id === active) || basket[0],
    overview = item ? fundOverviews[item.id] : null;
  const availableMonths = item
    ? Math.floor(
        (Date.parse(item.history.date) -
          Date.parse(item.history.points[0].date)) /
          (30.44 * 86400000),
      )
    : 0;
  const result = useMemo(
    () =>
      item
        ? simulateHistory(item.history, {
            mode,
            amount,
            months,
            annualStepUp: stepUp,
          })
        : null,
    [item, mode, amount, months, stepUp],
  );
  const returnValue =
    metric === "absolute"
      ? (result?.absolute ?? null)
      : mode === "sip"
        ? (result?.xirr ?? null)
        : (result?.cagr ?? null);
  if (!item) return null;
  return (
    <div className="overlay simulator-overlay" onClick={onClose}>
      <section
        className="modal fund-simulator"
        role="dialog"
        aria-modal="true"
        aria-label="Historical returns simulator"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="close icon-btn"
          aria-label="Close simulator"
          onClick={onClose}
        >
          <X />
        </button>
        <header>
          <span className="eyebrow">RESEARCH BASKET / HISTORICAL REPLAY</span>
          <h2>Test the habit before you act.</h2>
          <p>
            Replay a one-time investment or monthly SIP against published NAV
            history. This is not a forecast or recommendation.
          </p>
        </header>
        <div className="basket-tabs" role="tablist">
          {basket.map((fund) => (
            <button
              role="tab"
              aria-selected={fund.id === item.id}
              key={fund.id}
              onClick={() => setActive(fund.id)}
            >
              <span>{fund.name}</span>
              <Trash2
                size={14}
                onClick={(event) => {
                  event.stopPropagation();
                  onRemove(fund.id);
                }}
              />
            </button>
          ))}
        </div>
        <div className="simulator-grid">
          <aside className="simulator-controls">
            <div className="segmented">
              <button
                className={mode === "lumpsum" ? "active" : ""}
                onClick={() => setMode("lumpsum")}
              >
                One-time
              </button>
              <button
                className={mode === "sip" ? "active" : ""}
                onClick={() => setMode("sip")}
              >
                Monthly SIP
              </button>
            </div>
            <label>
              <span>
                {mode === "sip" ? "Monthly amount" : "Investment amount"}{" "}
                <b>{money(amount)}</b>
              </span>
              <input
                type="range"
                min={mode === "sip" ? 500 : 10000}
                max={mode === "sip" ? 100000 : 1000000}
                step={mode === "sip" ? 500 : 10000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </label>
            {mode === "sip" && (
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
                  onChange={(e) => setStepUp(Number(e.target.value))}
                />
              </label>
            )}
            <div>
              <small>Replay period</small>
              <div className="period-chips">
                {[
                  [12, "1Y"],
                  [36, "3Y"],
                  [60, "5Y"],
                  [120, "10Y"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    disabled={Number(value) > availableMonths}
                    className={months === value ? "active" : ""}
                    onClick={() => setMonths(Number(value))}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {result && (
              <dl className="simulation-summary">
                <div>
                  <dt>Total invested</dt>
                  <dd>{money(result.invested)}</dd>
                </div>
                <div>
                  <dt>Gain / loss</dt>
                  <dd className={result.gain < 0 ? "negative" : "positive"}>
                    {money(result.gain)}
                  </dd>
                </div>
                <div>
                  <dt>Ending value</dt>
                  <dd>{money(result.value)}</dd>
                </div>
                <div>
                  <dt>
                    {mode === "sip"
                      ? `${result.instalments} instalments`
                      : "Purchase date"}
                  </dt>
                  <dd>
                    {mode === "sip"
                      ? date(result.startDate)
                      : new Date(
                          result.startDate + "T00:00:00Z",
                        ).toLocaleDateString("en-IN")}
                  </dd>
                </div>
              </dl>
            )}
          </aside>
          <main className="simulator-visual">
            <div className="simulation-heading">
              <div>
                <small>{item.name}</small>
                <strong>
                  {result ? money(result.value) : "Insufficient history"}
                </strong>
              </div>
              <div className="segmented metric-toggle">
                <button
                  className={metric === "absolute" ? "active" : ""}
                  onClick={() => setMetric("absolute")}
                >
                  Absolute
                </button>
                <button
                  className={metric === "annualized" ? "active" : ""}
                  onClick={() => setMetric("annualized")}
                >
                  {mode === "sip" ? "XIRR" : "CAGR"}
                </button>
              </div>
            </div>
            {result && (
              <>
                <div className="return-callout">
                  <span
                    className={
                      returnValue !== null && returnValue < 0
                        ? "negative"
                        : "positive"
                    }
                  >
                    {pct(returnValue)}
                  </span>
                  <small>
                    {metric === "absolute"
                      ? "Absolute return"
                      : mode === "sip"
                        ? "Annualized XIRR"
                        : "Annualized CAGR"}{" "}
                    · historical
                  </small>
                </div>
                <ValueChart points={result.points} />
                <div className="simulation-bars">
                  <article>
                    <div className="stack-bar">
                      <i
                        style={{
                          height: `${Math.max(8, Math.min(100, (result.invested / Math.max(result.invested, result.value)) * 100))}%`,
                        }}
                      />
                      <b
                        className={result.gain < 0 ? "loss" : ""}
                        style={{
                          height: `${Math.max(0, Math.min(42, (Math.abs(result.gain) / Math.max(result.invested, result.value)) * 100))}%`,
                        }}
                      />
                    </div>
                    <strong>{money(result.value)}</strong>
                    <small>This fund</small>
                  </article>
                  <article className="benchmark-locked">
                    <div>
                      <Info size={18} />
                      <b>Benchmark history not connected</b>
                    </div>
                    <strong>{overview?.benchmark || "See factsheet"}</strong>
                    <small>We won’t invent a TRI return.</small>
                  </article>
                </div>
              </>
            )}
          </main>
        </div>
        <section className="simulation-boundary">
          <ShieldCheck size={20} />
          <div>
            <b>What this replay means</b>
            <p>
              NAV dates can differ from your actual SIP debit date. It excludes
              taxes, exit load, transaction timing and provider execution. Past
              performance does not predict future returns.
            </p>
          </div>
        </section>
        <section className="simulation-handoff">
          <div>
            <span className="eyebrow">FINISHED RESEARCHING?</span>
            <h3>Review the handoff—no order is created.</h3>
            <p>
              Your basket and amounts stay in Stride. AssetPlus opens separately
              for KYC, mandate and transaction steps.
            </p>
          </div>
          <AssetPlusEntry onOpen={onInvest} />
        </section>
        <button className="text-button simulator-done" onClick={onClose}>
          Keep researching <ArrowRight size={15} />
        </button>
      </section>
    </div>
  );
}
