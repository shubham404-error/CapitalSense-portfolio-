import Link from 'next/link';
export const metadata={title:'Technology at CapitalSense',description:'Technology projects that support CapitalSense research and investor education.'};
export default function Ecosystem(){return <main className="inner-page page-ecosystem"><div className="container">
<span className="eyebrow">TECHNOLOGY AT CAPITALSENSE</span><h1 data-reveal="up">Tools that support<br/><em>the thinking behind the service.</em></h1>
<p className="page-lead" data-reveal="up">These are supporting projects, not separate promises about investment outcomes. They organise research and make financial concepts easier to explore.</p>

<div className="inner-cards" data-reveal="up">
<article><span className="eyebrow">01 / MARKET RESEARCH</span><h2>CapitalSense Market Intelligence</h2><p>A research workspace for exploring market regimes, breadth, relative strength, trend classification and systematic screening.</p><p><strong>Role:</strong> support structured market research and make the methodology easier to inspect.</p><a className="text-link" href="https://capitalsense.shubhamtejani9.workers.dev/" target="_blank" rel="noreferrer">Open the research platform ↗</a></article>
<article><span className="eyebrow">02 / PERSONAL FINANCE EDUCATION</span><h2>Paisaan</h2><p>A decision-support experiment focused on helping users understand personal finance concepts, goals and trade-offs in a more accessible format.</p><p><strong>Role:</strong> improve financial understanding and explore better ways to present complex decisions.</p><a className="text-link" href="https://paisaan-decision-studio.shubhamtejani9.workers.dev/" target="_blank" rel="noreferrer">Explore Paisaan ↗</a></article>
</div>

<div className="inner-block" data-reveal="up"><h2>Shared principle</h2><p>Show the inputs, calculations and limitations so users can question the output.</p></div>

<div className="inner-block" data-reveal="up"><h2>How this fits CapitalSense</h2><p>Mutual fund distribution and investor education remain the core service. The tools are optional ways to explore the research behind it.</p><Link className="text-link" href="/research">See our research approach ↗</Link></div>
</div></main>}