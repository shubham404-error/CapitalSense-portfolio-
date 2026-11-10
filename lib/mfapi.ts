export const MFAPI_BASE='https://api.mfapi.in';
export const FACTSHEET_DIRECTORY='https://www.amfiindia.com/online-center/download-factsheets';
export const AMFI_TER_DIRECTORY='https://www.amfiindia.com/ter-of-mf-schemes';
export type MfapiMatch={code:string;name:string;isinGrowth:string|null};
export type NavSnapshot={code:string;name:string;amc:string;category:string;nav:number;date:string;fetchedAt:string};
export function isRegularGrowth(name:string){const marker=name.match(/\bregular(?:\s+plan)?\b/i);if(!marker||/\bdirect\b/i.test(name))return false;const option=name.slice((marker.index||0)+marker[0].length);return /\bgrowth\b/i.test(option)&&!/\b(idcw|dividend|bonus|reinvestment|payout)\b/i.test(option)}
export function parseSearch(value:unknown):MfapiMatch[]{if(!Array.isArray(value))throw Error('MFAPI returned an unexpected search response.');return value.flatMap(row=>{if(!row||typeof row!=='object')return [];const r=row as Record<string,unknown>;const code=String(r.schemeCode||'');return /^\d{4,9}$/.test(code)&&typeof r.schemeName==='string'&&isRegularGrowth(r.schemeName)?[{code,name:r.schemeName,isinGrowth:typeof r.isinGrowth==='string'?r.isinGrowth:null}]:[]})}
export function parseNav(value:unknown,requestedCode:string,now=Date.now()):NavSnapshot{if(!value||typeof value!=='object')throw Error('MFAPI returned an invalid NAV response.');const record=value as {meta?:Record<string,unknown>;data?:unknown[]};const meta=record.meta;if(!meta||String(meta.scheme_code)!==requestedCode||typeof meta.scheme_name!=='string'||!Array.isArray(record.data))throw Error('MFAPI scheme identity could not be verified.');if(!isRegularGrowth(meta.scheme_name))throw Error('The selected scheme is not an explicit Regular Growth option.');const values=record.data.flatMap(row=>{if(!row||typeof row!=='object')return [];const r=row as Record<string,unknown>;if(typeof r.date!=='string'||!/^\d{2}-\d{2}-\d{4}$/.test(r.date))return [];const [day,month,year]=r.date.split('-').map(Number);const d=new Date(Date.UTC(year,month-1,day));const n=Number(r.nav);if(d.getUTCDate()!==day||d.getUTCMonth()!==month-1||year<2000||!Number.isFinite(n)||n<=0||d.getTime()>now+86400000)return [];return [{date:d.toISOString().slice(0,10),nav:n}]});values.sort((a,b)=>b.date.localeCompare(a.date));if(!values.length)throw Error('No valid dated NAV is available for this scheme.');return {code:requestedCode,name:meta.scheme_name,amc:typeof meta.fund_house==='string'?meta.fund_house:'Not supplied',category:typeof meta.scheme_category==='string'?meta.scheme_category:'Not supplied',...values[0],fetchedAt:new Date(now).toISOString()}}
async function mfFetch(url:string,signal:AbortSignal){const controller=new AbortController();const cancel=()=>controller.abort();if(signal.aborted)controller.abort();else signal.addEventListener('abort',cancel,{once:true});const timer=setTimeout(()=>controller.abort(),15000);try{return await fetch(url,{signal:controller.signal})}catch(error){if(signal.aborted)throw error;throw Error('MFAPI could not be reached within the request window. Please retry.')}finally{clearTimeout(timer);signal.removeEventListener('abort',cancel)}}
async function json(url:string,signal:AbortSignal){const response=await mfFetch(url,signal);if(!response.ok)throw Error(response.status===429?'MFAPI is rate limiting requests. Please wait and retry.':`MFAPI returned HTTP ${response.status}. Please retry later.`);return response.json()}
export async function searchMfapi(query:string,signal:AbortSignal){if(query.trim().length<3)return [];return parseSearch(await json(MFAPI_BASE+'/mf/search?q='+encodeURIComponent(query.trim()),signal))}
export async function latestMfapi(code:string,signal:AbortSignal){if(!/^\d{4,9}$/.test(code))throw Error('Choose a valid scheme code.');let response=await mfFetch(MFAPI_BASE+'/mf/'+code+'/latest',signal);if(response.status===404)response=await mfFetch(MFAPI_BASE+'/mf/'+code,signal);if(!response.ok)throw Error(response.status===429?'MFAPI is rate limiting requests. Please wait and retry.':`MFAPI returned HTTP ${response.status}. Please retry later.`);return parseNav(await response.json(),code)}

