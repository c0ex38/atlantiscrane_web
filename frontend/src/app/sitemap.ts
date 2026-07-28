import { MetadataRoute } from 'next';
import { getProducts, getProjects, getSettings } from './lib/api';
import { normalizeSiteUrl, type SeoPageKey } from './lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = ['tr', 'en', 'ar'];
  const settings = await getSettings();
  const globalSeo = settings?.seo_global || {};
  if (globalSeo.sitemapEnabled === false) return [];

  const siteUrl = normalizeSiteUrl(globalSeo.siteUrl);
  const defaultLocale = globalSeo.defaultLocale || 'tr';
  
  // Static Routes
  const staticRoutes: { route: string; page: SeoPageKey; priority: number }[] = [
    { route: '', page: 'home', priority: 1 },
    { route: '/about', page: 'about', priority: 0.8 },
    { route: '/products', page: 'products', priority: 0.9 },
    { route: '/projects', page: 'projects', priority: 0.8 },
    { route: '/references', page: 'references', priority: 0.7 },
    { route: '/contact', page: 'contact', priority: 0.7 },
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 1. Add Static Routes
  locales.forEach((locale) => {
    staticRoutes.forEach(({ route, page, priority }) => {
      const pageSeo = settings?.site_content?.[locale]?.seo?.pages?.[page];
      if (pageSeo?.index === false || globalSeo.robotsIndex === false) return;

      sitemapEntries.push({
        url: `${siteUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority,
        alternates: {
          languages: {
            'tr': `${siteUrl}/tr${route}`,
            'en': `${siteUrl}/en${route}`,
            'ar': `${siteUrl}/ar${route}`,
            'x-default': `${siteUrl}/${defaultLocale}${route}`,
          },
        },
      });
    });
  });

  // Fetch dynamic data
  let products = [];
  let projects = [];
  
  try {
    products = await getProducts();
  } catch (error) {
    console.error("Sitemap: Failed to fetch products", error);
  }

  try {
    projects = await getProjects();
  } catch (error) {
    console.error("Sitemap: Failed to fetch projects", error);
  }

  // 2. Add Dynamic Products
  products.forEach((product: any) => {
    if (product.isActive) {
      locales.forEach((locale) => {
        sitemapEntries.push({
          url: `${siteUrl}/${locale}/products/${product.slug}`,
          lastModified: new Date(product.updatedAt),
          changeFrequency: 'weekly',
          priority: 0.9,
          alternates: {
            languages: {
              'tr': `${siteUrl}/tr/products/${product.slug}`,
              'en': `${siteUrl}/en/products/${product.slug}`,
              'ar': `${siteUrl}/ar/products/${product.slug}`,
              'x-default': `${siteUrl}/${defaultLocale}/products/${product.slug}`,
            },
          },
        });
      });
    }
  });

  // 3. Add Dynamic Projects
  projects.forEach((project: any) => {
    if (!project.isActive) return;
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: `${siteUrl}/${locale}/projects/${project.id}`,
        lastModified: new Date(project.updatedAt),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: {
            'tr': `${siteUrl}/tr/projects/${project.id}`,
            'en': `${siteUrl}/en/projects/${project.id}`,
            'ar': `${siteUrl}/ar/projects/${project.id}`,
            'x-default': `${siteUrl}/${defaultLocale}/projects/${project.id}`,
          },
        },
      });
    });
  });

  return sitemapEntries;
}
