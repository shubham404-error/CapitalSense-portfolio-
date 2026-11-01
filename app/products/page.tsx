import Link from 'next/link';
import { ArrowDown, ArrowUpRight, ChartNoAxesCombined, Compass, Layers3, ScanLine, Search, Target } from 'lucide-react';

export const metadata = {
  title: 'CapitalSense & Paisaan | Products',
  description: 'Explore Indian equity markets with CapitalSense Market Intelligence, or bring clarity to financial goals and investment choices with Paisaan.',
};

const marketFeatures = [
  { icon: Compass, title: 'Read the market environment', name: 'Market Regime Intelligence', description: 'Explore market structure, breadth and alignment to understand whether conditions are constructive, weakening or defensive.' },
  { icon: ScanLine, title: 'Find where leadership is emerging', name: 'Relative Strength & Screening', description: 'Explore leading stocks, sectors and emerging trends to focus your research across the Indian equity universe.' },
  { icon: Search, title: 'Take a closer look at a company', name: 'Stock Research & Analysis', description: 'Compare stocks and explore technical and fundamental characteristics, with AI-assisted research to support further investigation.' },
];
const moneyFeatures = [
  { icon: Target, title: 'Put a number and a date to a goal', name: 'Future Me', description: 'Explore the amount you may need, your time horizon and the savings required to work towards a future goal.' },
  { icon: Layers3, title: 'Understand what you already own', name: 'Money Mirror', description: 'Examine portfolio composition, concentration and potential gaps so you can ask better questions about your investments.' },
  { icon: Compass, title: 'Give your choices a framework', name: 'Decision Intelligence', description: 'Explore Fund Match, IPO Lens and Baskets to evaluate investment choices using relevant criteria, supported by financial explainers.' },
];

function FeatureList({ features }: { features: typeof marketFeatures }) {
  return <ul className="product-features">{features.map(({ icon: Icon, title, name, description }) => <li key={name}>
    <Icon size={22} strokeWidth={1.4} aria-hidden="true" />
    <div><span className="product-feature-name">{name}</span><h3>{title}</h3><p>{description}</p></div>
  </li>)}</ul>;
}

function MarketOverview() {
  return <figure className="product-overview market-overview">
    <div className="product-diagram-heading"><ChartNoAxesCombined size={20} aria-hidden="true" /><span>FROM MARKET CONTEXT TO FOCUSED RESEARCH</span></div>
    <ol className="market-research-path">
      <li><span className="diagram-step">01</span><div><strong>Understand the environment</strong><p>Structure · Breadth · Alignment</p></div></li>
      <li><span className="diagram-step">02</span><div><strong>Explore market leadership</strong><p>Sectors · Relative strength · Trends</p></div></li>
      <li><span className="diagram-step">03</span><div><strong>Investigate individual stocks</strong><p>Screen · Compare · Research</p></div></li>
    </ol>
    <div className="product-diagram-result"><span>YOUR STARTING POINT</span><strong>A shortlist worth researching.</strong><p>A structured way to narrow the field before going deeper.</p></div>
    <figcaption>Feature overview · Illustrates the research workflow, not live market data.</figcaption>
  </figure>;
}

function MoneyOverview() {
  return <figure className="product-overview money-overview">
    <div className="product-diagram-heading"><Target size={20} aria-hidden="true" /><span>FROM A FINANCIAL QUESTION TO A CLEARER NEXT STEP</span></div>
    <div className="money-question">“What will it take to reach my goal?”</div>
    <ol className="money-planning-path">
      <li><span>01 / DEFINE</span><strong>The goal</strong><p>What amount do you need?</p></li>
      <li><span>02 / FRAME</span><strong>The timeframe</strong><p>When will you need it?</p></li>
      <li><span>03 / EXPLORE</span><strong>The savings</strong><p>What could you set aside?</p></li>
    </ol>
    <div className="product-diagram-result"><span>YOUR STARTING POINT</span><strong>A goal you can start planning for.</strong><p>Then explore your portfolio and compare the choices ahead.</p></div>
    <figcaption>Feature overview · A planning framework, not a personalised calculation.</figcaption>
  </figure>;
}

