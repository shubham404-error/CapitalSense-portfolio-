import Link from 'next/link';
import {WhatsAppCta} from '@/components/whatsapp-cta';
export const metadata = { title: 'Services for Individual Investors', description: 'Understand mutual fund investing, risk, goals and investment habits.' };
const topics = [
 ['Goal and time horizon', 'What is the money for, when might it be needed and how flexible is the date? A short-term need and a long-term goal should not be treated alike.'],
 ['Risk and capacity', 'Risk tolerance is how you feel about uncertainty. Risk capacity is how much loss your finances can absorb without derailing essential plans. Both matter.'],
 ['Mutual fund categories', 'Understand the broad differences between equity, debt, hybrid and other categories, including what each category is designed to do and the risks it carries.'],
 ['Costs and plan options', 'Understand the total expense ratio, direct and regular plans, exit loads and scheme-level disclosures before making a decision.'],
 ['Investing behaviour', 'A SIP can help automate contributions, but it does not remove market risk or guarantee a profit. Consistency and a suitable investment choice both matter.'],
 ['Ongoing servicing', 'Keep records, review scheme communications and revisit your plan when goals, income, liabilities or liquidity needs change.'],
];
export default function Page(){return <main className="inner-page page-services-individual-investors"><div className="container">
<span className="eyebrow">FOR INDIVIDUALS & FAMILIES</span><h1 data-reveal="up">Give your investments{' '}<br/><em>a clear purpose.</em></h1>
<p className="page-lead" data-reveal="up">Saving for a home, education or retirement involves different time horizons and risks. Start with the goal before comparing funds.</p>
<div className="inner-block" data-reveal="up"><h2>What we discuss</h2><div className="inner-cards" data-reveal="up">{topics.map(([t,d],i)=><article key={t}><span className="eyebrow">0{i+1} / DISCUSSION AREA</span><h2>{t}</h2><p>{d}</p></article>)}</div></div>
<div className="inner-block" data-reveal="up"><h2>What to bring to the first conversation</h2><p>A goal, approximate timeframe, expected contribution and broad description of any current holdings are enough to begin. Do not share sensitive identifiers or account access in an initial message.</p><p>Next, we can discuss relevant scheme categories, their risks and costs, and the documents needed if you choose to proceed.</p></div>
<div className="inner-block" data-reveal="up"><h2>Service scope</h2><p>This is mutual fund distribution and investor education within applicable registration and empanelment requirements—not discretionary portfolio management or stock trading advice.</p><p>Mutual funds involve market risk; read the current scheme documents before investing.</p><Link className="text-link" href="/disclosures">Understand the disclosures ↗</Link></div>
<div className="inner-block" data-reveal="up"><h2>Common questions</h2><p><strong>Do I need to know which fund I want?</strong> No. The first discussion can begin with your goal and questions, without selecting a scheme.</p><p><strong>Does a SIP remove market risk?</strong> No. It automates contributions and can spread purchases over time, but the scheme can still lose value.</p><p><strong>Will past returns tell me what to expect?</strong> No. Past performance is not a reliable promise of future outcomes. Review the mandate, portfolio, risk and costs.</p><p><strong>Do I have to invest after an enquiry?</strong> No. An enquiry does not create an obligation to transact.</p></div><div className="inner-block" data-reveal="up"><h2>Ready to discuss your goals?</h2><p>Tell us your goal and the biggest investment question on your mind.</p><WhatsAppCta>Discuss your goals</WhatsAppCta></div>
</div></main>}
