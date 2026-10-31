import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const base = 'https://shubham404-error.github.io/CapitalSense-portfolio-';
const routes = [
  '',
  '/about',
  '/services',
  '/services/individual-investors',
  '/services/hni-investors',
  '/research',
  '/insights',
  '/ecosystem',
  '/connect',
  '/disclosures',
  '/privacy',
  '/terms',
  '/insights/sip-is-a-method-not-a-product',
  '/insights/compounding-needs-time',
  '/insights/understanding-mutual-fund-risk',
  '/insights/mutual-fund-costs',
  '/insights/portfolio-overlap',
  '/insights/review-without-overreacting',
  '/insights/asset-allocation-is-the-real-portfolio',
  '/insights/large-mid-small-cap-are-not-risk-ratings',
  '/insights/emergency-fund-before-investing',
  '/insights/market-cycles-and-changing-leadership',
  '/insights/behavioural-biases-that-shape-investing',
  '/insights/goal-based-investing-start-with-the-number',
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: base + route + '/',
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.6,
  }));
}
