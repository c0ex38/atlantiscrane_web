import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { isLocale, type Locale } from "../../lib/site-content";
import CtaSection from "../../components/cta-section";
import { getProjects, getSiteDictionary } from "../../lib/api";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return [{ locale: "tr" }, { locale: "en" }, { locale: "ar" }];
}

export default async function ProjectsPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const currentLocale = locale as Locale;
  const t = await getSiteDictionary(currentLocale);
  const { eyebrow, title, description, note } = t.projects;
  const dbProjects = await getProjects();

  const items = dbProjects
    .filter(p => p.isActive)
    .map(p => ({
      id: p.id,
      title: p.title[currentLocale] || p.title.tr || p.title.en,
      client: p.client?.[currentLocale] || p.client?.tr || p.client?.en || "",
      category: p.category?.[currentLocale] || p.category?.tr || p.category?.en || "",
      description: p.description?.[currentLocale] || p.description?.tr || p.description?.en || "",
      image: p.image || "/about-facility.png"
    }));

  const featured = items[0];
  const rest = items.slice(1);

  return (
    <main className="min-h-screen bg-[#070b14] text-white -mt-24 pt-44">
      {/* Background ambiance */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-blue-950/15 rounded-full blur-[180px] pointer-events-none -z-0" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-cta/5 rounded-full blur-[180px] pointer-events-none -z-0" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-900/10 rounded-full blur-[150px] pointer-events-none -z-0" />

      <div className="container-shell relative z-10 px-4 md:px-8">

        {/* ── Page Header ── */}
        <div className="text-center max-w-4xl mx-auto mb-24">
          <span className="inline-flex items-center gap-3 text-xs font-mono tracking-[0.35em] text-cta uppercase mb-8">
            <span className="w-12 h-px bg-cta/60" />
            {eyebrow}
            <span className="w-12 h-px bg-cta/60" />
          </span>
          <h1
            className="font-black tracking-tight leading-[0.9] text-white mb-8"
            style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
          >
            {title}
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* ── Stats Strip ── */}
        <div className="flex items-center justify-center gap-12 mb-20 pb-12 border-b border-white/5">
          {[
            { num: `${items.length}+`, label: currentLocale === "tr" ? "Tamamlanan Proje" : currentLocale === "ar" ? "مشروع منجز" : "Completed Projects" },
            { num: "25+", label: currentLocale === "tr" ? "Yıl Deneyim" : currentLocale === "ar" ? "سنوات خبرة" : "Years Experience" },
            { num: "15+", label: currentLocale === "tr" ? "Ülkede Teslimat" : currentLocale === "ar" ? "دولة" : "Countries Served" },
          ].map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="text-3xl md:text-4xl font-black text-cta mb-1 group-hover:scale-110 transition-transform duration-300">
                {stat.num}
              </div>
              <div className="text-xs text-slate-500 font-semibold tracking-widest uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-32">
            <div className="text-6xl mb-6">🏗️</div>
            <p className="text-slate-500 text-lg">
              {currentLocale === "tr" ? "Henüz proje eklenmemiş." : currentLocale === "ar" ? "لا توجد مشاريع بعد." : "No projects added yet."}
            </p>
          </div>
        )}

        {/* ── Featured Project (first item) ── */}
        {featured && (
          <Link href={`/${currentLocale}/projects/${featured.id}`} className="group relative rounded-3xl overflow-hidden border border-white/10 hover:border-cta/20 transition-all duration-500 mb-8 hover:shadow-[0_40px_80px_rgba(0,0,0,0.4)] hover:-translate-y-1 block cursor-pointer">
            {/* Full bleed image */}
            <div className="relative aspect-[21/9] w-full overflow-hidden">
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                sizes="100vw"
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#070b14] via-[#070b14]/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-transparent to-transparent opacity-70" />
            </div>

            {/* Content overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-14">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-5">
                  <span className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-cta text-slate-950 rounded-full">
                    {featured.category}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    {featured.client}
                  </span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-5 group-hover:text-cta/90 transition-colors duration-300">
                  {featured.title}
                </h2>
                <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-xl">
                  {featured.description}
                </p>
                <span className="inline-flex items-center gap-2 mt-6 text-cta text-sm font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {currentLocale === "tr" ? "Detayları Gör" : currentLocale === "ar" ? "عرض التفاصيل" : "View Details"} →
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* ── Rest of Projects ── */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16">
            {rest.map((item, index) => (
              <Link
                key={index}
                href={`/${currentLocale}/projects/${item.id}`}
                className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-cta/20 flex flex-col hover:shadow-[0_30px_60px_rgba(0,0,0,0.5)] hover:-translate-y-1 transition-all duration-500"
              >
                {/* Image */}
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-[#070b14]/30 to-transparent" />
                  {/* Category badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-2.5 py-1 text-[9px] font-black uppercase tracking-widest bg-cta/90 backdrop-blur-sm text-slate-950 rounded-full">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 bg-[#070b14] flex flex-col flex-1 border-t border-white/5">
                  <span className="text-[10px] font-bold text-cta/60 uppercase tracking-widest mb-2 block">
                    {item.client}
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-white mb-3 group-hover:text-cta transition-colors duration-300 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed flex-1">
                    {item.description}
                  </p>
                  <span className="text-cta text-xs font-bold uppercase tracking-widest mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {currentLocale === "tr" ? "Detayları Gör →" : currentLocale === "ar" ? "عرض التفاصيل →" : "View Details →"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Footnote */}
        <p className="text-center text-xs text-slate-600 font-medium italic mt-4 mb-24">
          ℹ️ {note}
        </p>
      </div>

      <CtaSection locale={currentLocale} />
    </main>
  );
}
