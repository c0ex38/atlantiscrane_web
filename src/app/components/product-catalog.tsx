import Link from "next/link";
import Image from "next/image";
import type { Locale } from "../lib/site-content";
import { sectionIds, translations } from "../lib/site-content";

type ProductCatalogProps = {
  locale: Locale;
};

export default function ProductCatalog({ locale }: ProductCatalogProps) {
  const t = translations[locale];
  const items = t.products.items.slice(0, 3);

  return (
    <section id={sectionIds.products} className="bg-white py-20 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-center justify-center gap-6 text-center max-w-3xl mx-auto">
          <div className="space-y-4 flex flex-col items-center">
            <div className="inline-flex items-center gap-3">
              <span className="h-px w-10 bg-cta" />
              <p 
                className="text-lg md:text-xl font-medium italic text-cta"
                style={{ fontFamily: "var(--font-serif), serif", textTransform: "none", letterSpacing: "normal" }}
              >
                {t.products.eyebrow}
              </p>
              <span className="h-px w-10 bg-cta" />
            </div>
            <h2 className="text-5xl font-black uppercase leading-[0.9] tracking-tight text-[color:var(--text)] sm:text-6xl lg:text-[5rem]">
              <span className="block">{t.products.title.split(" ").slice(0, 1).join(" ")}</span>
              <span className="block text-slate-200">
                {t.products.title.split(" ").slice(1).join(" ")}
              </span>
            </h2>
          </div>

          <div className="flex justify-center mt-2">
            <Link
              href={`/${locale}/products`}
              className="group inline-flex items-center text-xs font-black uppercase tracking-[0.15em] text-slate-900 transition hover:opacity-80"
            >
              <span className="mr-4">{t.products.exploreAll}</span>
              <span className="flex h-12 w-12 items-center justify-center bg-cta text-slate-950 transition-transform group-hover:translate-x-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </span>
            </Link>
          </div>
        </div>

        <div className="flex w-full flex-col md:flex-row">
          {items.map((item, index) => {
            // Unsplash placeholder images matching the crane/industrial theme
            const bgImages = [
              "/products/knuckle-boom.png",
              "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?q=80&w=2070", // shipyard / ship cargo
              "https://images.unsplash.com/photo-1541535881962-e6d8615b3746?q=80&w=2070", // industrial crane
              "https://images.unsplash.com/photo-1587582423116-ec07293f0395?q=80&w=2070"  // marine port/industrial structure
            ];
            const bgImage = bgImages[index % bgImages.length];

            return (
              <article
                key={item.title}
                className="group relative h-[380px] flex-1 overflow-hidden transition-[flex] duration-1000 ease-in-out sm:h-[500px] md:hover:flex-[1.6] lg:h-[580px] lg:hover:flex-[1.8]"
                style={{ willChange: "flex" }}
              >
                {/* Background Image */}
                <Image
                  src={bgImage}
                  alt={item.title}
                  fill
                  quality={100}
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-105"
                  style={{ willChange: "transform" }}
                />

                {/* Overlays */}
                <div 
                  className="absolute inset-0 bg-slate-900/40 transition-opacity duration-[1500ms] group-hover:opacity-0" 
                  style={{ willChange: "opacity" }}
                />
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 transition-opacity duration-[1500ms] group-hover:opacity-100" 
                  style={{ willChange: "opacity" }}
                />

                {/* Giant Number Background */}
                <div 
                  className="absolute -bottom-10 right-4 z-0 pointer-events-none transition-transform duration-[1500ms] ease-out group-hover:-translate-y-8 group-hover:scale-110 md:-bottom-20 md:-right-10"
                  style={{ willChange: "transform" }}
                >
                  <span 
                    className="text-[10rem] font-black leading-none text-transparent md:text-[16rem] lg:text-[18rem]"
                    style={{ WebkitTextStroke: "2px rgba(255,255,255,0.06)" }}
                  >
                    0{index + 1}
                  </span>
                </div>

                {/* Content Container */}
                <div className="absolute inset-x-0 bottom-0 flex h-full flex-col justify-end p-7 sm:p-8 lg:p-10">
                  <div className="relative z-10 w-full md:w-[320px]">
                    <h3 
                      className="text-2xl font-black uppercase leading-[0.95] tracking-tight text-white drop-shadow-xl sm:text-3xl transition-transform duration-[1500ms] ease-out group-hover:-translate-y-2"
                      style={{ willChange: "transform" }}
                    >
                      {item.title}
                    </h3>
                    <div 
                      className="mt-5 h-1.5 w-20 origin-left bg-cta transition-transform duration-[1500ms] ease-out scale-x-50 group-hover:scale-x-100 group-hover:-translate-y-2"
                      style={{ willChange: "transform" }}
                    />

                    <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-[1500ms] ease-out group-hover:grid-rows-[1fr]">
                      <div className="overflow-hidden">
                        <div 
                          className="transform translate-y-6 pt-6 opacity-0 transition-[transform,opacity] delay-200 duration-[1200ms] ease-out group-hover:translate-y-0 group-hover:opacity-100"
                          style={{ willChange: "transform, opacity" }}
                        >
                          <p className="max-w-[95%] text-xs font-medium leading-relaxed text-slate-200 sm:text-sm">
                            {item.description}
                          </p>
                          <Link
                            href={`/${locale}/products`}
                            className="group/link mt-6 inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-cta transition-colors hover:text-white sm:text-xs"
                          >
                            {t.products.viewDetail}
                            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-cta transition-[background-color,color,transform] group-hover/link:bg-cta group-hover/link:text-slate-900 group-hover/link:translate-x-1">
                              →
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
