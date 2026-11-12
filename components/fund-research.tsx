"use client";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  ArrowUpRight,
  Check,
  ExternalLink,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  X,
} from "lucide-react";
import NavChart from "./nav-chart";
import type { CartFund } from "./fund-cart";
import { fundOverviews } from "../lib/fund-overviews";
import { fundCategories } from "../lib/fund-categories";
import source from "../config/fund-research.json";
import mapping from "../config/fund-mfapi-map.json";
import {
  AMFI_TER_DIRECTORY,
  FACTSHEET_DIRECTORY,
  historyMfapi,
  navMetrics,
  type NavHistory,
} from "../lib/mfapi";
import { amcBrandForScheme, amcLogoPath } from "../lib/amc-logos";

const launchFunds = source.funds.slice(0, 22);
const FundCart = dynamic(() => import("./fund-cart"), {
  ssr: false,
  loading: () => <p className="research-loading">Opening your SIP cart…</p>,
});
type ImportedFund = (typeof launchFunds)[number];
const mappedById = new Map(mapping.funds.map((f) => [f.id, f]));
const formatPercent = (value: number) =>
  `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
const formatDate = (date: string) =>
  new Date(date + "T00:00:00Z").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });

export default function FundResearch({ onInvest }: { onInvest: () => void }) {
  const [cart, setCart] = useState<CartFund[]>([]),
    [cartReady, setCartReady] = useState(false),
    [showCart, setShowCart] = useState(false),
    [query, setQuery] = useState(""),
    [category, setCategory] = useState("all"),
    [selected, setSelected] = useState<ImportedFund | null>(null),
    [snapshot, setSnapshot] = useState<NavHistory | null>(null),
    [navError, setNavError] = useState(""),
    [fetching, setFetching] = useState(false),
    [requestVersion, setRequestVersion] = useState(0);
  const categories = useMemo(
    () => Array.from(new Set(launchFunds.flatMap((f) => f.categories))).sort(),
    [],
  );
  const funds = launchFunds.filter(
    (f) =>
      (category === "all" || f.categories.includes(category)) &&
      query
        .toLowerCase()
        .split(/\s+/)
        .every((q) => f.name.toLowerCase().includes(q)),
  );
  const metrics = snapshot ? navMetrics(snapshot) : null;

  useEffect(() => {
    if (!selected) return;
    const entry = mappedById.get(selected.id);
    setSnapshot(null);
    setNavError("");
    if (!entry) {
      setNavError(
        "MFAPI has no verified Regular Growth match for this launch fund.",
      );
      return;
    }
    const controller = new AbortController();
    setFetching(true);
    historyMfapi(entry.schemeCode, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setSnapshot(data);
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setNavError(
            error instanceof Error
              ? error.message
              : "Could not fetch the NAV history. Please retry.",
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setFetching(false);
      });
    return () => controller.abort();
  }, [selected?.id, requestVersion]);
  useEffect(() => {
    const open = selected || showCart;
    if (!open) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelected(null);
        setShowCart(false);
      }
    };
    document.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = old;
      document.removeEventListener("keydown", close);
    };
  }, [selected, showCart]);
  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("stride-sip-cart-v1") || "[]",
      );
      if (Array.isArray(saved))
        setCart(
          saved.filter(
            (item): item is CartFund =>
              item &&
              typeof item.id === "string" &&
              typeof item.name === "string" &&
              /^\d{4,9}$/.test(String(item.schemeCode)) &&
              Number(item.sipAmount) >= 500,
          ),
        );
    } catch {
      /* Ignore malformed local-only drafts. */
    }
    setCartReady(true);
  }, []);
  useEffect(() => {
    if (cartReady)
      localStorage.setItem("stride-sip-cart-v1", JSON.stringify(cart));
  }, [cart, cartReady]);
  function open(fund: ImportedFund) {
    setSelected(fund);
    setSnapshot(null);
    setNavError("");
    setFetching(false);
  }
  function addToCart(fund: ImportedFund) {
    const mapped = mappedById.get(fund.id);
    if (!mapped || cart.some((item) => item.id === fund.id)) return;
    setCart((items) => [
      ...items,
      {
        id: fund.id,
        name: fund.name,
        schemeCode: mapped.schemeCode,
        sipAmount: 5000,
      },
    ]);
  }

  return (
    <div className="fund-page">
      <div className="fund-page-heading">
        <div>
          <span className="eyebrow">STRIDE LAUNCH SHORTLIST / MFAPI DATA</span>
          <h1>Find your kind of fund.</h1>
          <p>22 selected funds with direct Regular Growth NAV research.</p>
        </div>
        <div className="research-heading-actions">
          <span className="fund-data-badge">
            <span />
            MFAPI CONNECTED
          </span>
          <button
            className="sip-cart-button"
            onClick={() => setShowCart(true)}
            disabled={!cart.length}
          >
            <ShoppingBag size={18} />
            <span>SIP cart</span>
            <b>{cart.length}</b>
          </button>
        </div>
      </div>
      <section className="mapped-categories" aria-label="Fund categories">
        <div className="category-section-heading">
          <h2>Browse the shortlist</h2>
          <span>{categories.length} categories · 22 funds</span>
        </div>
        <div className="mapped-category-grid">
          {fundCategories
            .filter((tile) => categories.includes(tile.label))
            .map((tile) => (
              <button
                key={tile.id}
                aria-pressed={category === tile.label}
                onClick={() =>
                  setCategory(category === tile.label ? "all" : tile.label)
                }
              >
                <img
                  src={(process.env.NEXT_PUBLIC_BASE_PATH || "") + tile.image}
                  alt=""
                />
                <b>{tile.label}</b>
                <span>
                  {
                    launchFunds.filter((f) => f.categories.includes(tile.label))
                      .length
                  }{" "}
                  funds
                </span>
              </button>
            ))}
        </div>
      </section>
      <div className="research-source-note">
        <ShieldCheck size={20} />
        <div>
          <b>One tap opens verified fund data.</b>
          <p>
            The 22 launch funds are pre-mapped to explicit Regular Growth scheme
            codes. There is no second MFAPI search or plan-selection step.
          </p>
          <details>
            <summary>What MFAPI does and does not provide</summary>
            <p>
              MFAPI supplies scheme identity and dated NAV history. Returns,
              volatility and drawdown below are calculated from that history.
              Expense ratio, AUM, exit load and Riskometer are not supplied by
              MFAPI; verify them through AMFI and the official scheme factsheet.
            </p>
          </details>
        </div>
      </div>
      <div className="research-controls">
        <div className="fund-search">
          <Search size={18} />
          <input
            aria-label="Search launch funds"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the 22 funds…"
          />
        </div>
        <select
          aria-label="Research category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All shortlist categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="fund-list-meta">
        <span>
          <b>{category === "all" ? "All launch funds" : category}</b> · Showing{" "}
          {funds.length} of 22 funds
        </span>
        <span>Research only · not a recommendation</span>
      </div>
      <div className="research-list">
        {funds.map((f) => {
          const brand = amcBrandForScheme(f.name),
            mapped = mappedById.has(f.id);
          const inCart = cart.some((item) => item.id === f.id);
          return (
            <article key={f.id} className="research-fund-row">
              <button className="research-fund-main" onClick={() => open(f)}>
                {brand ? (
                  <span className="amc-logo">
                    <img
                      src={amcLogoPath(brand.logo)}
                      alt={brand.name + " logo"}
                      loading="lazy"
                    />
                  </span>
                ) : (
                  <span className="amc-monogram">
                    {f.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
                <div>
                  <b>{f.name}</b>
                  {brand && (
                    <span className="research-amc-name">{brand.name}</span>
                  )}
                  <span>
                    {f.categories.map((c) => (
                      <small key={c}>{c}</small>
                    ))}
                  </span>
                </div>
                <span className="research-row-action">
                  {mapped ? "View fund data" : "MFAPI unavailable"}{" "}
                  <ArrowUpRight size={16} />
                </span>
              </button>
              <button
                className={inCart ? "fund-cart-add added" : "fund-cart-add"}
                disabled={!mapped || inCart}
                onClick={() => addToCart(f)}
              >
                {inCart ? <Check size={16} /> : <Plus size={16} />}
                {inCart ? "In cart" : "Add to cart"}
              </button>
            </article>
          );
        })}
      </div>
      {!funds.length && (
        <div className="fund-empty">
          <Search size={25} />
          <h3>No matching launch fund.</h3>
          <p>Try another name or category.</p>
        </div>
      )}
      <p className="amc-logo-source">
        AMC marks are shown for identification only · Source: AMFI member
        directory · No endorsement implied.
      </p>
      <div className="research-directory-links">
        <a
          className="research-factsheet-link"
          href={AMFI_TER_DIRECTORY}
          target="_blank"
          rel="noreferrer"
        >
          <ExternalLink size={17} />
          <div>
            <b>Check expense ratios on AMFI</b>
            <small>
              Official TER directory. Select the AMC and exact scheme.
            </small>
          </div>
          <ArrowUpRight size={17} />
        </a>
        <a
          className="research-factsheet-link"
          href={FACTSHEET_DIRECTORY}
          target="_blank"
          rel="noreferrer"
        >
          <ExternalLink size={17} />
          <div>
            <b>Open official factsheets</b>
            <small>Verify AUM, Riskometer, exit load and scheme terms.</small>
          </div>
          <ArrowUpRight size={17} />
        </a>
      </div>

      {cart.length > 0 && (
        <aside className="research-basket" aria-label="SIP cart summary">
          <div>
            <span className="eyebrow">YOUR SIP CART</span>
            <strong>
              {cart.length} {cart.length === 1 ? "fund" : "funds"} selected
            </strong>
            <small>Simulation comes before the WhatsApp setup request.</small>
          </div>
          <button className="primary" onClick={() => setShowCart(true)}>
            Review SIP cart <ShoppingBag size={16} />
          </button>
        </aside>
      )}
      {showCart && (
        <FundCart
          cart={cart}
          onChange={setCart}
          onClose={() => setShowCart(false)}
          onClear={() => {
            setCart([]);
            setShowCart(false);
          }}
          onInvest={onInvest}
        />
      )}
      {selected && (
        <div className="overlay" onClick={() => setSelected(null)}>
          <section
            className="modal research-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Fund data"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close icon-btn"
              aria-label="Close fund data"
              autoFocus
              onClick={() => setSelected(null)}
            >
              <X />
            </button>
            <span className="eyebrow">
              REGULAR GROWTH · DIRECT MFAPI RESULT
            </span>
            <h2>{selected.name}</h2>
            {fetching && (
              <p className="research-loading" role="status">
                Loading the verified NAV history…
              </p>
            )}
            {navError && (
              <div className="fund-warning" role="alert">
                {navError}
                <button
                  className="text-button mfapi-retry"
                  onClick={() => setRequestVersion((v) => v + 1)}
                >
                  Retry fund data
                </button>
              </div>
            )}
            {snapshot && metrics && (
              <section className="mfapi-snapshot">
                <h3>{snapshot.name}</h3>
                <div className="fund-detail-nav">
                  <span>Latest available published NAV · MFAPI</span>
                  <strong>
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      maximumFractionDigits: 4,
                    }).format(snapshot.nav)}
                  </strong>
                  <small>Valuation date: {formatDate(snapshot.date)}</small>
                </div>
                {Date.now() - Date.parse(snapshot.date + "T00:00:00Z") >
                  7 * 86400000 && (
                  <p className="fund-warning">
                    This NAV is more than 7 days old. It is historical data, not
                    a current quote.
                  </p>
                )}
                <div className="fund-metric-grid">
                  {metrics.returns.map((metric) => (
                    <div key={metric.label}>
                      <small>
                        {metric.label} {metric.annualized ? "CAGR" : "return"}
                      </small>
                      <strong className={metric.value < 0 ? "negative" : ""}>
                        {formatPercent(metric.value)}
                      </strong>
                    </div>
                  ))}
                  <div>
                    <small>Annualized volatility</small>
                    <strong>
                      {metrics.annualizedVolatility === null
                        ? "Insufficient data"
                        : metrics.annualizedVolatility.toFixed(2) + "%"}
                    </strong>
                  </div>
                  <div>
                    <small>Maximum drawdown</small>
                    <strong className="negative">
                      {metrics.maxDrawdown === null
                        ? "—"
                        : metrics.maxDrawdown.toFixed(2) + "%"}
                    </strong>
                  </div>
                </div>
                <small className="metric-method">
                  NAV-derived through {formatDate(snapshot.date)}. Returns under
                  3 years are absolute; 3Y and 5Y are annualized. They are
                  historical, not forecasts.
                </small>
                <NavChart histories={[snapshot]} />
                <div className="fund-detail-actions">
                  <button
                    className="primary wide"
                    disabled={cart.some((fund) => fund.id === selected.id)}
                    onClick={() => addToCart(selected)}
                  >
                    {cart.some((fund) => fund.id === selected.id)
                      ? "Added to SIP cart"
                      : "Add to SIP cart"}
                  </button>
                </div>
                <dl className="fund-facts">
                  <div>
                    <dt>Scheme code</dt>
                    <dd>{snapshot.code}</dd>
                  </div>
                  <div>
                    <dt>Fund house</dt>
                    <dd>{snapshot.amc}</dd>
                  </div>
                  <div>
                    <dt>MFAPI category</dt>
                    <dd>{snapshot.category}</dd>
                  </div>
                  <div>
                    <dt>NAV history begins</dt>
                    <dd>{formatDate(metrics.inceptionDate)}</dd>
                  </div>
                  <div>
                    <dt>Expense ratio / TER</dt>
                    <dd>
                      Not provided by MFAPI ·{" "}
                      <a
                        href={AMFI_TER_DIRECTORY}
                        target="_blank"
                        rel="noreferrer"
                      >
                        check AMFI
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt>AUM / exit load / Riskometer</dt>
                    <dd>Verify in the official factsheet</dd>
                  </div>
                </dl>
                <section className="fund-overview">
                  <div>
                    <span className="eyebrow">FUND OVERVIEW</span>
                    <h3>Key scheme details</h3>
                    <small>
                      Changing fields are linked to current official documents.
                    </small>
                  </div>
                  <dl>
                    <div>
                      <dt>Benchmark</dt>
                      <dd>
                        {fundOverviews[selected.id]?.benchmark ||
                          "Check latest factsheet"}
                      </dd>
                    </div>
                    <div>
                      <dt>History begins</dt>
                      <dd>{formatDate(metrics.inceptionDate)}</dd>
                    </div>
                    <div>
                      <dt>Expense ratio</dt>
                      <dd>
                        <a
                          href={AMFI_TER_DIRECTORY}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Check current TER on AMFI
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt>AUM / minimum / exit load</dt>
                      <dd>
                        <a
                          href={FACTSHEET_DIRECTORY}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Check latest official factsheet
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt>Riskometer / turnover / tax</dt>
                      <dd>
                        Verify current scheme documents and your tax position
                      </dd>
                    </div>
                    <div>
                      <dt>Plan used here</dt>
                      <dd>Regular Growth · scheme {snapshot.code}</dd>
                    </div>
                  </dl>
                </section>
                <p>
                  Third-party NAV data is for research, not an executable price
                  or suitability assessment. No investment order is created.
                </p>
              </section>
            )}
            <div className="research-sheet-links">
              <a
                className="secondary wide"
                href={AMFI_TER_DIRECTORY}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink size={15} />
                Check TER on AMFI
              </a>
              <a
                className="secondary wide"
                href={FACTSHEET_DIRECTORY}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink size={15} />
                Open AMFI factsheets
              </a>
            </div>
            <small className="research-directory-note">
              These are official directories, not direct scheme PDFs. Verify the
              exact Regular Growth plan before acting.
            </small>
          </section>
        </div>
      )}
    </div>
  );
}
