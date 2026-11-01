import {InvestorJourney} from '@/components/service-illustrations';
import Link from 'next/link';
export const metadata={title:'About CapitalSense',description:'Why CapitalSense exists, how it works and the principles behind its investor-first approach.'};
const principles=[
['01','Process before prediction','Markets are uncertain. A repeatable process matters more than pretending to know every next move.'],
['02','Clarity over complexity','Financial information is useful only when the investor can understand the decision and its trade-offs.'],
['03','Evidence over excitement','Recent returns, headlines and stories should not replace portfolio context and documented reasoning.'],
['04','Education before action','A better-informed investor can ask better questions and make more deliberate decisions.'],
];
export default function About(){return <main className="inner-page page-about"><div className="container">
<span className="eyebrow">ABOUT CAPITALSENSE</span>
<h1 data-reveal="up">Built for investors who want{' '}<br/><em>to understand before they act.</em></h1>
<p className="page-lead" data-reveal="up">CapitalSense brings mutual fund distribution and investor education together with a research-led approach to understanding portfolios.</p>
<InvestorJourney/>

<div className="inner-block" data-reveal="up"><h2>Why CapitalSense exists</h2><p>A fund ranking tells you what performed well. It does not tell you whether the fund fits your goal, time horizon or existing portfolio.</p><p>CapitalSense begins with those missing questions, then explains the available choices and their trade-offs.</p></div>

<div className="inner-block" data-reveal="up"><h2>How we think</h2><div className="inner-cards" data-reveal="up">{principles.map(([n,t,d])=><article key={n}><span className="eyebrow">{n} / PRINCIPLE</span><h2>{t}</h2><p>{d}</p></article>)}</div></div>

<div className="inner-block" data-reveal="up"><h2>What we do</h2><p><strong>Investor conversations:</strong> goals, time horizon, liquidity, existing holdings and the role mutual funds may play.</p><p><strong>Research:</strong> structured market and portfolio analysis used to add context and discipline to the decision process.</p><p><strong>Education:</strong> practical explanations of mutual funds, risk, costs, portfolio construction and investor behaviour.</p><p><strong>Technology:</strong> tools that organise information and make research workflows easier to explore.</p></div>

<div className="inner-block" data-reveal="up"><h2>Who is behind CapitalSense</h2><p>CapitalSense is founder-led. A named founder biography, verified credentials, distributor registration particulars and relevant empanelments must be published before the site is used to solicit distribution business.</p></div>

<div className="inner-block" data-reveal="up"><h2>What guides our work</h2><p>We explain risks, costs and uncertainty as clearly as potential opportunities. No return is guaranteed, and a conversation need not lead to a transaction.</p><Link className="text-link" href="/disclosures">Read our disclosures ↗</Link></div>

<div className="inner-block" data-reveal="up"><h2>See how the approach works</h2><div className="hero-actions"><Link className="button primary" href="/services">How we help investors ↗</Link><Link className="text-link" href="/research">Our research approach ↗</Link></div></div>
</div></main>}
