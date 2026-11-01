import { JournalLibrary } from '@/components/journal-library';
import {WhatsAppCta} from '@/components/whatsapp-cta';

export const metadata={title:'Insights',description:'Clear, practical investor education from CapitalSense on mutual funds, risk, portfolio construction and behaviour.'};

export default function Insights(){return <main className="inner-page page-insights"><div className="container">
<span className="eyebrow">CAPITALSENSE INSIGHTS</span>
<h1 data-reveal="up">Understand the decision.<br/><em>Not just the headline.</em></h1>
<p className="page-lead" data-reveal="up">Practical explanations for investors who want to understand mutual funds, portfolio construction, risk, costs and behaviour before making a financial decision.</p>

<JournalLibrary/>

<div className="inner-block" data-reveal="up"><h2>How we approach investor education</h2><p>We start with a real investor question, break the idea into smaller parts, use simple examples and explain the limitations. Where possible, we point readers toward primary sources and current scheme or regulatory information.</p></div>

<div className="inner-block" data-reveal="up"><h2>Want to apply the thinking to your own situation?</h2><p>Education is useful when it improves the next question you ask. If you are trying to organise a mutual fund plan or understand an existing portfolio, start with the situation rather than a product name.</p><WhatsAppCta>Ask on WhatsApp</WhatsAppCta></div>
</div></main>}
