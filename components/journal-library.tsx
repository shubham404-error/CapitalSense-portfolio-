'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Search, ArrowUpRight } from 'lucide-react';

type Article = { slug:string; category:string; title:string; desc:string; tags:string[]; read:string };
const articles:Article[] = [
{slug:'sip-is-a-method-not-a-product',category:'MUTUAL FUND BASICS',title:'A SIP is a habit, not an investment product',desc:'A monthly SIP is a payment instruction, not a magic feature of a fund. Understand the moving parts before setting one up.',tags:['SIP','NAV','Rupee-cost averaging','Beginner'],read:'4 min'},
{slug:'compounding-needs-time',category:'MONEY & TIME',title:'Compounding is not magic. It is time doing the heavy lifting.',desc:'Why the length of your investing journey, the money you add and the returns you actually earn all matter.',tags:['Compounding','Time horizon','Inflation','Beginner'],read:'4 min'},
{slug:'understanding-mutual-fund-risk',category:'RISK, WITHOUT THE JARGON',title:'The Riskometer is a starting point. Here is what to look at next.',desc:'Decode the label, then look inside the portfolio to understand what can actually go wrong.',tags:['Riskometer','Credit risk','Market risk','Intermediate'],read:'4 min'},
{slug:'mutual-fund-costs',category:'THE FINE PRINT',title:'The fee you rarely see can still change your outcome',desc:'Expense ratios, exit loads and transaction costs explained without treating the cheapest fund as automatically best.',tags:['TER','Expense ratio','Exit load','Intermediate'],read:'4 min'},
{slug:'portfolio-overlap',category:'PORTFOLIO INTELLIGENCE',title:'Five funds. One crowded trade? How to spot portfolio overlap.',desc:'A fund count is not a diversification measure. Learn to look through the labels and examine the underlying holdings.',tags:['Portfolio overlap','Diversification','Concentration','Intermediate'],read:'4 min'},
{slug:'review-without-overreacting',category:'INVESTOR BEHAVIOUR',title:'Your portfolio needs a check-up, not a daily performance review',desc:'A practical review routine that separates meaningful changes from market noise.',tags:['Investor behaviour','Portfolio review','Checklist','All levels'],read:'4 min'},
{slug:'asset-allocation-is-the-real-portfolio',category:'PORTFOLIO CONSTRUCTION',title:'Asset allocation is the portfolio. Funds are the building blocks.',desc:'Why the mix between asset classes often matters more than the number of schemes you own.',tags:['Asset allocation','Diversification','Portfolio construction','Intermediate'],read:'4 min'},
{slug:'large-mid-small-cap-are-not-risk-ratings',category:'UNDERSTANDING CATEGORIES',title:'Large-cap, mid-cap and small-cap are labels. Not risk ratings.',desc:'What market-cap categories tell you, what they leave out and why the category name is only the beginning.',tags:['Market capitalisation','Equity funds','Risk','Intermediate'],read:'4 min'},
{slug:'emergency-fund-before-investing',category:'FINANCIAL FOUNDATIONS',title:'Before chasing returns, build a buffer for real life.',desc:'An emergency reserve can stop an unexpected bill from becoming a forced investment sale.',tags:['Emergency fund','Liquidity','Financial planning','Beginner'],read:'4 min'},
{slug:'market-cycles-and-changing-leadership',category:'MARKET CONTEXT',title:'Markets move in cycles. Leadership rarely stays in one place.',desc:'Why sectors and styles take turns, and why yesterday’s winner is a poor portfolio plan by itself.',tags:['Market cycles','Sector rotation','Behaviour','Intermediate'],read:'4 min'},
{slug:'behavioural-biases-that-shape-investing',category:'INVESTOR BEHAVIOUR',title:'The market is hard enough. Do not let familiar biases make it harder.',desc:'A practical guide to overconfidence, recency, loss aversion and the stories investors tell themselves.',tags:['Behavioural finance','Decision-making','Biases','Intermediate'],read:'4 min'},
{slug:'goal-based-investing-start-with-the-number',category:'GOAL-BASED PLANNING',title:'Start with the goal, not the fund. Turn a vague wish into a plan.',desc:'Define the amount, date, flexibility and funding gap behind a financial goal.',tags:['Goal planning','Inflation','Cash flow','Beginner'],read:'4 min'}
];
const topics=['ALL TOPICS','MUTUAL FUND BASICS','PORTFOLIO CONSTRUCTION','PORTFOLIO INTELLIGENCE','RISK, WITHOUT THE JARGON','INVESTOR BEHAVIOUR','MARKET CONTEXT','FINANCIAL FOUNDATIONS','GOAL-BASED PLANNING','MONEY & TIME','THE FINE PRINT','UNDERSTANDING CATEGORIES'];
export function JournalLibrary(){
 const [query,setQuery]=useState('');
 const [topic,setTopic]=useState('ALL TOPICS');
 const filtered=useMemo(()=>articles.filter(a=>(topic==='ALL TOPICS'||a.category===topic)&&[a.title,a.desc,a.category,...a.tags].join(' ').toLowerCase().includes(query.trim().toLowerCase())),[query,topic]);
 return <section className="journal-library">
  <div className="journal-controls">
   <label className="journal-search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search topics, concepts or questions" aria-label="Search journal articles"/>{query&&<button type="button" onClick={()=>setQuery('')}>Clear</button>}</label>
   <div className="journal-filter" aria-label="Filter articles by topic">{topics.map(t=><button type="button" key={t} className={topic===t?'active':''} onClick={()=>setTopic(t)} aria-pressed={topic===t}>{t==='ALL TOPICS'?'All topics':t.toLowerCase().replace(/\b\w/g,x=>x.toUpperCase())}</button>)}</div>
  </div>
  <p className="journal-result-count" aria-live="polite">Showing {filtered.length} of {articles.length} guides</p>
  {filtered.length>0?<div className="inner-cards">{filtered.map((a,i)=><article className="journal-card" key={a.slug}><div className="journal-card-art"><img src={'../insight-assets/'+a.slug+'.webp'} alt="" aria-hidden="true"/><span>{String(articles.indexOf(a)+1).padStart(2,'0')}</span><small>{a.category}</small></div><div className="journal-card-copy"><span className="eyebrow">{a.category} · {a.read}</span><h2>{a.title}</h2><p>{a.desc}</p><div className="article-tags">{a.tags.map(t=><span key={t}>{t}</span>)}</div><Link className="text-link" href={'/insights/'+a.slug}>Read the guide <ArrowUpRight size={15}/></Link></div></article>)}</div>:<div className="journal-empty"><h2>No guides found</h2><p>Try a different phrase or clear the topic filter.</p><button type="button" onClick={()=>{setQuery('');setTopic('ALL TOPICS')}}>Reset filters</button></div>}
 </section>;
}
