import {readFileSync,writeFileSync,mkdirSync,existsSync,renameSync,appendFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import ts from 'typescript';
const js=ts.transpileModule(readFileSync(new URL('../lib/fund-categories.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const module={exports:{}};new Function('exports',js)(module.exports);
const assets=[...new Set(module.exports.fundCategories.map(c=>c.asset))];
const dir=new URL('../public/fund-categories/',import.meta.url);mkdirSync(dir,{recursive:true});
function validate(bytes){if(bytes.length<32||bytes.length>8*1024*1024||!bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))throw Error('Invalid PNG');const w=bytes.readUInt32BE(16),h=bytes.readUInt32BE(20);if(!w||!h||w*h>40000000)throw Error('Unexpected image dimensions');return {width:w,height:h}}
const entries=[];const errors=[];
for(let start=0;start<assets.length;start+=4){const batch=await Promise.allSettled(assets.slice(start,start+4).map(async asset=>{if(!/^[A-Za-z0-9_]+\.png$/.test(asset))throw Error('Unsafe asset filename');const path=new URL(asset,dir);let bytes;if(existsSync(path)){bytes=readFileSync(path)}else{const url=new URL(asset,'https://ap-strapi.s3.ap-south-1.amazonaws.com/');const response=await fetch(url,{signal:AbortSignal.timeout(30000),redirect:'error'});if(!response.ok)throw Error(`${asset}: source HTTP ${response.status}`);const length=Number(response.headers.get('content-length')||0);if(length>8*1024*1024)throw Error(`${asset}: image too large`);bytes=Buffer.from(await response.arrayBuffer())}const dimensions=validate(bytes);if(!existsSync(path)){const temp=new URL(asset+'.tmp',dir);writeFileSync(temp,bytes);renameSync(temp,path)}return {asset,...dimensions,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')};}));for(const item of batch){if(item.status==='fulfilled')entries.push(item.value);else errors.push(item.reason?.message||'Download failed')}}
if(errors.length){console.error('Category images were not bundled:',errors.join('\n'));throw Error('Stopping deployment instead of silently substituting the supplied artwork.');}
entries.sort((a,b)=>a.asset.localeCompare(b.asset));writeFileSync(new URL('manifest.json',dir),JSON.stringify({source:'User-supplied public image URLs',images:entries},null,2)+'\n');
console.log(`Bundled ${entries.length} verified PNGs for ${module.exports.fundCategories.length} category tiles.`);
if(process.env.GITHUB_OUTPUT)appendFileSync(process.env.GITHUB_OUTPUT,`category_images=${entries.length}\n`);
if(process.env.GITHUB_STEP_SUMMARY)appendFileSync(process.env.GITHUB_STEP_SUMMARY,`## Supplied category artwork\n\n${entries.length} PNG images bundled locally for ${module.exports.fundCategories.length} tiles. PNG signatures, dimensions and SHA-256 digests recorded in public/fund-categories/manifest.json. No hot-linking is used in the published UI.\n`);
