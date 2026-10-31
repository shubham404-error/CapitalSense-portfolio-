import Link from 'next/link';
export const metadata={title:'About CapitalSense',description:'Why CapitalSense exists, how it works and the principles behind its investor-first approach.'};
const principles=[
['01','Process before prediction','Markets are uncertain. A repeatable process matters more than pretending to know every next move.'],
['02','Clarity over complexity','Financial information is useful only when the investor can understand the decision and its trade-offs.'],
['03','Evidence over excitement','Recent returns, headlines and stories should not replace portfolio context and documented reasoning.'],
['04','Education before action','A better-informed investor can ask better questions and make more deliberate decisions.'],
];
export default function About(){return <main className="inner-page"><div className="container">
<span className="eyebrow">ABOUT CAPITALSENSE</span>
<h1 data-reveal="up">Built for investors who want<br/><em>to understand before they act.</em></h1>
<p className="page-lead" data-reveal="up">CapitalSense is a founder-led, research-driven initiative focused on mutual fund distribution, investor education and clearer portfolio decision-making.</p>

<div className="inner-block" data-reveal="up"><h2>Why CapitalSense exists</h2><p>Investors have access to more financial information than ever, but more information does not automatically create better decisions. Product rankings, return screenshots, market commentary and conflicting opinions can make a simple goal unnecessarily complicated.</p><p>CapitalSense was built around a different idea: begin with the investor's objective, organise the relevant information and make the reasoning behind a decision easier to understand.</p></div>

<div className="inner-block" data-reveal="up"><h2>How we think</h2><div className="inner-cards principle-grid" data-reveal="up">{principles.map(([n,t,d])=><article key={n}><span className="eyebrow">{n} / PRINCIPLE</span><h2>{t}</h2><p>{d}</p></article>)}</div></div>

<div className="inner-block feature-list-section" data-reveal="up"><h2>What sits behind the service</h2><p><strong>Investor conversations:</strong> goals, time horizon, liquidity, existing holdings and the role mutual funds may play.</p><p><strong>Research:</strong> structured market and portfolio analysis used to add context and discipline to the decision process.</p><p><strong>Education:</strong> practical explanations of mutual funds, risk, costs, portfolio construction and investor behaviour.</p><p><strong>Technology:</strong> tools that organise information and make research workflows easier to explore.</p></div>

<div className="inner-block trust-callout" data-reveal="up"><h2>Founder-led and accountable</h2><p>CapitalSense is intentionally founder-led. That means the philosophy, research process and investor communication are expected to be consistent and personally accountable. Before launch, verified professional credentials, mutual fund distributor registration details and applicable empanelments should be displayed here and in the relevant onboarding process.</p></div>

<div className="inner-block" data-reveal="up"><h2>What we will not build the brand around</h2><p>CapitalSense does not rely on return promises, market-timing claims or product-of-the-month selling. The goal is to build trust through a clear process, transparent scope and useful investor education.</p><Link className="text-link" href="/disclosures">Read our disclosures ↗</Link></div>

<div className="inner-block action-panel" data-reveal="up"><h2>See how the approach works</h2><div className="hero-actions"><Link className="button primary" href="/services">How we help investors ↗</Link><Link className="text-link" href="/research">Our research approach ↗</Link></div></div>
</div></main>}
