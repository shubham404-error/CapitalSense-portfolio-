import Link from 'next/link';
export const metadata={title:'Start a Conversation',description:'Start a conversation with CapitalSense about mutual fund investing, portfolio understanding or investor education.'};
export default function Connect(){return <main className="inner-page"><div className="container">
<span className="eyebrow">START A CONVERSATION</span><h1 data-reveal="up">Tell us what you're<br/><em>trying to figure out.</em></h1>
<p className="page-lead" data-reveal="up">Whether you are getting started or reviewing existing mutual funds, a short description of your situation is enough for an initial conversation.</p>

<div className="inner-cards" data-reveal="up">
<article><span className="eyebrow">01 / BUILDING A PLAN</span><h2>I want to start or organise my mutual fund investing.</h2><p>Begin with the goal, time horizon, expected contributions and the questions you want answered.</p><Link className="text-link" href="https://www.linkedin.com/in/shubham-tejani-2903/" target="_blank" rel="noreferrer">Message on LinkedIn ↗</Link></article>
<article><span className="eyebrow">02 / REVIEWING A PORTFOLIO</span><h2>I want to understand my existing mutual fund holdings.</h2><p>Start with a broad description of the portfolio and the issue you want to examine—such as overlap, concentration, costs or goal alignment.</p><Link className="text-link" href="https://www.linkedin.com/in/shubham-tejani-2903/" target="_blank" rel="noreferrer">Message on LinkedIn ↗</Link></article>
<article><span className="eyebrow">03 / GENERAL QUESTION</span><h2>I have a question about CapitalSense, research or education.</h2><p>Reach out about the research framework, investor education content or technology work.</p><Link className="text-link" href="https://www.linkedin.com/in/shubham-tejani-2903/" target="_blank" rel="noreferrer">Connect on LinkedIn ↗</Link></article>
</div>

<div className="inner-block" data-reveal="up"><h2>What to include</h2><p>A short description of your goal or portfolio question is enough for the first message. Do not send passwords, OTPs, PAN, Aadhaar, bank details, full folio information or unredacted financial documents through LinkedIn or another unsecured channel.</p></div>

<div className="inner-block" data-reveal="up"><h2>After you reach out</h2><p>We clarify the question and whether our distribution or education services are relevant. Before any transaction, we explain the applicable service scope, costs, documents and registration details.</p></div>

<div className="inner-block" data-reveal="up"><h2>Service scope</h2><p>CapitalSense focuses on mutual fund distribution, related servicing and investor education. It does not offer stock-specific buy or sell calls, discretionary portfolio management or personalised securities recommendations.</p><Link className="text-link" href="/disclosures">Read disclosures and regulatory information ↗</Link></div>
</div></main>}