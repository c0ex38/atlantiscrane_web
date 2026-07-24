import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale, translations, type Locale } from "../../../lib/site-content";
import CtaSection from "../../../components/cta-section";
import DetailHero from "./components/detail-hero";
import DetailOverview from "./components/detail-overview";
import DetailFeatures from "./components/detail-features";
import DetailLoadChart from "./components/detail-load-chart";
import DetailSpecs from "./components/detail-specs";
import DetailEquipments from "./components/detail-equipments";
import { getProductBySlug, getSiteDictionary } from "../../../lib/api";

export const dynamic = "force-dynamic";


type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

// Generate static params for all combinations of locale & slug
export async function generateStaticParams() {
  const locales = ["tr", "en", "ar"];
  const slugs = [
    "model-01",
    "model-02",
    "model-03",
  ];

  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const currentLocale = locale as Locale;

  let dbProduct;
  try {
    dbProduct = await getProductBySlug(slug);
  } catch {
    return {};
  }

  if (!dbProduct || !dbProduct.isActive) return {};

  const title = dbProduct.title[currentLocale] || dbProduct.title.tr || dbProduct.title.en;
  const description = dbProduct.shortIntro?.[currentLocale] || dbProduct.shortIntro?.tr || "";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.atlantiscrane.com";
  
  return {
    title: `${title} - Atlantis Crane`,
    description: description,
    openGraph: {
      title: `${title} - Atlantis Crane`,
      description: description,
      url: `${siteUrl}/${currentLocale}/products/${slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - Atlantis Crane`,
      description: description,
    },
    alternates: {
      canonical: `${siteUrl}/${currentLocale}/products/${slug}`,
      languages: {
        'tr': `${siteUrl}/tr/products/${slug}`,
        'en': `${siteUrl}/en/products/${slug}`,
        'ar': `${siteUrl}/ar/products/${slug}`,
        'x-default': `${siteUrl}/tr/products/${slug}`,
      },
    }
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const currentLocale = locale as Locale;
  const t = await getSiteDictionary(currentLocale);
  const detail = t.productDetail;

  let dbProduct;
  try {
    dbProduct = await getProductBySlug(slug);
  } catch {
    notFound();
  }

  if (!dbProduct.isActive) {
    notFound();
  }

  const match = slug.match(/model-0(\d)/);
  const modelIdentifier = match ? `Model 0${match[1]}` : dbProduct.slug.toUpperCase();

  const product = {
    title: dbProduct.title[currentLocale] || dbProduct.title.tr || dbProduct.title.en,
    shortIntro: dbProduct.shortIntro?.[currentLocale] || dbProduct.shortIntro?.tr || dbProduct.shortIntro?.en || "",
    description: dbProduct.description?.[currentLocale] || dbProduct.description?.tr || dbProduct.description?.en || "",
    usage: dbProduct.usage?.[currentLocale] || dbProduct.usage?.tr || dbProduct.usage?.en || "",
    capacity: dbProduct.capacity?.[currentLocale] || dbProduct.capacity?.tr || dbProduct.capacity?.en || "",
    outreach: dbProduct.outreach?.[currentLocale] || dbProduct.outreach?.tr || dbProduct.outreach?.en || "",
    features: dbProduct.features?.[currentLocale] || dbProduct.features?.tr || dbProduct.features?.en || [],
    loadChart: dbProduct.loadChart || [],
  };

  const isRtl = locale === "ar";

  // Use the same fallback images as the list page
  const productImage = "/about-facility.png";

  const capLabel = t?.common?.capacity;
  const outLabel = t?.common?.outreach;

  const specsDesc = t?.productDetail?.specsDesc;
  const uiLabels = {
    descTitle: t?.productDetail?.descTitle,
    usageTitle: t?.productDetail?.usageTitle,
    featuresTitle: t?.productDetail?.featuresTitle,
    loadChartTitle: t?.productDetail?.loadChartTitle,
    loadChartDesc: t?.productDetail?.loadChartDesc,
    outreachCol: t?.productDetail?.outreachCol,
    capacityCol: t?.productDetail?.capacityCol
  };

  const navItems = [
    { id: "section-hero", label: t?.productDetail?.sectionLabels?.overview },
    { id: "section-overview", label: t?.productDetail?.sectionLabels?.description },
    { id: "section-features", label: t?.productDetail?.sectionLabels?.features },
    { id: "section-capacity", label: t?.productDetail?.sectionLabels?.capacity },
    { id: "section-specs", label: t?.productDetail?.sectionLabels?.specs },
    { id: "section-equipment", label: t?.productDetail?.sectionLabels?.equipment },
  ];

  return (
    <main className="min-h-screen bg-[#070b14] text-white -mt-24 pt-32 pb-0 overflow-hidden relative">
      {/* Page-level background glows */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-blue-900/8 rounded-full blur-[200px] pointer-events-none -z-0" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-cta/4 rounded-full blur-[180px] pointer-events-none -z-0" />

      {/* Schema.org Product Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.title,
            "description": product.shortIntro || product.description,
            "image": `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.atlantiscrane.com"}${productImage}`,
            "brand": {
              "@type": "Brand",
              "name": "Atlantis Crane"
            },
            "category": "Industrial Crane"
          })
        }}
      />

      <div className="container-shell relative z-10 px-4 md:px-8">
        {/* 1. Hero */}
        <DetailHero
          modelNumber={modelIdentifier}
          title={product.title}
          shortIntro={product.shortIntro || product.description || ""}
          capacity={product.capacity || ""}
          outreach={product.outreach || ""}
          capLabel={capLabel}
          outLabel={outLabel}
          quoteBtnText={detail.quoteBtn}
          backToListText={detail.backToList}
          productImage={productImage}
          locale={locale}
          isRtl={isRtl}
        />
      </div>

      <div className="w-full bg-[#f0f3f8] text-slate-900 relative z-10 py-12">
        <div className="container-shell px-4 md:px-8">
          {/* 2. Overview */}
          {(product.description || product.usage) && (
            <DetailOverview
              descTitle={uiLabels.descTitle}
              description={product.description || ""}
              usageTitle={uiLabels.usageTitle}
              usage={product.usage || ""}
              tags={t?.productDetail?.tags || []}
              isRtl={isRtl}
            />
          )}

          {/* 3. Features */}
          {product.features && product.features.length > 0 && (
            <DetailFeatures
              featuresTitle={uiLabels.featuresTitle}
              features={product.features}
              isRtl={isRtl}
            />
          )}
        </div>
      </div>

      <div className="container-shell relative z-10 px-4 md:px-8 py-12">

        {/* 4. Load Chart */}
        {product.loadChart && product.loadChart.length > 0 && (
          <DetailLoadChart
            loadChartTitle={uiLabels.loadChartTitle}
            loadChartDesc={uiLabels.loadChartDesc}
            outreachCol={uiLabels.outreachCol}
            capacityCol={uiLabels.capacityCol}
            loadChart={product.loadChart}
            isRtl={isRtl}
            loadEnvelope={detail.loadEnvelope}
            capacityUpper={detail.capacityUpper}
            outreachUpper={detail.outreachUpper}
            gridLabel={detail.gridLabel}
          />
        )}

        {/* 5. Technical Specifications */}
        <DetailSpecs
          title={detail.specsTitle}
          description={specsDesc}
          specKeys={detail.specKeys}
          specValues={detail.specValues}
          isRtl={isRtl}
        />

        {/* 6. Equipment */}
        <DetailEquipments
          standardTitle={detail.standardEquipTitle}
          optionalTitle={detail.optionalEquipTitle}
          standardItems={detail.equipments.standard}
          optionalItems={detail.equipments.optional}
          standardLabel={detail.standardLabel}
          optionalLabel={detail.optionalLabel}
          classCertLabel={detail.classCertLabel}
        />
      </div>

      {/* CTA Section */}
      <CtaSection locale={currentLocale} />
    </main>
  );
}
