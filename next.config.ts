import type {NextConfig} from 'next';
const isStatic=process.env.NEXT_STATIC_EXPORT==='true';
const basePath=isStatic?(process.env.PAGES_BASE_PATH||''):'';
const config:NextConfig={
  ...(isStatic?{output:'export',distDir:'.next-pages'}:{}),
  basePath,
  trailingSlash:true,
  images:{unoptimized:true},
  env:{NEXT_PUBLIC_BASE_PATH:basePath,NEXT_PUBLIC_STATIC_DEMO:isStatic?'true':'false'},
};
export default config;
