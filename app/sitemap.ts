import type {MetadataRoute} from 'next';
const base='https://shubham404-error.github.io/CapitalSense-portfolio-';
const routes=['','/about','/services','/services/individual-investors','/services/hni-investors','/research','/insights','/ecosystem','/connect','/disclosures','/privacy','/terms','/insights/sip-is-a-method-not-a-product','/insights/compounding-needs-time','/insights/understanding-mutual-fund-risk','/insights/mutual-fund-costs','/insights/portfolio-overlap','/insights/review-without-overreacting'];
export default function sitemap():MetadataRoute.Sitemap{return routes.map(route=>({url:base+route+'/',changeFrequency:route===''?'weekly':'monthly',priority:route===''?1:0.6}));}
