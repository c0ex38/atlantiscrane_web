import { notFound } from "next/navigation";
import { isLocale, translations, type Locale } from "../../lib/site-content";
import ProductsHero from "./components/products-hero";
import ProductSlide from "./components/product-slide";
import CtaSection from "../../components/cta-section";
import ProductsSliderWrapper from "./components/products-slider-wrapper";
import { getProducts, getSiteDictionary } from "../../lib/api";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return [{ locale: "tr" }, { locale: "en" }, { locale: "ar" }];
}

// Product images mapped to each product index
const productImages = [
  "/about-facility.png"
];

export default async function ProductsPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const currentLocale = locale as Locale;
  const t = await getSiteDictionary(currentLocale);
  const products = t.products;
  const dbProducts = await getProducts();

  const metaDesc = t?.products?.description;
  const capLabel = t?.common?.capacity;
  const outLabel = t?.common?.outreach;
  const detailLabel = t?.common?.viewDetails;

  // Map db products to match localized structure that ProductSlide expects
  const localizedItems = dbProducts
    .filter(p => p.isActive)
    .map(p => ({
      title: p.title[currentLocale] || p.title.tr || p.title.en,
      shortIntro: p.shortIntro?.[currentLocale] || p.shortIntro?.tr || p.shortIntro?.en || "",
      description: p.shortIntro?.[currentLocale] || p.shortIntro?.tr || p.shortIntro?.en || p.description?.[currentLocale] || p.description?.tr || p.description?.en || "", // Use shortIntro as description on slide, or fallback to description
      capacity: p.capacity?.[currentLocale] || p.capacity?.tr || p.capacity?.en || "",
      outreach: p.outreach?.[currentLocale] || p.outreach?.tr || p.outreach?.en || "",
      slug: p.slug
    }));

  const productSlides = localizedItems.map((item, index) => (
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
