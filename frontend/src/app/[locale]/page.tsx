import { notFound } from "next/navigation";
import Hero from "../components/hero";
import AboutSection from "../components/about-section";
import ProductCatalog from "../components/product-catalog";
import HistoryTimeline from "../components/history-timeline";
import EngineeringStandards from "../components/engineering-standards";
import ExportNetwork from "../components/export-network";
import ReferencesSection from "../components/references-section";
import CtaSection from "../components/cta-section";
import { isLocale, type Locale } from "../lib/site-content";
import { getProducts, getProjects } from "../lib/api";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return [{ locale: "tr" }, { locale: "en" }, { locale: "ar" }];
}

export default async function LocaleHome({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dbProducts = await getProducts();
  const homeProducts = dbProducts.filter((p: any) => p.isActive && p.showOnHome);
  const dbProjects = await getProjects();
  const homeProjects = dbProjects.filter((p: any) => p.isActive && p.showOnHome);

  return (
    <main>
      <Hero locale={locale as Locale} />
      <AboutSection locale={locale as Locale} />
      <ProductCatalog locale={locale as Locale} products={homeProducts} />
      <HistoryTimeline locale={locale as Locale} />
      <EngineeringStandards locale={locale as Locale} />
      <ExportNetwork locale={locale as Locale} />
      <ReferencesSection locale={locale as Locale} references={homeProjects} />
      <CtaSection locale={locale as Locale} />
    </main>
  );
}
