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
<span className="eyebrow">OUR APPROACH</span><h1 data-reveal="up">Research is how we think.<br/><em>Not what we promise.</em></h1>
<p className="page-lead" data-reveal="up">CapitalSense uses structured market research to improve the quality of investment conversations. The objective is not to predict every market move. It is to understand context, challenge assumptions and make the reasoning behind a decision more visible.</p>

<div className="inner-block" data-reveal="up"><h2>Why research matters to an investor</h2><p>A mutual fund or portfolio decision does not happen in isolation. Market conditions, concentration, participation, valuation, liquidity and investor behaviour can all affect how a portfolio feels and performs. Research helps us frame those questions more consistently.</p><p>That does not turn a market signal into a recommendation. Goals, time horizon, portfolio structure and investor circumstances remain central to the decision.</p></div>

<div className="inner-block" data-reveal="up"><h2>The research lens</h2><div className="inner-cards" data-reveal="up">{pillars.map(([n,t,d])=><article key={n}><span className="eyebrow">{n} / RESEARCH LENS</span><h2>{t}</h2><p>{d}</p></article>)}</div></div>

<div className="inner-block" data-reveal="up"><h2>From observation to interpretation</h2><p><strong>Observe.</strong> Start with identified data and a clearly defined universe.</p><p><strong>Measure.</strong> Apply explicit lookback periods, calculations and thresholds.</p><p><strong>Compare.</strong> Put the current reading against history, benchmarks and other parts of the market.</p><p><strong>Interpret.</strong> Explain what the evidence supports, what remains uncertain and what could invalidate the view.</p><p><strong>Review.</strong> Change the conclusion when the underlying evidence changes.</p></div>

<div className="inner-block" data-reveal="up"><h2>What this approach is designed to prevent</h2><p>It is easy to mistake a recent winner for a durable trend, a strong narrative for evidence or a screen result for a complete investment case. A documented process creates friction before those shortcuts become decisions.</p><p>The framework is therefore a decision-support discipline. It does not guarantee outcomes and it does not replace scheme documents, portfolio context or investor-specific considerations.</p></div>

<div className="inner-block" data-reveal="up"><h2>Research tools</h2><p>CapitalSense also develops internal and public-facing tools that organise market information into repeatable workflows. They are supporting infrastructure for research and education, not a separate promise of automated investment decisions.</p><Link className="text-link" href="/ecosystem">Explore the technology work ↗</Link></div>

<div className="inner-block" data-reveal="up"><h2>Apply the process to your own questions</h2><p>If you are trying to understand a mutual fund portfolio, a goal or an investment decision, begin with the situation rather than the market signal.</p><Link className="button primary" href="/connect">Start a conversation ↗</Link><p><small>For general information on service scope and regulatory status, see our <Link href="/disclosures">disclosures</Link>.</small></p></div>
</div></main>}