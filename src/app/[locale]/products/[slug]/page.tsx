import { notFound } from "next/navigation";
import { isLocale, translations, type Locale } from "../../../lib/site-content";
import CtaSection from "../../../components/cta-section";
import DetailHero from "./components/detail-hero";
import DetailOverview from "./components/detail-overview";
import DetailFeatures from "./components/detail-features";
import DetailLoadChart from "./components/detail-load-chart";
import DetailSpecs from "./components/detail-specs";
import DetailEquipments from "./components/detail-equipments";


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
    "model-04",
    "model-05",
    "model-06",
    "model-07",
    "model-08",
  ];

  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }
  return params;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  // Parse the model number from the slug (e.g. "model-01" -> index 0)
  const match = slug.match(/^model-0(\d)$/);
  if (!match) {
    notFound();
  }
  const modelIndex = parseInt(match[1], 10) - 1;

  const currentLocale = locale as Locale;
  const t = translations[currentLocale];
  const products = t.products;
  const detail = t.productDetail;

  // Validate modelIndex is within bounds of translation items
  if (modelIndex < 0 || modelIndex >= products.items.length) {
    notFound();
  }

  type ProductItem = {
    title: string;
    shortIntro?: string;
    description?: string;
    usage?: string;
    capacity?: string;
    outreach?: string;
    features?: readonly string[];
    loadChart?: readonly { outreach: string; capacity: string }[];
  };

  const product = products.items[modelIndex] as unknown as ProductItem;
  const isRtl = locale === "ar";

  // Use the same fallback images as the list page
  const productImage = "/products/test-product.png";

  const capLabel =
    currentLocale === "tr" ? "Kapasite" : currentLocale === "en" ? "Capacity" : "الحمولة";
  const outLabel =
    currentLocale === "tr" ? "Erişim" : currentLocale === "en" ? "Outreach" : "المدى";

  const specsDesc =
    currentLocale === "tr"
      ? "Atlantis Crane mühendisleri, tüm güverte kreynlerini zorlu çalışma koşulları altında FEM standartlarına ve klas kuruluşu gerekliliklerine göre optimize eder."
      : currentLocale === "en"
        ? "Atlantis Crane engineers optimize all deck cranes according to FEM standards and classification society requirements under harsh operating conditions."
        : "يقوم مهندسو Atlantis Crane بتحسين جميع الرافعات وفقًا لمعايير FEM ومتطلبات هيئة التصنيف في ظل ظروف التشغيل القاسية.";

  const labels = {
    tr: {
      descTitle: "Genel Açıklama",
      usageTitle: "Ne İşe Yarar?",
      featuresTitle: "Öne Çıkan Özellikler",
      loadChartTitle: "Çalışma Kapasitesi",
      loadChartDesc: "Vinç, bom mesafesine göre farklı kaldırma kapasiteleri sunar. Detaylı değerler tabloda verilmiştir.",
      outreachCol: "Bom Mesafesi (Erişim)",
      capacityCol: "Kaldırma Kapasitesi"
    },
    en: {
      descTitle: "General Description",
      usageTitle: "Applications",
      featuresTitle: "Key Features",
      loadChartTitle: "Working Capacity",
      loadChartDesc: "The crane offers different lifting capacities depending on the boom outreach. Detailed values are given in the table.",
      outreachCol: "Outreach",
      capacityCol: "Lifting Capacity"
    },
    ar: {
      descTitle: "الوصف العام",
      usageTitle: "التطبيقات",
      featuresTitle: "الميزات الرئيسية",
      loadChartTitle: "سعة العمل",
      loadChartDesc: "توفر الرافعة سعات رفع مختلفة حسب مدى ذراع الرافعة. القيم المفصلة معطاة في الجدول.",
      outreachCol: "مدى الذراع",
      capacityCol: "سعة الرفع"
    }
  };

  const uiLabels = labels[currentLocale] || labels.en;

  const navItems = [
    { id: "section-hero", label: currentLocale === "tr" ? "Genel" : currentLocale === "ar" ? "عام" : "Overview" },
    { id: "section-overview", label: currentLocale === "tr" ? "Açıklama" : currentLocale === "ar" ? "الوصف" : "Description" },
    { id: "section-features", label: currentLocale === "tr" ? "Özellikler" : currentLocale === "ar" ? "الميزات" : "Features" },
    { id: "section-capacity", label: currentLocale === "tr" ? "Kapasite" : currentLocale === "ar" ? "الطاقة" : "Capacity" },
    { id: "section-specs", label: currentLocale === "tr" ? "Teknik" : currentLocale === "ar" ? "التقنية" : "Specs" },
    { id: "section-equipment", label: currentLocale === "tr" ? "Donanım" : currentLocale === "ar" ? "المعدات" : "Equipment" },
  ];

  return (
    <main className="min-h-screen bg-[#070b14] text-white -mt-24 pt-44 pb-0 overflow-hidden relative">
      {/* Page-level background glows */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-blue-900/8 rounded-full blur-[200px] pointer-events-none -z-0" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-[color:var(--cta)]/4 rounded-full blur-[180px] pointer-events-none -z-0" />

      <div className="container-shell relative z-10 px-4 md:px-8">
        {/* 1. Hero */}
        <DetailHero
          modelNumber={`Model 0${modelIndex + 1}`}
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

        {/* 2. Overview */}
        {(product.description || product.usage) && (
          <DetailOverview
            descTitle={uiLabels.descTitle}
            description={product.description || ""}
            usageTitle={uiLabels.usageTitle}
            usage={product.usage || ""}
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

        {/* 4. Load Chart */}
        {product.loadChart && product.loadChart.length > 0 && (
          <DetailLoadChart
            loadChartTitle={uiLabels.loadChartTitle}
            loadChartDesc={uiLabels.loadChartDesc}
            outreachCol={uiLabels.outreachCol}
            capacityCol={uiLabels.capacityCol}
            loadChart={product.loadChart}
            isRtl={isRtl}
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
        />
      </div>

      {/* CTA Section */}
      <CtaSection locale={currentLocale} />
    </main>
  );
}
