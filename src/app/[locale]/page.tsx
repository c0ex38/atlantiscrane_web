import { notFound } from "next/navigation";
import Hero from "../components/hero";
import ProductCatalog from "../components/product-catalog";
import HistoryTimeline from "../components/history-timeline";
import EngineeringStandards from "../components/engineering-standards";
import ExportNetwork from "../components/export-network";
import CtaSection from "../components/cta-section";
import { isLocale, type Locale } from "../lib/site-content";

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

  return (
    <main>
      <Hero locale={locale as Locale} />
      <ProductCatalog locale={locale as Locale} />
      <HistoryTimeline locale={locale as Locale} />
      <EngineeringStandards locale={locale as Locale} />
      <ExportNetwork locale={locale as Locale} />
      <CtaSection locale={locale as Locale} />
    </main>
  );
}
