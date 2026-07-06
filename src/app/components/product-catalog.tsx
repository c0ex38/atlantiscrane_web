import Link from "next/link";
import Image from "next/image";
import type { Locale } from "../lib/site-content";
import { sectionIds, translations } from "../lib/site-content";

type ProductCatalogProps = {
  locale: Locale;
};

export default function ProductCatalog({ locale }: ProductCatalogProps) {
  const t = translations[locale];
  const items = t.products.items;

  return (
    <section id={sectionIds.products} className="bg-white py-20 sm:py-24">
      <div className="container-shell">
        <div className="mb-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3">
              <span className="h-px w-10 bg-[color:var(--cta)]" />
              <p 
                className="text-lg md:text-xl font-medium italic text-[color:var(--cta)]"
                style={{ fontFamily: "var(--font-serif), serif", textTransform: "none", letterSpacing: "normal" }}
              >
                {t.products.eyebrow}
              </p>
            </div>
            <h2 className="max-w-3xl text-5xl font-black uppercase leading-[0.9] tracking-tight text-[color:var(--text)] sm:text-6xl lg:text-[5rem]">
              <span className="block">{t.products.title.split(" ").slice(0, 1).join(" ")}</span>
              <span className="block text-slate-200">
                {t.products.title.split(" ").slice(1).join(" ")}
              </span>
            </h2>
          </div>

          <div className="flex justify-start">
            <Link
              href={`/${locale}#${sectionIds.products}`}
              className="group inline-flex items-center text-xs font-black uppercase tracking-[0.15em] text-slate-900 transition hover:opacity-80"
            >
              <span className="mr-4">{t.products.exploreAll}</span>
              <span className="flex h-12 w-12 items-center justify-center bg-[color:var(--cta)] text-slate-950 transition-transform group-hover:translate-x-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </span>
            </Link>
          </div>
        </div>

        <div className="flex w-full flex-col md:flex-row">
          {items.map((item, index) => {
            // Unsplash placeholder images matching the crane/industrial theme
            const bgImages = [
              "https://images.unsplash.com/photo-1587582423116-ec07293f0395?q=80&w=2070",
              "https://images.unsplash.com/photo-1587582423116-ec07293f0395?q=80&w=2070",
              "https://images.unsplash.com/photo-1587582423116-ec07293f0395?q=80&w=2070"
            ];
            const bgImage = bgImages[index % bgImages.length];

            return (
              <article
                key={item.title}
                className="group relative h-[450px] flex-1 overflow-hidden transition-all duration-700 ease-in-out sm:h-[600px] md:hover:flex-[1.75] lg:h-[700px] lg:hover:flex-[2]"
              >
                {/* Background Image */}
                <Image
                  src={bgImage}
                  alt={item.title}
                  fill
                  quality={100}
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-all duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] grayscale group-hover:scale-110 group-hover:grayscale-0"
                />

                {/* Overlays */}
                <div className="absolute inset-0 bg-slate-900/40 transition-opacity duration-[1200ms] group-hover:opacity-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 transition-opacity duration-[1200ms] group-hover:opacity-100" />

                {/* Giant Number Background */}
                <div className="absolute -bottom-10 right-4 z-0 pointer-events-none transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-translate-y-8 group-hover:scale-110 md:-bottom-20 md:-right-10">
                  <span 
                    className="text-[12rem] font-black leading-none text-transparent md:text-[20rem] lg:text-[24rem]"
                    style={{ WebkitTextStroke: "2px rgba(255,255,255,0.06)" }}
                  >
                    0{index + 1}
                  </span>
                </div>

                {/* Content Container */}
                <div className="absolute inset-x-0 bottom-0 flex h-full flex-col justify-end p-8 sm:p-10 lg:p-12">
                  <div className="relative z-10 w-full md:w-[350px]">
                    <h3 className="text-3xl font-black uppercase leading-[0.95] tracking-tight text-white drop-shadow-xl sm:text-4xl transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-translate-y-2">
                      {item.title}
                    </h3>
                    <div className="mt-6 h-1.5 w-12 bg-[color:var(--cta)] transition-all duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:w-24 group-hover:-translate-y-2" />

                    <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:grid-rows-[1fr]">
                      <div className="overflow-hidden">
                        <div className="transform translate-y-8 pt-8 opacity-0 transition-all delay-150 duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-y-0 group-hover:opacity-100">
                          <p className="max-w-[95%] text-sm font-medium leading-relaxed text-slate-200">
                            {item.description}
                          </p>
                          <Link
                            href={`/${locale}#${sectionIds.products}`}
                            className="group/link mt-8 inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-[color:var(--cta)] transition-colors hover:text-white"
                          >
                            {t.products.viewDetail}
                            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[color:var(--cta)] transition-all group-hover/link:bg-[color:var(--cta)] group-hover/link:text-slate-900 group-hover/link:translate-x-1">
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
