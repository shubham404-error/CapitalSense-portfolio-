import type { NextConfig } from 'next';
const repoName = 'CapitalSense-portfolio-';
const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? `/${repoName}` : '',
  trailingSlash: true,
  images: { unoptimized: true },
};
export default nextConfig;
