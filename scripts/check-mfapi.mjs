import {appendFileSync} from 'node:fs';
let state='unreachable';let details='MFAPI request did not complete.';
try{
 const origin='https://shubham404-error.github.io';const response=await fetch('https://api.mfapi.in/mf/search?q=HDFC%20Flexi',{headers:{Origin:origin},signal:AbortSignal.timeout(20000)});const rows=await response.json();const found=Array.isArray(rows)?rows.find(r=>r.schemeCode&&typeof r.schemeName==='string'&&/\bregular\b.*\bgrowth\b/i.test(r.schemeName)&&!/\b(direct|idcw)\b/i.test(r.schemeName)):null;
 if(!response.ok||!found)throw Error('Search response unavailable or invalid (HTTP '+response.status+').');
 const code=String(found.schemeCode);let nav=await fetch('https://api.mfapi.in/mf/'+code+'/latest',{headers:{Origin:origin},signal:AbortSignal.timeout(20000)});let endpoint='latest';if(nav.status===404){nav=await fetch('https://api.mfapi.in/mf/'+code,{headers:{Origin:origin},signal:AbortSignal.timeout(20000)});endpoint='history'}const body=await nav.json();const cors=response.headers.get('access-control-allow-origin');const navCors=nav.headers.get('access-control-allow-origin');const valid=nav.ok&&String(body.meta?.scheme_code)===code&&Array.isArray(body.data)&&body.data.length>0;
 state=valid?((cors==='*'||cors===origin)&&(navCors==='*'||navCors===origin)?'ready':'check-cors'):'check-format';details=`Search HTTP ${response.status}; ${rows.length} matches. NAV HTTP ${nav.status}; endpoint ${endpoint}; dated sample ${body.data?.[0]?.date||'none'}; browser CORS ${cors||'not supplied'}.`;
}catch(error){details=error.message}
console.log('MFAPI '+state+': '+details);
if(process.env.GITHUB_OUTPUT)appendFileSync(process.env.GITHUB_OUTPUT,`mfapi_status=${state}\n`);
if(process.env.GITHUB_STEP_SUMMARY)appendFileSync(process.env.GITHUB_STEP_SUMMARY,`## MFAPI data-source check\n\n${state}: ${details}\n\nRead-only public scheme/NAV lookup. No investment or user data submitted.\n`);
