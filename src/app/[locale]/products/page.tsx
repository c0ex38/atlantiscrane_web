import { notFound } from "next/navigation";
import { isLocale, translations, type Locale } from "../../lib/site-content";
import ProductsHero from "./components/products-hero";
import ProductCard from "./components/product-card";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return [{ locale: "tr" }, { locale: "en" }, { locale: "ar" }];
}

// 8 Premium Product Images matching categories (First is the real user-uploaded knuckle boom crane)
const productImages = [
  "/products/knuckle-boom.png",
  "https://images.unsplash.com/photo-1541535881962-e6d8615b3746?q=80&w=800", // Telescopic boom
  "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?q=80&w=800", // Stiff boom cargo
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800", // Knuckle Telescopic / shipyard
  "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=800", // Offshore oil rig platform
  "https://images.unsplash.com/photo-1505705694340-019e1e335916?q=80&w=800", // yacht deck provision
  "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=800", // rescue boat davit
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800"  // research vessel A-frame
];

export default async function ProductsPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const currentLocale = locale as Locale;
  const t = translations[currentLocale];
  const products = t.products.items;

  // Localized metadata and labels
  const metaTitle = currentLocale === "tr" ? "Ürün Kataloğumuz" : currentLocale === "en" ? "Our Product Catalog" : "كتالوج منتجاتنا";
  const metaDesc = currentLocale === "tr" ? "Gemi, yat ve açık deniz platformları için tasarlanmış yüksek mühendislik ürünü deniz vinçleri." : currentLocale === "en" ? "High-engineered marine cranes designed for vessels, yachts, and offshore platforms." : "رافعات بحرية هندسية متطورة مصممة للسفن واليخوت والمنصات البحرية.";
  
  const capLabel = currentLocale === "tr" ? "Kapasite" : currentLocale === "en" ? "Capacity" : "الحمولة";
  const outLabel = currentLocale === "tr" ? "Erişim" : currentLocale === "en" ? "Outreach" : "المدى";
  const contactCta = currentLocale === "tr" ? "Teklif Al / İletişim" : currentLocale === "en" ? "Get Quote / Contact" : "طلب اقتراح / اتصال";

  return (
    <div className="bg-slate-50/50 min-h-screen pb-24">
      {/* Premium Dark Hero Section */}
      <ProductsHero title={metaTitle} description={metaDesc} />

      {/* Product Catalog Grid Section */}
      <section className="container-shell mt-16 md:mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((item, index: number) => (
            <ProductCard
              key={index}
              item={item}
              index={index}
              currentLocale={currentLocale}
              productImage={productImages[index % productImages.length]}
              capLabel={capLabel}
              outLabel={outLabel}
              contactCta={contactCta}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
