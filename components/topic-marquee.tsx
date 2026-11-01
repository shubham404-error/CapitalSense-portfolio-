'use client';
import {useState} from 'react';
const topics=['GOAL-BASED THINKING','PORTFOLIO CLARITY','INVESTOR EDUCATION','RESEARCH-LED PROCESS'];
export function TopicMarquee(){const [paused,setPaused]=useState(false);return <section className="ticker-band" aria-label="Our focus"><div className="ticker-window"><div className="ticker-track" style={{animationPlayState:paused?'paused':'running'}}>{[0,1].map(copy=><div className="ticker-group" key={copy} aria-hidden={copy===1?true:undefined}>{topics.map(topic=><span key={topic}>{topic}<i aria-hidden="true">✳</i></span>)}</div>)}</div></div><button className="ticker-toggle" onClick={()=>setPaused(!paused)} aria-pressed={paused}>{paused?'Play':'Pause'} motion</button></section>}