export type NavPoint={date:string;nav:number};
export type NavHistory=NavSnapshot & {points:NavPoint[]};
export type NavMetric={label:string;value:number;annualized:boolean};
export type NavMetrics={returns:NavMetric[];annualizedVolatility:number|null;maxDrawdown:number|null;inceptionDate:string};
export function parseHistory(value:unknown,code:string,now=Date.now()):NavHistory{
 const snapshot=parseNav(value,code,now);
 const rows=(value as {data:unknown[]}).data;
 const unique=new Map<string,NavPoint>();
 for(const row of rows){try{const point=parseNav({...value as object,data:[row]},code,now);unique.set(point.date,{date:point.date,nav:point.nav})}catch{/* Skip malformed observations, never invent NAVs. */}}
 return {...snapshot,points:Array.from(unique.values()).sort((a,b)=>a.date.localeCompare(b.date))};
}
export async function historyMfapi(code:string,signal:AbortSignal):Promise<NavHistory>{
 if(!/^\d{4,9}$/.test(code))throw Error('Choose a valid scheme code.');
 return parseHistory(await json(MFAPI_BASE+'/mf/'+code,signal),code);
}
function subtractMonths(date:string,months:number){const d=new Date(date+'T00:00:00Z'),day=d.getUTCDate();d.setUTCDate(1);d.setUTCMonth(d.getUTCMonth()-months);d.setUTCDate(Math.min(day,new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0)).getUTCDate()));return d.toISOString().slice(0,10)}
export function navMetrics(history:NavHistory):NavMetrics{
 const points=[...history.points].sort((a,b)=>a.date.localeCompare(b.date));
 if(!points.length)return {returns:[],annualizedVolatility:null,maxDrawdown:null,inceptionDate:history.date};
 const latest=points.at(-1)!;const periods=[['1M',1],['3M',3],['6M',6],['1Y',12],['3Y',36],['5Y',60]] as const;
 const returns:NavMetric[]=[];
 for(const [label,months] of periods){const target=subtractMonths(latest.date,months);const start=[...points].reverse().find(p=>p.date<=target);if(!start)continue;const age=(Date.parse(target)-Date.parse(start.date))/86400000;if(age>45)continue;const raw=latest.nav/start.nav-1;const years=months/12;returns.push({label,value:months>12?(Math.pow(1+raw,1/years)-1)*100:raw*100,annualized:months>12})}
 let peak=points[0].nav,maxDrawdown=0;for(const point of points){peak=Math.max(peak,point.nav);maxDrawdown=Math.min(maxDrawdown,(point.nav/peak-1)*100)}
 const daily=points.slice(1).flatMap((point,i)=>{const previous=points[i];const gap=(Date.parse(point.date)-Date.parse(previous.date))/86400000;return gap>0&&gap<=7?[point.nav/previous.nav-1]:[]});
 if(daily.length<30)return {returns,annualizedVolatility:null,maxDrawdown,inceptionDate:points[0].date};
 const mean=daily.reduce((sum,value)=>sum+value,0)/daily.length;const variance=daily.reduce((sum,value)=>sum+(value-mean)**2,0)/(daily.length-1);
 return {returns,annualizedVolatility:Math.sqrt(variance)*Math.sqrt(252)*100,maxDrawdown,inceptionDate:points[0].date};
}
export const chartPeriods=['1M','3M','6M','1Y','3Y','5Y','ALL'] as const;
export type ChartPeriod=typeof chartPeriods[number];
export function chartSeries(histories:NavHistory[],period:ChartPeriod){
 if(!histories.length)return [];
 const end=histories.map(h=>h.date).sort()[0];
 const months:Record<ChartPeriod,number>={'1M':1,'3M':3,'6M':6,'1Y':12,'3Y':36,'5Y':60,'ALL':0};
 const cutoff=new Date(end+'T00:00:00Z');if(months[period]){const day=cutoff.getUTCDate();cutoff.setUTCDate(1);cutoff.setUTCMonth(cutoff.getUTCMonth()-months[period]);const last=new Date(Date.UTC(cutoff.getUTCFullYear(),cutoff.getUTCMonth()+1,0)).getUTCDate();cutoff.setUTCDate(Math.min(day,last));}
 const start=months[period]?cutoff.toISOString().slice(0,10):'0000';
 // Comparison uses only dates published by every selected scheme. No forward filling.
 const published=histories.map(h=>new Set(h.points.map(p=>p.date)));
 const shared=histories[0].points.filter(p=>p.date>=start&&p.date<=end&&published.every(dates=>dates.has(p.date))).map(p=>p.date);
 const dates=new Set(shared);
 return histories.map(h=>({...h,points:h.points.filter(p=>dates.has(p.date))}));
}
