import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Building2, Tag, MapPin } from "lucide-react";
import { isLocale, type Locale } from "../../../lib/site-content";
import CtaSection from "../../../components/cta-section";
import { getSiteDictionary } from "../../../lib/api";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:7501/api/v1";

async function getProjectById(id: string) {
  try {
    const res = await fetch(`${API_URL}/projects`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json() as { data: any[] };
    return json.data?.find((p: any) => p.id === id) || null;
  } catch {
    return null;
  }
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { locale, id } = await params;

  if (!isLocale(locale)) notFound();

  const currentLocale = locale as Locale;
  const isRtl = currentLocale === "ar";

  const [project, t] = await Promise.all([
    getProjectById(id),
    getSiteDictionary(currentLocale),
  ]);

  if (!project) notFound();

  const title = project.title?.[currentLocale] || project.title?.tr || project.title?.en || "";
  const client = project.client?.[currentLocale] || project.client?.tr || project.client?.en || "";
  const category = project.category?.[currentLocale] || project.category?.tr || project.category?.en || "";
  const description = project.description?.[currentLocale] || project.description?.tr || project.description?.en || "";
  const image = project.image || "/about-facility.png";

  const backLabel = currentLocale === "tr" ? "Projelere Dön" : currentLocale === "ar" ? "العودة إلى المشاريع" : "Back to Projects";
  const clientLabel = currentLocale === "tr" ? "Müşteri" : currentLocale === "ar" ? "العميل" : "Client";
  const categoryLabel = currentLocale === "tr" ? "Kategori" : currentLocale === "ar" ? "الفئة" : "Category";

  return (
    <main className="min-h-screen bg-[#070b14] text-white -mt-24 pt-24" dir={isRtl ? "rtl" : "ltr"}>
      {/* Background glows */}
      <div className="fixed top-0 right-0 w-[700px] h-[700px] bg-blue-950/15 rounded-full blur-[180px] pointer-events-none -z-0" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-cta/5 rounded-full blur-[180px] pointer-events-none -z-0" />

      {/* Hero Image — Full Width */}
      <div className="relative w-full aspect-[21/8] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-[#070b14]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070b14]/70 via-transparent to-transparent" />
      </div>

      <div className="container-shell relative z-10 px-4 md:px-8 -mt-32">
        {/* Back button */}
        <Link
          href={`/${currentLocale}/projects`}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-semibold mb-10 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {backLabel}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-24">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Badges */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-cta text-slate-950 rounded-full">
                {category}
              </span>
            </div>

            {/* Title */}
            <h1
              className="font-black tracking-tight leading-[0.95] text-white mb-8"
              style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
            >
              {title}
            </h1>

            {/* Description */}
            <div className="prose prose-invert prose-lg max-w-none">
              <p className="text-slate-300 text-base md:text-lg leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-8 space-y-6 sticky top-32">
              {/* Client */}
              {client && (
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-bold uppercase tracking-widest mb-2">
                    <Building2 className="w-3.5 h-3.5" />
                    {clientLabel}
                  </div>
                  <p className="text-white font-bold text-base">{client}</p>
                </div>
              )}

              {/* Category */}
              {category && (
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-bold uppercase tracking-widest mb-2">
                    <Tag className="w-3.5 h-3.5" />
                    {categoryLabel}
                  </div>
                  <p className="text-white font-semibold text-base">{category}</p>
                </div>
              )}

              <div className="border-t border-white/10 pt-6">
                <Link
                  href={`/${currentLocale}/contact`}
                  className="block w-full text-center bg-cta text-slate-950 font-black text-sm uppercase tracking-widest py-4 px-6 rounded-xl hover:bg-cta/90 transition-colors duration-300"
                >
                  {currentLocale === "tr" ? "Teklif Al" : currentLocale === "ar" ? "احصل على عرض" : "Get a Quote"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CtaSection locale={currentLocale} />
    </main>
  );
}
