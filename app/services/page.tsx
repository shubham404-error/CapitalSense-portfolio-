import Link from 'next/link';
export const metadata = { title: 'How We Help Investors', description: 'Research-led mutual fund distribution, portfolio understanding and investor education from CapitalSense.' };
const steps=[
['01','Understand','Start with the goal, time horizon, liquidity needs and existing investments.'],
['02','Structure','Identify the role different mutual fund categories and portfolio exposures may play.'],
['03','Decide','Compare relevant options, risks, costs and scheme information before acting.'],
['04','Review','Revisit the portfolio when goals, cash flows or material investment characteristics change.'],
];
export default function Services(){return <main className="inner-page"><div className="container">
<span className="eyebrow">HOW WE HELP</span><h1 data-reveal="up">Investment decisions need<br/><em>context before products.</em></h1>
<p className="page-lead" data-reveal="up">CapitalSense focuses on mutual fund distribution, portfolio understanding and investor education. The objective is to help you understand what you own, why you own it and how it connects to a real financial goal.</p>

<div className="inner-cards service-choice-grid" data-reveal="up">
<article><span className="eyebrow">01 / INDIVIDUALS & FAMILIES</span><h2>Build around goals, not trends.</h2><p>For investors starting out or trying to make an existing mutual fund approach more intentional. We begin with the purpose, time horizon and risk context before discussing products.</p><Link className="text-link" href="/services/individual-investors">Explore individual investor services ↗</Link></article>
<article><span className="eyebrow">02 / EXISTING PORTFOLIOS</span><h2>Bring structure to what you already own.</h2><p>For investors with multiple schemes or a larger mutual fund portfolio who want to understand concentration, overlap, liquidity, costs and ongoing servicing needs.</p><Link className="text-link" href="/services/hni-investors">Explore portfolio review support ↗</Link></article>
</div>

<div className="inner-block process-section" data-reveal="up"><h2>How the process works</h2><div className="inner-cards process-flow" data-reveal="up">{steps.map(([n,t,d])=><article key={n}><span className="eyebrow">STEP {n}</span><h2>{t}</h2><p>{d}</p></article>)}</div></div>

<div className="inner-block feature-list-section" data-reveal="up"><h2>What you should expect from CapitalSense</h2><p><strong>Plain-language explanations.</strong> Understand the purpose, risks and trade-offs before a product decision.</p><p><strong>Portfolio context.</strong> A fund is considered as part of a broader goal and portfolio, not only by its recent return.</p><p><strong>Transparent costs.</strong> Relevant plan structures, expense ratios, exit loads and distributor remuneration should be understood before investing.</p><p><strong>A documented scope.</strong> Where a conversation moves into mutual fund distribution, applicable registration, empanelment and scheme documentation govern the process.</p></div>

<div className="inner-block trust-callout" data-reveal="up"><h2>Our scope</h2><p>CapitalSense investor services are focused on mutual fund distribution, related servicing and investor education. The website does not provide stock-specific buy or sell calls, discretionary portfolio management or personalised securities recommendations.</p><Link className="text-link" href="/disclosures">Read disclosures and regulatory information ↗</Link></div>

<div className="inner-block action-panel" data-reveal="up"><h2>Start with your situation</h2><p>You do not need to arrive with a scheme in mind. Start with the goal, the portfolio question or the decision you are trying to make.</p><Link className="button primary" href="/connect">Start a conversation ↗</Link></div>
</div></main>}
