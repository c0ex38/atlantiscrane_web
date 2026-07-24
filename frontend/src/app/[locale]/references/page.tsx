import { notFound } from "next/navigation";
import Image from "next/image";
import { isLocale, translations, type Locale } from "../../lib/site-content";
import CtaSection from "../../components/cta-section";
import { getReferences, getSiteDictionary } from "../../lib/api";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return [{ locale: "tr" }, { locale: "en" }, { locale: "ar" }];
}

export default async function ReferencesPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const currentLocale = locale as Locale;
  const t = await getSiteDictionary(currentLocale);
  const { eyebrow, title, description, note } = t.projects;
  const dbReferences = await getReferences();

  const items = dbReferences
    .filter(p => p.isActive)
    .map(p => ({
      title: p.title[currentLocale] || p.title.tr || p.title.en,
      client: p.client?.[currentLocale] || p.client?.tr || p.client?.en || "",
      category: p.category?.[currentLocale] || p.category?.tr || p.category?.en || "",
      description: p.description?.[currentLocale] || p.description?.tr || p.description?.en || "",
      image: p.image || "/about-facility.png"
    }));

  return (
    <main className="min-h-screen bg-[#070b14] text-white -mt-24 pt-44">
      {/* Background glow effects */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-blue-950/20 rounded-full blur-[150px] pointer-events-none -z-0" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-cta/5 rounded-full blur-[180px] pointer-events-none -z-0" />

      <div className="container-shell relative z-10 px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-flex items-center gap-3 text-xs font-mono tracking-[0.35em] text-cta uppercase mb-6">
            <span className="w-8 h-px bg-cta" />
            {eyebrow}
          </span>
          <h1 
            className="font-black tracking-tight leading-[0.95] text-white mb-8"
            style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
          >
            {title}
          </h1>
          <p className="text-slate-400 text-base md:text-lg leading-relaxed">
            {description}
          </p>
        </div>

        {/* References Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mb-16">
          {items.map((item, index) => (
            <div
              key={index}
              className="group relative flex flex-col items-center justify-center p-6 md:p-8 rounded-3xl bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-xl border border-white/5 hover:border-white/10 hover:shadow-[0_0_40px_rgba(255,255,255,0.03)] hover:-translate-y-1 transition-all duration-500"
            >
              {/* Subtle inner gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              {/* Image Box */}
              <div className="relative aspect-square w-full flex items-center justify-center mb-5">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className="object-contain p-2 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.05)] group-hover:drop-shadow-[0_0_25px_rgba(253,197,32,0.15)] transition-all duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                />
              </div>

              {/* Content */}
              <h3 className="relative text-sm font-semibold text-slate-400 text-center group-hover:text-white transition-colors duration-300 line-clamp-2">
                {item.title}
              </h3>
            </div>
          ))}
        </div>

        {/* Footnote */}
        <p className="text-center text-xs text-slate-500 font-medium italic mt-8 mb-24">
          ℹ️ {note}
        </p>
      </div>

      <CtaSection locale={currentLocale} />
    </main>
  );
}
