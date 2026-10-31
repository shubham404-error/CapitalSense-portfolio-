import Link from 'next/link';
import {WhatsAppCta} from '@/components/whatsapp-cta';
export const metadata = { title: 'How We Help Investors', description: 'Research-led mutual fund distribution, portfolio understanding and investor education from CapitalSense.' };
const steps=[
['01','Understand','Start with the goal, time horizon, liquidity needs and existing investments.'],
['02','Structure','Identify the role different mutual fund categories and portfolio exposures may play.'],
['03','Decide','Compare relevant options, risks, costs and scheme information before acting.'],
['04','Review','Revisit the portfolio when goals, cash flows or material investment characteristics change.'],
];
export default function Services(){return <main className="inner-page"><div className="container">
<span className="eyebrow">HOW WE HELP</span><h1 data-reveal="up">Mutual fund investing,<br/><em>made easier to understand.</em></h1>
<p className="page-lead" data-reveal="up">We help individuals and families explore mutual fund options, understand existing holdings and navigate the practical steps of investing through a distribution-led service.</p>

<div className="inner-cards service-choice-grid" data-reveal="up">
<article><span className="eyebrow">01 / INDIVIDUALS & FAMILIES</span><h2>Start investing with a purpose.</h2><p>Understand how your goal, time horizon and ability to absorb losses shape the mutual fund categories worth exploring.</p><Link className="text-link" href="/services/individual-investors">Explore individual investor services ↗</Link></article>
<article><span className="eyebrow">02 / EXISTING PORTFOLIOS</span><h2>Understand your current holdings.</h2><p>Look across funds for repeated exposures, mismatched goals, liquidity needs and costs—then identify questions worth resolving.</p><Link className="text-link" href="/services/hni-investors">Explore portfolio review support ↗</Link></article>
</div>

<div className="inner-block" data-reveal="up"><h2>How the process works</h2><div className="inner-cards process-flow" data-reveal="up">{steps.map(([n,t,d])=><article key={n}><span className="eyebrow">STEP {n}</span><h2>{t}</h2><p>{d}</p></article>)}</div></div>

<div className="inner-block" data-reveal="up"><h2>What a conversation covers</h2><p><strong>Scheme features.</strong> Understand a fund's mandate, major risks and where it might fit.</p><p><strong>Holdings in context.</strong> Discuss the role each holding plays, not simply its trailing return.</p><p><strong>Costs and compensation.</strong> Understand direct and regular plans, expense ratios, exit loads and relevant distributor remuneration.</p><p><strong>Practical next steps.</strong> Clarify documentation and service requirements before any transaction.</p></div>

<div className="inner-block" data-reveal="up"><h2>Our scope</h2><p>CapitalSense investor services are focused on mutual fund distribution, related servicing and investor education. The website does not provide stock-specific buy or sell calls, discretionary portfolio management or personalised securities recommendations.</p><Link className="text-link" href="/disclosures">Read disclosures and regulatory information ↗</Link></div>

<div className="inner-block" data-reveal="up"><h2>Start with your situation</h2><p>You do not need to arrive with a scheme in mind. Start with the goal, the portfolio question or the decision you are trying to make.</p><WhatsAppCta>Ask on WhatsApp</WhatsAppCta></div>
</div></main>}
