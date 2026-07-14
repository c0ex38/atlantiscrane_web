import { MetadataRoute } from 'next';
import { getProducts, getProjects } from './lib/api';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.atlantiscrane.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = ['tr', 'en', 'ar'];
  
  // Static Routes
  const staticRoutes = [
    '',
    '/about',
    '/products',
    '/projects',
    '/references',
    '/contact',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 1. Add Static Routes
  locales.forEach((locale) => {
    staticRoutes.forEach((route) => {
      sitemapEntries.push({
        url: `${SITE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : 0.8,
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
          url: `${SITE_URL}/${locale}/products/${product.slug}`,
          lastModified: new Date(product.updatedAt),
          changeFrequency: 'weekly',
          priority: 0.9,
        });
      });
    }
  });

  // 3. Add Dynamic Projects (Currently projects don't have slugs in the route, but they are shown on the /projects page)
  // If there's a detailed project page, we'd map it here. Assuming we only have a list page for now.
  // Wait, let's check if there is a detail page for projects. In the current layout, it seems projects are only listed on /projects.
  // We'll leave it as is. If we add a /[locale]/projects/[slug] in the future, we can add it here.

  return sitemapEntries;
}
