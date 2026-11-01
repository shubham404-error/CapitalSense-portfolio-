import Image from 'next/image';
import Link from 'next/link';
import character from '@/assets/aadi-character.png';
import { AadiPortrait } from '@/components/aadi-story';

export const metadata = { title: 'Meet Aadi | Aadi’s Money Diary', description: 'Meet CapitalSense’s fictional 24-year-old learner: salary day, UPI spends, SIP questions and one better money habit at a time.' };
const chapters = [
  ['emergency-fund-before-investing', 'The buffer before the big plans', 'His emergency savings need a closer look.'],
  ['goal-based-investing-start-with-the-number', 'The laptop wishlist gets a deadline', 'An amount and a date change the question.'],
  ['sip-is-a-method-not-a-product', '“Wait, what did my SIP actually buy?”', 'He separates the habit from the investment.'],
  ['compounding-needs-time', 'The calculator is not a promise', 'He learns to question the assumptions.'],
  ['understanding-mutual-fund-risk', 'A label is only the starting point', 'His deadline makes the risk personal.'],
  ['mutual-fund-costs', 'The costs hiding in plain sight', 'He reads beyond the return number.'],
  ['portfolio-overlap', 'Five funds, but how many different bets?', 'He looks inside the names in his app.'],
  ['asset-allocation-is-the-real-portfolio', 'Every pot needs a purpose', 'He maps his money to his goals.'],
  ['large-mid-small-cap-are-not-risk-ratings', 'Big company does not mean risk-free', 'He moves beyond category shortcuts.'],
  ['market-cycles-and-changing-leadership', 'The sector everyone is talking about', 'He pauses before chasing the latest winner.'],
  ['behavioural-biases-that-shape-investing', 'His feed agrees. Is that evidence?', 'He makes room for the other side of the story.'],
  ['review-without-overreacting', 'Less refreshing. Better reviewing.', 'He gives his portfolio a review routine.'],
];

export default function MeetAadi() {
  return <main className="inner-page page-aadi"><div className="container">
    <Link className="text-link" href="/insights">← All insights</Link>
    <header className="aadi-profile-hero"><div><span className="eyebrow">AADI’S MONEY DIARY / A CAPITALSENSE ORIGINAL</span><h1>Meet Aadi.<br /><em>Figuring money out,<br />just like the rest of us.</em></h1><p className="page-lead">He is 24, works as a UX designer in Bengaluru, and has more plans for his salary than his salary can fund. Sound familiar?</p><p>UPI makes spending effortless. Investing apps make buying easy. Aadi is learning that understanding the decision takes a little more work.</p><p className="aadi-series-line">One better money move.</p><small>A fictional character for investor education, not a real client, testimonial or financial adviser.</small></div><AadiPortrait/></header>

    <section className="aadi-profile-section" aria-labelledby="aadi-life-heading"><span className="eyebrow">THE PERSON, BEFORE THE PORTFOLIO</span><h2 id="aadi-life-heading">Good intentions.<br />A very full wishlist.</h2><div className="aadi-life-grid">
      <div><h3>His everyday world</h3><p>Shared rent, office commutes, food-delivery evenings, a family transfer after payday and a group chat planning the next trip. He likes good coffee and new tech. He does not want a financial plan that asks him to stop enjoying life.</p></div>
      <div><h3>His money blind spots</h3><p>Small UPI payments disappear from memory. He picks up investment ideas from reels, checks his portfolio too often, and sometimes calls a SIP a product. Friends posting gains make him wonder if he is falling behind.</p></div>
      <div><h3>What he is working towards</h3><p>A ₹90,000 laptop in 18 months, room for travel, a stronger emergency buffer and eventually a long-term investing habit. The challenge is choosing priorities instead of trying to fund everything at once.</p></div>
    </div></section>

    <section className="aadi-profile-section" aria-labelledby="aadi-budget-heading"><span className="eyebrow">HIS FICTIONAL STARTING POINT</span><h2 id="aadi-budget-heading">Salary in. Where does it go?</h2><p>₹54,000 monthly take-home. These invented amounts keep the stories consistent; they are not a benchmark for what you should earn, spend or save.</p><div className="aadi-budget-layout"><div className="aadi-budget-table"><table><caption>Aadi’s monthly cash flow</caption><thead><tr><th scope="col">Money out</th><th scope="col">Monthly amount</th></tr></thead><tbody><tr><th scope="row">Rent, food, bills & transport</th><td>₹30,000</td></tr><tr><th scope="row">Family contribution</th><td>₹4,000</td></tr><tr><th scope="row">Gadget EMI</th><td>₹2,000</td></tr><tr><th scope="row">Going out, subscriptions & other wants</th><td>₹10,000</td></tr><tr><th scope="row">Available for savings & goals</th><td>₹8,000</td></tr></tbody><tfoot><tr><th scope="row">Total take-home allocated</th><td>₹54,000</td></tr></tfoot></table></div><div className="aadi-baseline"><h3>Already in the picture</h3><dl><div><dt>Emergency savings</dt><dd>₹12,000</dd></div><div><dt>Investments across five mutual funds</dt><dd>₹18,000</dd></div><div><dt>Gadget EMI remaining</dt><dd>6 months × ₹2,000</dd></div></dl><p>He has not earmarked money for the laptop yet. His ₹8,000 saving capacity must cover competing goals; the same rupee cannot do two jobs.</p></div></div></section>

    <section className="aadi-profile-section" aria-labelledby="aadi-stories-heading"><span className="eyebrow">FOLLOW THE QUESTIONS, NOT A PERFECT PORTFOLIO</span><h2 id="aadi-stories-heading">His story. Your next question.</h2><p>Each guide follows one situation, one rethink and one better habit. Read in any order: these are separate snapshots from his starting point, not a chronological record of results.</p><div className="aadi-chapters">{chapters.map(([slug, title, description], i) => <Link href={'/insights/' + slug} key={slug}><span className="eyebrow">{String(i + 1).padStart(2, '0')} / MONEY DIARY</span><h3>{title}</h3><p>{description}</p><span className="text-link">Read the guide ↗</span></Link>)}</div></section>

    <figure className="aadi-character-sheet"><Image src={character} alt="Aadi in his signature beige T-shirt, brown trousers, round glasses and mustard bag: ready to learn, surprised by a receipt, investigating his notes and saving a coin." sizes="(max-width:800px) 100vw, 1000px"/><figcaption>Same Aadi. Different money moments. Curious, occasionally impulsive, always learning.</figcaption></figure>
  </div></main>;
}
