import {renameSync,existsSync,writeFileSync,cpSync,rmSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
process.chdir(root);
const source=resolve('app/api'),backup=resolve('.stride-pages-api');
if(existsSync(backup))throw new Error('A prior static build left .stride-pages-api. Restore it to app/api before retrying.');
const cliBasePath=process.argv[2];
const basePath=cliBasePath||process.env.APP_BASE_PATH||process.env.PAGES_BASE_PATH||'';
// Dev route types still reference server-only API files. They are generated
// artifacts and must not be included while the API folder is hidden below.
rmSync(resolve('.next/dev'),{recursive:true,force:true});
// Pages has no server runtime. Temporarily exclude the API and always restore it.
renameSync(source,backup);
let status=1;
try{
 const result=spawnSync(process.execPath,['node_modules/next/dist/bin/next','build'],{
  stdio:'inherit',
  env:{...process.env,NEXT_STATIC_EXPORT:'true',APP_BASE_PATH:basePath,NEXT_PUBLIC_GUIDE_PROXY:cliBasePath==='/stride'?'true':process.env.NEXT_PUBLIC_GUIDE_PROXY||'false'},
 });
 if(result.error)throw result.error;
 status=result.status??1;
 if(status===0){rmSync('out',{recursive:true,force:true});cpSync('.next-pages','out',{recursive:true});writeFileSync('out/.nojekyll','');}
}finally{renameSync(backup,source)}
process.exitCode=status;
