import { notFound } from "next/navigation";
import Image from "next/image";
import { isLocale, translations, type Locale } from "../../lib/site-content";
import CtaSection from "../../components/cta-section";
import { getProjects, getSiteDictionary } from "../../lib/api";

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

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {items.map((item, index) => (
            <div
              key={index}
              className="group bg-slate-900/50 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 flex flex-col h-full hover:shadow-[0_20px_50px_rgba(253,197,32,0.05)] hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image Box */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4">
                  <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-cta text-slate-950 rounded">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8 flex flex-col flex-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">
                  {item.client}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 group-hover:text-cta transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed flex-1">
                  {item.description}
                </p>
              </div>
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
