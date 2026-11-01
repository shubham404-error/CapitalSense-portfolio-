import {InvestorJourney, ReviewIllustration} from '@/components/service-illustrations';
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

<section className="inner-block about-principles" aria-labelledby="principles-heading"><h2 id="principles-heading">How we think</h2><div className="about-principles-layout"><figure className="about-principles-visual"><ReviewIllustration index={3}/><figcaption><span className="eyebrow">LOOK BENEATH THE HEADLINE</span><h3>A clearer view,{' '}<br/>one layer at a time.</h3><p>Bring goals, holdings, risks and costs into the same picture before deciding.</p></figcaption></figure><div className="inner-cards about-principles-list">{principles.map(([n,t,d])=><article key={n}><span className="eyebrow">{n} / PRINCIPLE</span><h3>{t}</h3><p>{d}</p></article>)}</div></div></section>

<div className="inner-block" data-reveal="up"><h2>What we do</h2><p><strong>Investor conversations:</strong> goals, time horizon, liquidity, existing holdings and the role mutual funds may play.</p><p><strong>Research:</strong> structured market and portfolio analysis used to add context and discipline to the decision process.</p><p><strong>Education:</strong> practical explanations of mutual funds, risk, costs, portfolio construction and investor behaviour.</p><p><strong>Technology:</strong> tools that organise information and make research workflows easier to explore.</p></div>

<section className="inner-block about-founder" aria-labelledby="founder-heading">
<span className="eyebrow">THE PERSON BEHIND THE PROCESS</span>
<h2 id="founder-heading">Who is behind CapitalSense</h2>
<div className="founder-introduction">
<p>CapitalSense is an independent, founder-led market intelligence and equity research initiative founded by <strong>Shubham T</strong>.</p>
<p>The platform is built around a simple philosophy: investment decisions should be informed by structured research, transparent methodologies and evidence rather than market noise, speculation or unsupported recommendations.</p>
<p>Its research framework brings together market regime analysis, relative strength, technical trend classification, fundamental screening and systematic stock evaluation. The objective is to make disciplined market research more accessible, consistent and actionable.</p>
</div>
<div className="founder-details">
<section className="founder-profile" aria-labelledby="founder-profile-heading">
<h3 id="founder-profile-heading">Founder</h3>
<p className="founder-name"><strong>Shubham T.</strong><span>Founder, CapitalSense</span></p>
<p>Shubham has an academic background in Computer Science and Engineering, with a specialisation in Artificial Intelligence and Machine Learning. His professional interests span financial markets, equity research, quantitative analysis and data-driven investment frameworks.</p>
<p>He holds NISM certifications in Equity Derivatives and Research Analysis. His approach to CapitalSense combines analytical thinking, structured financial research and technology-driven market intelligence.</p>
<a className="text-link" href="https://www.linkedin.com/company/capitalsense/" target="_blank" rel="noopener noreferrer" aria-label="CapitalSense on LinkedIn (opens in a new tab)">CapitalSense on LinkedIn <span aria-hidden="true">↗</span></a>
</section>
<section className="founder-philosophy" aria-labelledby="founder-philosophy-heading">
<h3 id="founder-philosophy-heading">Research philosophy</h3>
<p>CapitalSense is developed with three guiding principles:</p>
<ul>
<li><strong>Methodology over opinion:</strong> Research frameworks should be systematic, explainable and consistently applied.</li>
<li><strong>Evidence over speculation:</strong> Market assessments should be supported by observable data and clearly defined criteria.</li>
<li><strong>Transparency over promises:</strong> Research assumptions, limitations, data sources and potential risks should be communicated clearly.</li>
</ul>
</section>
</div>
<section className="founder-disclosures" aria-labelledby="founder-disclosures-heading">
<h3 id="founder-disclosures-heading">Regulatory and professional disclosures</h3>
<p>CapitalSense’s research and technology capabilities should be distinguished from regulated financial services and product distribution activities.</p>
<p>Where applicable, the relevant SEBI registration details, AMFI ARN or EUIN particulars, distributor affiliations, empanelments and other regulatory credentials will be disclosed with their verified status and scope.</p>
<p>No registration, authorisation, empanelment or distribution affiliation should be implied unless it has been formally obtained and independently verified.</p>
<p><strong>CapitalSense does not represent that its research credentials alone constitute regulatory authorisation to provide investment advice, portfolio management or financial product distribution services.</strong></p>
</section>
</section>

<div className="inner-block" data-reveal="up"><h2>What guides our work</h2><p>We explain risks, costs and uncertainty as clearly as potential opportunities. No return is guaranteed, and a conversation need not lead to a transaction.</p><Link className="text-link" href="/disclosures">Read our disclosures ↗</Link></div>

<div className="inner-block" data-reveal="up"><h2>See how the approach works</h2><div className="hero-actions"><Link className="button primary" href="/services">How we help investors ↗</Link><Link className="text-link" href="/research">Our research approach ↗</Link></div></div>
</div></main>}
