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

<section className="inner-block founder-section" data-reveal="up" aria-labelledby="founder-heading">
  <span className="eyebrow">THE PERSON BEHIND THE PROCESS</span>
  <h2 id="founder-heading">Who is behind CapitalSense</h2>
  <div className="founder-profile">
    <div className="founder-intro">
      <h3>Shubham Tejani</h3>
      <p className="founder-role">Founder, CapitalSense</p>
      <p>CapitalSense was founded by Shubham Tejani, a finance and technology professional interested in making investment information more structured, understandable and useful. His work brings together financial-data analysis, public-equity research workflows and a technology-led approach to investor education.</p>
      <p>The idea behind CapitalSense is straightforward: investors should be able to understand the purpose, risks, costs and trade-offs of a financial decision, rather than rely on rankings, recent returns or market noise alone.</p>
    </div>
    <div className="founder-credentials">
      <article><span className="eyebrow">EDUCATION</span><h3>B.Tech, Computer Science & Engineering</h3><p>Artificial Intelligence & Machine Learning<br/>VIT Bhopal University</p></article>
      <article><span className="eyebrow">PROFESSIONAL CERTIFICATIONS</span><h3>NISM certifications</h3><p>Equity Derivatives and Research Analyst</p></article>
      <article><span className="eyebrow">PRACTICAL EXPERIENCE</span><h3>Financial data & research</h3><p>Experience working with financial information, company disclosures, market data and structured research processes.</p></article>
    </div>
  </div>
  <div className="founder-registration">
    <span className="eyebrow">DISTRIBUTION & REGULATORY DETAILS</span>
    <p>CapitalSense’s intended distribution activity is limited to mutual fund distribution, related servicing and investor education, subject to applicable requirements. NISM certifications are professional qualifications. They do not, by themselves, constitute SEBI registration as an Investment Adviser or Research Analyst.</p>
    <p><strong>Registration disclosure:</strong> The distributor’s registered name, AMFI Registration Number (ARN), applicable EUIN details and current AMC empanelments must be verified and displayed here before CapitalSense solicits or undertakes mutual fund distribution business. Until those particulars are published and applicable requirements are met, this website should not be treated as an invitation to transact through CapitalSense.</p>
    <p>CapitalSense does not claim SEBI registration as an Investment Adviser or Research Analyst.</p>
    <Link className="text-link" href="/disclosures">Read regulatory disclosures ↗</Link>
  </div>
</section>

<div className="inner-block" data-reveal="up"><h2>What guides our work</h2><p>We explain risks, costs and uncertainty as clearly as potential opportunities. No return is guaranteed, and a conversation need not lead to a transaction.</p><Link className="text-link" href="/disclosures">Read our disclosures ↗</Link></div>

<div className="inner-block" data-reveal="up"><h2>See how the approach works</h2><div className="hero-actions"><Link className="button primary" href="/services">How we help investors ↗</Link><Link className="text-link" href="/research">Our research approach ↗</Link></div></div>
</div></main>}
