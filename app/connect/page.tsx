import Link from 'next/link';
export const metadata={title:'Start a Conversation',description:'Start a conversation with CapitalSense about mutual fund investing, portfolio understanding or investor education.'};
export default function Connect(){return <main className="inner-page"><div className="container">
<span className="eyebrow">START A CONVERSATION</span><h1 data-reveal="up">Start with the question.<br/><em>We can work from there.</em></h1>
<p className="page-lead" data-reveal="up">You do not need to know which fund you want. Tell us what you are trying to achieve, what you already own or what part of investing you want to understand better.</p>

<div className="inner-cards" data-reveal="up">
<article><span className="eyebrow">01 / BUILDING A PLAN</span><h2>I want to start or organise my mutual fund investing.</h2><p>Begin with the goal, time horizon, expected contributions and the questions you want answered.</p><Link className="text-link" href="https://www.linkedin.com/in/shubham-tejani-2903/" target="_blank" rel="noreferrer">Message on LinkedIn ↗</Link></article>
<article><span className="eyebrow">02 / REVIEWING A PORTFOLIO</span><h2>I want to understand my existing mutual fund holdings.</h2><p>Start with a broad description of the portfolio and the issue you want to examine—such as overlap, concentration, costs or goal alignment.</p><Link className="text-link" href="https://www.linkedin.com/in/shubham-tejani-2903/" target="_blank" rel="noreferrer">Message on LinkedIn ↗</Link></article>
<article><span className="eyebrow">03 / GENERAL QUESTION</span><h2>I have a question about CapitalSense, research or education.</h2><p>Reach out about the research framework, investor education content or technology work.</p><Link className="text-link" href="https://www.linkedin.com/in/shubham-tejani-2903/" target="_blank" rel="noreferrer">Connect on LinkedIn ↗</Link></article>
</div>

<div className="inner-block" data-reveal="up"><h2>What to include</h2><p>A short description of your goal or portfolio question is enough for the first message. Do not send passwords, OTPs, PAN, Aadhaar, bank details, full folio information or unredacted financial documents through LinkedIn or another unsecured channel.</p></div>

<div className="inner-block" data-reveal="up"><h2>What happens next</h2><p>We will first clarify the nature of the enquiry and whether it falls within the services offered. If the conversation moves into mutual fund distribution or servicing, the relevant scope, documentation, costs and applicable registration details should be made clear before any transaction.</p></div>

<div className="inner-block" data-reveal="up"><h2>Service scope</h2><p>CapitalSense focuses on mutual fund distribution, related servicing and investor education. It does not offer stock-specific buy or sell calls, discretionary portfolio management or personalised securities recommendations.</p><Link className="text-link" href="/disclosures">Read disclosures and regulatory information ↗</Link></div>
</div></main>}