export default function Products() {
  return <main className="inner-page page-products"><div className="container">
    <header className="products-intro">
      <span className="eyebrow">PRODUCTS AT CAPITALSENSE</span>
      <h1>Explore markets.<br /><em>Make clearer money decisions.</em></h1>
      <p className="page-lead">Two products for two different questions: where to focus your equity research, and how to make sense of your own financial choices.</p>
      <nav className="product-jump-links" aria-label="Explore our products">
        <a href="#market-intelligence"><ChartNoAxesCombined size={18} aria-hidden="true" /><span>For equity research<strong>CapitalSense</strong></span><ArrowDown size={16} aria-hidden="true" /></a>
        <a href="#paisaan"><Target size={18} aria-hidden="true" /><span>For personal finance<strong>Paisaan</strong></span><ArrowDown size={16} aria-hidden="true" /></a>
      </nav>
    </header>

    <section id="market-intelligence" className="product-showcase" aria-labelledby="market-title">
      <div className="product-section-top"><span className="eyebrow">01 / MARKET INTELLIGENCE & EQUITY RESEARCH</span><span className="product-status"><i aria-hidden="true" />Public beta</span></div>
      <div className="product-showcase-grid">
        <div className="product-story">
          <h2 id="market-title">CapitalSense <span>Market Intelligence</span></h2>
          <p className="product-promise">See the market context.{' '}<br />Find your next research question.</p>
          <p>For active equity investors, self-directed traders, positional investors and analysts seeking a systematic view of the Indian equity market.</p>
          <a className="button primary product-launch" href="https://capitalsense.shubhamtejani9.workers.dev/" target="_blank" rel="noopener noreferrer">Explore CapitalSense <ArrowUpRight size={18} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
          <p className="product-access">Free public beta · No mandatory account</p>
        </div>
        <MarketOverview />
      </div>
      <FeatureList features={marketFeatures} />
      <div className="product-outcome"><span className="eyebrow">ON YOUR FIRST VISIT</span><p>Understand the market environment, explore relative strength, and build a structured shortlist of stocks for further research.</p></div>
      <p className="product-release-note"><strong>Still evolving.</strong> Advanced functionality and research safeguards are being refined. Treat the beta as a research aid; its outputs are not validated investment signals.</p>
    </section>

    <section id="paisaan" className="product-showcase product-paisaan" aria-labelledby="paisaan-title">
      <div className="product-section-top"><span className="eyebrow">02 / PERSONAL FINANCE & INVESTMENT DECISION SUPPORT</span><span className="product-status"><i aria-hidden="true" />Early-stage MVP</span></div>
      <div className="product-showcase-grid">
        <div className="product-story">
          <h2 id="paisaan-title">Paisaan</h2>
          <p className="product-promise">Turn “someday” into a goal{' '}<br />you can begin to plan for.</p>
          <p>For young professionals, salaried savers and mutual fund investors who want to understand their goals, portfolios and investment choices.</p>
          <a className="button primary product-launch" href="https://paisaan-decision-studio.shubhamtejani9.workers.dev/" target="_blank" rel="noopener noreferrer">Explore Paisaan <ArrowUpRight size={18} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
          <p className="product-access">Public prototype · No paid subscription required</p>
        </div>
        <MoneyOverview />
      </div>
      <FeatureList features={moneyFeatures} />
      <div className="product-outcome"><span className="eyebrow">ON YOUR FIRST VISIT</span><p>Start with a financial goal: explore the amount, timeframe and savings it could involve. Or examine your portfolio and identify questions to investigate before investing.</p></div>
      <p className="product-release-note"><strong>Still evolving.</strong> Some advanced diagnostics and comparison capabilities are incomplete or changing as the MVP develops.</p>
    </section>

    <aside className="products-closing" aria-label="Product scope">
      <div><span className="eyebrow">BETTER QUESTIONS. MORE INFORMED DECISIONS.</span><h2>Tools to explore.{' '}<br /><em>Room for your own judgement.</em></h2></div>
      <div><p>Both products support research and financial understanding. Their outputs are starting points for investigation, not personalised investment advice or promises of returns.</p><Link className="text-link" href="/research">Explore our research approach <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
    </aside>
  </div></main>;
}
