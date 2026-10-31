import type {MetadataRoute} from 'next';
export default function sitemap():MetadataRoute.Sitemap {
  const base='https://shubham404-error.github.io/CapitalSense-portfolio-';
  const routes=['','/about','/services','/services/individual-investors','/services/hni-investors','/research','/insights','/ecosystem','/connect','/disclosures','/privacy','/terms','/insights/sip-is-a-method-not-a-product','/insights/compounding-needs-time','/insights/understanding-mutual-fund-risk','/insights/mutual-fund-costs','/insights/portfolio-overlap','/insights/review-without-overreacting'];
  return routes.map(route=>({url:base+route+'/',lastModified:new Date(),changeFrequency:route===''?'weekly':'monthly',priority:route===''?1:0.6}));
}