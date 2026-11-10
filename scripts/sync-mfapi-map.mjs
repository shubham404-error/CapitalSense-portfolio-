import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';

const source=JSON.parse(readFileSync(new URL('../config/fund-research.json',import.meta.url),'utf8'));
const launchFunds=source.funds.slice(0,22);
if(launchFunds.length!==22)throw Error('The launch research universe must contain exactly 22 funds.');
const aliases=new Map([
 ['SBI EQUITY HYBRID FUND','SBI Aggressive Hybrid Fund'],
 ['Kotak Debt Hybrid Fund','Kotak Conservative Hybrid Fund'],
 ['ICICI Prudential Regular Gold Savings Fund','ICICI Prudential Gold ETF FOF'],
 ['ICICI Prudential Multi - Asset Fund','ICICI Prudential Multi Asset Allocation Fund'],
 ['HDFC Gold Fund Of Fund','HDFC Gold ETF Fund Of Fund'],
 ['ICICI Prudential Money Market Fund','ICICI Prudential Money Market Fund Cash Option'],
 ['HDFC Short Term Debt Fund','HDFC Short Term Fund'],
]);
const compound=/\b(midcap|smallcap|multicap|largecap)\b/g;
function normalize(value){return value.toLowerCase().replace(/\(erstwhile[^)]*\)/g,' ').replace(compound,word=>word.replace('cap',' cap')).replace(/&/g,' and ').replace(/\b(growth|option|regular|plan|fund|scheme)\b/g,' ').replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ')}
function isRegularGrowth(name){const marker=name.match(/\bregular(?:\s+plan)?\b/i);if(!marker||/\bdirect\b/i.test(name))return false;const option=name.slice((marker.index||0)+marker[0].length);return /\bgrowth\b/i.test(option)&&!/(idcw|dividend|bonus|reinvestment|payout)/i.test(option)}
const response=await fetch('https://api.mfapi.in/mf',{headers:{Accept:'application/json'},signal:AbortSignal.timeout(45000)});
if(!response.ok)throw Error('MFAPI scheme list returned HTTP '+response.status);
const rows=await response.json();
if(!Array.isArray(rows))throw Error('MFAPI scheme list returned an unexpected shape.');
const regular=rows.filter(row=>row&&typeof row.schemeName==='string'&&isRegularGrowth(row.schemeName));
const matched=[],unmatched=[];
for(const fund of launchFunds){
 const target=normalize(aliases.get(fund.name)||fund.name);
 const candidates=regular.filter(row=>normalize(row.schemeName)===target).sort((a,b)=>Number(b.schemeCode)-Number(a.schemeCode));
 if(!candidates.length){unmatched.push({id:fund.id,name:fund.name,categories:fund.categories,reason:'No exact explicit Regular Growth scheme in the MFAPI scheme list.'});continue}
 const selected=candidates[0];
 matched.push({id:fund.id,workbookName:fund.name,schemeCode:String(selected.schemeCode),schemeName:selected.schemeName});
}
const output={generatedAt:new Date().toISOString(),source:'https://api.mfapi.in/mf',universe:'Stride launch shortlist: first 22 ordered funds in config/fund-research.json.',policy:'Exact normalized name or reviewed rename; explicit Regular Growth only.',matchedCount:matched.length,unmatchedCount:unmatched.length,funds:matched,unmatched};
writeFileSync(new URL('../config/fund-mfapi-map.json',import.meta.url),JSON.stringify(output,null,2)+'\n');
mkdirSync(new URL('../public/data-sources',import.meta.url),{recursive:true});
writeFileSync(new URL('../public/data-sources/mfapi-unmatched.json',import.meta.url),JSON.stringify({checkedAt:output.generatedAt,count:unmatched.length,funds:unmatched},null,2)+'\n');
console.log(`MFAPI map: ${matched.length} matched; ${unmatched.length} unmatched.`);
for(const fund of unmatched)console.log('- '+fund.name);
