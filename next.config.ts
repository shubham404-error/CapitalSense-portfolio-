import type {NextConfig} from 'next';
const isStatic=process.env.NEXT_STATIC_EXPORT==='true';
const requestedBasePath=process.env.APP_BASE_PATH||process.env.PAGES_BASE_PATH||'';
const basePath=isStatic&&requestedBasePath!=='/'?requestedBasePath.replace(/\/$/,''):'';

if(basePath&&!/^\/[A-Za-z0-9._~!$&'()*+,;=:@/-]+$/.test(basePath)){
  throw new Error('APP_BASE_PATH must be an absolute URL path such as /stride.');
}

const config:NextConfig={
  ...(isStatic?{output:'export',distDir:'.next-pages'}:{}),
  turbopack:{root:process.cwd()},
  basePath,
  trailingSlash:true,
  images:{unoptimized:true},
  env:{NEXT_PUBLIC_BASE_PATH:basePath,NEXT_PUBLIC_STATIC_DEMO:isStatic?'true':'false'},
};
export default config;
