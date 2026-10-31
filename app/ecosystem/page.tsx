import Link from 'next/link';
export const metadata={title:'Technology at CapitalSense',description:'Technology projects that support CapitalSense research and investor education.'};
export default function Ecosystem(){return <main className="inner-page"><div className="container">
<span className="eyebrow">TECHNOLOGY AT CAPITALSENSE</span><h1 data-reveal="up">Tools that support<br/><em>the thinking behind the service.</em></h1>
<p className="page-lead" data-reveal="up">Technology is supporting infrastructure at CapitalSense. It helps organise market information, explain financial concepts and make research workflows easier to explore. It is not a separate substitute for investor judgement.</p>

<div className="inner-cards" data-reveal="up">
<article><span className="eyebrow">01 / MARKET RESEARCH</span><h2>CapitalSense Market Intelligence</h2><p>A research workspace for exploring market regimes, breadth, relative strength, trend classification and systematic screening.</p><p><strong>Role:</strong> support structured market research and make the methodology easier to inspect.</p><a className="text-link" href="https://capitalsense.shubhamtejani9.workers.dev/" target="_blank" rel="noreferrer">Open the research platform ↗</a></article>
<article><span className="eyebrow">02 / PERSONAL FINANCE EDUCATION</span><h2>Paisaan</h2><p>A decision-support experiment focused on helping users understand personal finance concepts, goals and trade-offs in a more accessible format.</p><p><strong>Role:</strong> improve financial understanding and explore better ways to present complex decisions.</p><a className="text-link" href="https://paisaan-decision-studio.shubhamtejani9.workers.dev/" target="_blank" rel="noreferrer">Explore Paisaan ↗</a></article>
</div>

<div className="inner-block" data-reveal="up"><h2>The principle behind both tools</h2><p>Make the method visible, keep the assumptions understandable and make limitations clear. A useful tool should improve the quality of a question—not create false certainty.</p></div>

<div className="inner-block" data-reveal="up"><h2>Technology is a support layer</h2><p>The core CapitalSense proposition remains investor understanding, mutual fund distribution and a research-led decision process. These tools support that work rather than competing with it as separate business identities.</p><Link className="text-link" href="/research">See our research approach ↗</Link></div>
</div></main>}