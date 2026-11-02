import {appendFileSync,writeFileSync,mkdirSync} from 'node:fs';
let state='unreachable';let details='MFAPI request did not complete.';
try{
 const origin='https://shubham404-error.github.io';
 const response=await fetch('https://api.mfapi.in/mf/search?q=HDFC%20Flexi',{headers:{Origin:origin,Accept:'application/json'},signal:AbortSignal.timeout(20000)});
 let rows;try{rows=await response.json()}catch{state='search-'+response.status+'-not-json';throw Error('Search did not return JSON.');}
 mkdirSync('public/data-sources',{recursive:true});const observation={checkedAt:new Date().toISOString(),searchStatus:response.status,rows:Array.isArray(rows)?rows.slice(0,20):rows};writeFileSync('public/data-sources/mfapi-observed.json',JSON.stringify(observation,null,2)+'\n');
 const found=Array.isArray(rows)?rows.find(r=>r.schemeCode&&typeof r.schemeName==='string'&&/\bregular\b.*\bgrowth\b/i.test(r.schemeName)&&!/\b(direct|idcw)\b/i.test(r.schemeName)):null;
 if(!response.ok){state='search-http-'+response.status;throw Error('Search HTTP '+response.status)}
 if(!Array.isArray(rows)){state='search-shape';throw Error('Search response shape: '+Object.keys(rows||{}).slice(0,8).join(','))}
 if(!found){const candidate=Array.isArray(rows)?rows.find(r=>r.schemeCode&&typeof r.schemeName==='string'&&/growth/i.test(r.schemeName)&&!/direct|idcw/i.test(r.schemeName)):null;if(candidate){const sample=await fetch('https://api.mfapi.in/mf/'+candidate.schemeCode+'/latest',{signal:AbortSignal.timeout(20000)});const data=await sample.json();observation.sampleMeta=data.meta;observation.sampleData=data.data?.slice(0,2);writeFileSync('public/data-sources/mfapi-observed.json',JSON.stringify(observation,null,2)+'\n')}state='no-regular-match';throw Error(`${rows.length} search rows; first keys ${Object.keys(rows[0]||{}).join(',')}; names ${rows.slice(0,3).map(r=>r.schemeName).join(' | ')}`)}
 const code=String(found.schemeCode);let nav=await fetch('https://api.mfapi.in/mf/'+code+'/latest',{headers:{Origin:origin},signal:AbortSignal.timeout(20000)});let endpoint='latest';if(nav.status===404){nav=await fetch('https://api.mfapi.in/mf/'+code,{headers:{Origin:origin},signal:AbortSignal.timeout(20000)});endpoint='history'}const body=await nav.json();const cors=response.headers.get('access-control-allow-origin'),navCors=nav.headers.get('access-control-allow-origin');const valid=nav.ok&&String(body.meta?.scheme_code)===code&&Array.isArray(body.data)&&body.data.length>0;
 state=valid?((cors==='*'||cors===origin)&&(navCors==='*'||navCors===origin)?'ready':'check-cors'):'nav-http-'+nav.status+'-format';details=`Search HTTP ${response.status}; ${rows.length} matches. NAV HTTP ${nav.status}; endpoint ${endpoint}; dated sample ${body.data?.[0]?.date||'none'}; browser CORS ${cors||'not supplied'} / ${navCors||'not supplied'}.`;
}catch(error){if(state==='unreachable')state=String(error.cause?.code||error.name||'network-error').replace(/[^A-Za-z0-9_-]/g,'').slice(0,40);details=error.message}
console.log('MFAPI '+state+': '+details);
if(process.env.GITHUB_OUTPUT)appendFileSync(process.env.GITHUB_OUTPUT,`mfapi_status=${state}\n`);
if(process.env.GITHUB_STEP_SUMMARY)appendFileSync(process.env.GITHUB_STEP_SUMMARY,`## MFAPI data-source check\n\n${state}: ${details}\n\nRead-only public scheme/NAV lookup. No investment or user data submitted.\n`);
