import Image from 'next/image';
import concepts from '@/assets/review-concepts.webp';
import journey from '@/assets/investor-journey.webp';

export function ReviewIllustration({index}:{index:number}) {
 return <div className="review-illustration" aria-hidden="true" style={{backgroundImage:`url(${concepts.src})`,backgroundPosition:`${index%3*50}% ${index<3?0:100}%`}}/>;
}

const narratives={
 research:{index:1,title:'Different fund names. Shared holdings?',body:'Overlapping circles show how separate funds can depend on the same companies. Looking inside the holdings helps reveal concentration.',note:'Conceptual illustration — not an analysis of a specific portfolio.'},
 goals:{index:4,title:'Put a date beside the dream.',body:'Define the goal, the time available and how flexible it is. Those checkpoints help frame a discussion about contributions, liquidity and risk.',note:'A planning illustration, not a projected investment return.'},
 contact:{index:0,title:'A useful first message starts small.',body:'Share your goal, an approximate timeframe and your main question. We can explain the scope and next steps before you share documents.',note:'Keep account numbers, identity documents and passwords out of your first message.'},
};
export function ServiceVisual({kind}:{kind:keyof typeof narratives}) {
 const item=narratives[kind];
 return <figure className="service-visual"><ReviewIllustration index={item.index}/><figcaption><span className="eyebrow">A CLOSER LOOK</span><h2>{item.title}</h2><p>{item.body}</p><small>{item.note}</small></figcaption></figure>;
}
export function InvestorJourney(){return <figure className="investor-journey"><Image src={journey} alt="A goal notebook leads to an examination of holdings, then a discussion and checklist." sizes="(max-width:800px) 100vw, 1160px"/><figcaption><span><strong>Define your purpose</strong>Begin with your life and timeframe.</span><span><strong>Examine the evidence</strong>Understand holdings, risks and costs.</span><span><strong>Clarify the next step</strong>Ask questions before any decision.</span></figcaption></figure>}
