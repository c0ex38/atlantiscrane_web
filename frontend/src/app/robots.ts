import { MetadataRoute } from 'next';
import { getSettings } from './lib/api';
import { normalizeSiteUrl } from './lib/seo';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSettings();
  const globalSeo = settings?.seo_global || {};
  const siteUrl = normalizeSiteUrl(globalSeo.siteUrl);
  const allowIndexing = globalSeo.robotsIndex !== false;

  return {
    rules: {
      userAgent: '*',
      allow: allowIndexing ? '/' : undefined,
      disallow: allowIndexing ? ['/admin', '/api/'] : '/',
    },
    sitemap: globalSeo.sitemapEnabled === false ? undefined : `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
