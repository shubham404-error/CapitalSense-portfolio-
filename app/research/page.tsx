import Link from 'next/link';
export const metadata = { title: 'Our Research Approach', description: 'How CapitalSense uses market research as context for disciplined investor decision-making.' };
const pillars=[
['01','Market regime','Understand the broad environment using trend and participation evidence.'],
['02','Market breadth','Look beneath headline index returns to see how widely a move is being shared.'],
['03','Relative strength','Study changing leadership across sectors and securities over defined periods.'],
['04','Trend structure','Organise price behaviour into repeatable observations rather than narratives.'],
['05','Systematic screening','Use explicit filters to narrow a research universe for deeper work.'],
['06','Risk and context','Read every positive signal alongside volatility, liquidity, concentration and valuation context.'],
];
export default function Research(){return <main className="inner-page"><div className="container">
<span className="eyebrow">OUR APPROACH</span><h1 data-reveal="up">Research to ask<br/><em>better questions.</em></h1>
<p className="page-lead" data-reveal="up">We use market and portfolio evidence to challenge first impressions. The aim is to understand risk and context—not to predict the next move.</p>

<div className="inner-block" data-reveal="up"><h2>What research adds to the conversation</h2><p>A portfolio can hold many funds yet depend on the same underlying companies or sectors. Research helps identify these exposures and examine whether a market narrative is supported by the data.</p><p>The result is a better question to discuss—not an instruction to transact.</p></div>

<div className="inner-block" data-reveal="up"><h2>The research lens</h2><div className="inner-cards research-lens-grid" data-reveal="up">{pillars.map(([n,t,d])=><article key={n}><span className="eyebrow">{n} / RESEARCH LENS</span><h2>{t}</h2><p>{d}</p></article>)}</div></div>

<div className="inner-block feature-list-section" data-reveal="up"><h2>From observation to interpretation</h2><p><strong>Observe.</strong> Start with identified data and a clearly defined universe.</p><p><strong>Measure.</strong> Apply explicit lookback periods, calculations and thresholds.</p><p><strong>Compare.</strong> Put the current reading against history, benchmarks and other parts of the market.</p><p><strong>Interpret.</strong> Explain what the evidence supports, what remains uncertain and what could invalidate the view.</p><p><strong>Review.</strong> Change the conclusion when the underlying evidence changes.</p></div>

<div className="inner-block" data-reveal="up"><h2>What we guard against</h2><p>Recent winners can look compelling. Screens can miss fundamentals. We document the assumptions and limitations before interpreting any result.</p><p>Research supports education and distribution conversations; it does not replace scheme documents or individual circumstances.</p></div>

<div className="inner-block" data-reveal="up"><h2>Research tools</h2><p>Our tools organise observations and calculations so that research can be inspected and repeated.</p><Link className="text-link" href="/ecosystem">Explore the technology work ↗</Link></div>

<div className="inner-block" data-reveal="up"><h2>Apply the process to your own questions</h2><p>Have a question about your mutual fund holdings or goals? Begin there.</p><Link className="button primary" href="/connect">Start a conversation ↗</Link><p><small>For general information on service scope and regulatory status, see our <Link href="/disclosures">disclosures</Link>.</small></p></div>
</div></main>}
