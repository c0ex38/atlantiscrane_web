import { notFound } from "next/navigation";
import { isLocale, translations, type Locale } from "../../lib/site-content";
import ProductsHero from "./components/products-hero";
import ProductSlide from "./components/product-slide";
import CtaSection from "../../components/cta-section";
import ProductsSliderWrapper from "./components/products-slider-wrapper";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return [{ locale: "tr" }, { locale: "en" }, { locale: "ar" }];
}

// Product images mapped to each product index
const productImages = [
  "/products/test-product.png"
];

export default async function ProductsPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const currentLocale = locale as Locale;
  const t = translations[currentLocale];
  const products = t.products;

  const metaDesc =
    currentLocale === "tr"
      ? "Gemi, yat ve açık deniz platformları için tasarlanmış yüksek mühendislik ürünü deniz vinçleri."
      : currentLocale === "en"
        ? "High-engineered marine cranes designed for vessels, yachts, and offshore platforms."
        : "رافعات بحرية هندسية متطورة مصممة للسفن واليخوت والمنصات البحرية.";

  const capLabel =
    currentLocale === "tr" ? "Kapasite" : currentLocale === "en" ? "Capacity" : "الحمولة";
  const outLabel =
    currentLocale === "tr" ? "Erişim" : currentLocale === "en" ? "Outreach" : "المدى";
  const detailLabel =
    currentLocale === "tr" ? "Detaylı İncele" : currentLocale === "en" ? "View Details" : "عرض التفاصيل";

  // Build the array of product slides only
  const productSlides = products.items.map((item, index) => (
    <ProductSlide
      key={`slide-${index}`}
      item={item}
      index={index}
      capLabel={capLabel}
      outLabel={outLabel}
      productImage={productImages[index % productImages.length]}
      locale={currentLocale}
      detailLabel={detailLabel}
    />
  ));

  return (
    <main className="bg-[#0a0a14] relative flex flex-col">
      <ProductsHero title={products.title} description={metaDesc} />

      <ProductsSliderWrapper slides={productSlides} />

      <CtaSection locale={currentLocale} />
    </main>
  );
}
