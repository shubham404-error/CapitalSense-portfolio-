import Link from 'next/link';
import {WhatsAppCta} from '@/components/whatsapp-cta';
export const metadata={title:'Contact CapitalSense',description:'Chat with CapitalSense on WhatsApp Business about mutual fund investing, portfolio understanding or investor education.'};
export default function Connect(){return <main className="inner-page page-connect"><div className="container">
<span className="eyebrow">CONTACT CAPITALSENSE</span><h1 data-reveal="up">Ask your question.{' '}<br/><em>Start on WhatsApp.</em></h1>
<p className="page-lead" data-reveal="up">Whether you are getting started or reviewing existing mutual funds, send a short description through our WhatsApp Business account.</p>

<div className="inner-cards" data-reveal="up">
<article><span className="eyebrow">01 / BUILDING A PLAN</span><h2>I want to start or organise my mutual fund investing.</h2><p>Begin with the goal, time horizon, expected contributions and the questions you want answered.</p><WhatsAppCta className="text-link">Ask about a plan</WhatsAppCta></article>
<article><span className="eyebrow">02 / REVIEWING A PORTFOLIO</span><h2>I want to understand my existing mutual fund holdings.</h2><p>Start with a broad description of the portfolio and the issue you want to examine—such as overlap, concentration, costs or goal alignment.</p><WhatsAppCta className="text-link">Ask about a portfolio</WhatsAppCta></article>
<article><span className="eyebrow">03 / GENERAL QUESTION</span><h2>I have a question about CapitalSense, research or education.</h2><p>Reach out about the research framework, investor education content or technology work.</p><WhatsAppCta className="text-link">Message CapitalSense</WhatsAppCta></article>
</div>

<div className="inner-block" data-reveal="up"><h2>What to include</h2><p>A short description of your goal or portfolio question is enough for the first message. Do not send passwords, OTPs, PAN, Aadhaar, bank details, full folio information or unredacted financial documents through WhatsApp.</p></div>

<div className="inner-block" data-reveal="up"><h2>After you reach out</h2><p>We clarify the question and whether our distribution or education services are relevant. Before any transaction, we explain the applicable service scope, costs, documents and registration details.</p></div>

<div className="inner-block" data-reveal="up"><h2>Service scope</h2><p>CapitalSense focuses on mutual fund distribution, related servicing and investor education. It does not offer stock-specific buy or sell calls, discretionary portfolio management or personalised securities recommendations.</p><Link className="text-link" href="/disclosures">Read disclosures and regulatory information ↗</Link></div>
</div></main>}
