import Image from 'next/image';
import Link from 'next/link';
import character from '@/assets/aadi-character.png';
import { aadiStories } from '@/lib/aadi-stories';

export function AadiPortrait() {
  return <div className="aadi-portrait"><Image src={character} alt="Aadi, wearing round glasses, a beige T-shirt and brown trousers and a mustard sling bag, holding his phone and notebook." sizes="(max-width:680px) 450px, 750px" /></div>;
}

export function AadiIntroduction() {
  return <aside className="aadi-introduction" aria-labelledby="aadi-intro-heading">
    <AadiPortrait />
    <div><span className="eyebrow">MEET YOUR FELLOW LEARNER</span><h2 id="aadi-intro-heading">Aadi, 24.<br />Salary credited. So many plans.</h2><p>A designer, a gadget wishlist, five funds and a lot of questions. Follow our fictional protagonist as he turns everyday money mistakes into better habits, one guide at a time.</p><Link className="text-link" href="/insights/meet-aadi">Meet Aadi & explore his money story ↗</Link><small>Fictional educational character. Aadi’s Money Diary · One better money move.</small></div>
  </aside>;
}

export function AadiStory({ slug }: { slug: string }) {
  const story = aadiStories[slug];
  if (!story) return null;
  return <section className="aadi-case-study" aria-labelledby="aadi-case-heading">
    <div className="aadi-case-heading"><AadiPortrait /><div><span className="eyebrow">AADI’S MONEY DIARY</span><h2 id="aadi-case-heading">Aadi puts it into practice</h2><Link className="text-link" href="/insights/meet-aadi">Meet our fictional learner ↗</Link></div></div>
    <dl><div><dt>His starting point</dt><dd>{story.situation}</dd></div><div><dt>What he rethinks</dt><dd>{story.rethink}</dd></div><div><dt>One better habit</dt><dd>{story.habit}</dd></div></dl>
    <p className="aadi-reader-question"><strong>Your turn:</strong> {story.question}</p>
    <small>Fictional case study, not an actual client or investment recommendation. Each guide explores a separate snapshot of Aadi’s starting situation; these are not a chronological financial record.</small>
  </section>;
}
