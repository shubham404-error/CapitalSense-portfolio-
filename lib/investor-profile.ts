export const preferenceDomains=['planning','planning','planning','community','clarity','planning','clarity','community','planning','clarity','community','planning','clarity','community','planning','clarity','community','planning','clarity','community'] as const;
export function investorProfile(answers:string[],preferences:(boolean|null)[]){
 const options=[['A safety net','A dream trip','Long-term freedom','Still figuring it out'],['Within 1 year','1–3 years','3–7 years','More than 7 years'],['Not started yet','Less than 3 months of essentials','3–6 months of essentials','More than 6 months of essentials'],['I have expensive debt to address','My income varies a lot','I have a stable surplus','I’m not sure yet'],['I need this money back soon','I’d be worried and want help','I could wait if my goal allows','I’ve experienced this and stayed invested']];
 const complete=answers.length===5&&answers.every((answer,i)=>typeof answer==='string'&&options[i].includes(answer));
 const willing=!complete?'Not assessed':answers[4].startsWith('I’ve experienced')?'Higher':answers[4].startsWith('I could wait')?'Moderate':complete?'Lower':'Not assessed';
 const constraints:string[]=[];
 if(answers[1]==='Within 1 year')constraints.push('Money needed within a year');
 if(answers[2]==='Not started yet'||answers[2]==='Less than 3 months of essentials')constraints.push('Emergency buffer needs attention');
 if(answers[3]==='I have expensive debt to address')constraints.push('Expensive debt to address');
 if(answers[3]==='My income varies a lot')constraints.push('Income varies');
 if(answers[3]==='I’m not sure yet')constraints.push('Affordability needs clarification');
 if(answers[0]==='Still figuring it out')constraints.push('Goal needs clarification');
 const foundation=complete&&constraints.length>0;
 const limited=complete&&!foundation&&answers[1]==='1–3 years';
 const capacity=!complete?'Not assessed':foundation?'Constrained':limited?'Limited by timeline':'Needs full review';
 const title=!complete?'Your story is still unfolding':foundation?'Foundation builder':limited?'Near-term planner':willing==='Lower'?'Cautious planner':'Long-term explorer';
 const description=!complete?'A few thoughtful swipes and practical questions will help you understand your starting point.':foundation?'A little more breathing room comes first. Your answers point to liquidity, affordability or financial foundations to review before taking market risk.':limited?'Your deadline is close enough to make access and stability important. Risk willingness does not extend your timeline.':'Your goals leave room for a longer conversation about investing. Existing holdings, obligations and loss capacity still need a full review.';
 const dimensions=(['planning','clarity','community'] as const).map(key=>{const values=preferences.filter((value,i)=>preferenceDomains[i]===key&&typeof value==='boolean');const yes=values.filter(Boolean).length;return {key,label:key==='planning'?'Purpose & planning':key==='clarity'?'Clarity & control':'Community & encouragement',yes,total:values.length,percent:values.length?Math.round(yes/values.length*100):null}});
 return {complete,willing,capacity,title,description,constraints,dimensions,answered:preferences.filter(v=>typeof v==='boolean').length,skipped:preferences.filter(v=>v===null).length,foundation};
}
