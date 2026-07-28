"use client";

import React, { useEffect, useState } from "react";
import { Globe2, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { translations } from "../../lib/site-content";
import { deepMerge } from "../../lib/api";
import { AdminSectionTabs } from "../components/AdminSectionTabs";
import { FileUpload } from "../components/FileUpload";
import { AdminLanguageTabs, AdminLoadingState, AdminNotice, AdminPageHeader, AdminPageShell, AdminSaveBar } from "../components/AdminUI";

type LocaleCode = "tr" | "en" | "ar";
type SeoSection = "general" | "pages" | "social" | "technical";
type SeoPageKey = "home" | "about" | "products" | "projects" | "references" | "contact";

const seoTabs = [
  { id: "general", label: "Genel SEO", description: "Site genelinde kullanılan başlık, açıklama ve marka bilgilerini düzenleyin." },
  { id: "pages", label: "Sayfa Bazlı", description: "Her ana sayfa için farklı arama sonucu başlığı ve açıklaması tanımlayın." },
  { id: "social", label: "Sosyal Paylaşım", description: "WhatsApp, LinkedIn, Facebook ve X paylaşımlarında oluşan kartı yönetin." },
  { id: "technical", label: "Teknik SEO", description: "Canonical adres, indeksleme, sitemap ve arama motoru doğrulamalarını yönetin." },
] as const;

const pageOptions: { id: SeoPageKey; label: string; path: string }[] = [
  { id: "home", label: "Ana Sayfa", path: "/{dil}" },
  { id: "about", label: "Hakkımızda", path: "/{dil}/about" },
  { id: "products", label: "Ürünler", path: "/{dil}/products" },
  { id: "projects", label: "Projeler", path: "/{dil}/projects" },
  { id: "references", label: "Referanslar", path: "/{dil}/references" },
  { id: "contact", label: "İletişim", path: "/{dil}/contact" },
];

const defaultGlobalSeo = {
  siteUrl: "https://www.atlantiscrane.com",
  defaultLocale: "tr" as LocaleCode,
  robotsIndex: true,
  robotsFollow: true,
  sitemapEnabled: true,
  googleVerification: "",
  yandexVerification: "",
  bingVerification: "",
};

function blankContent(value: any): any {
  if (typeof value === "string") return "";
  if (typeof value === "number") return 0;
  if (Array.isArray(value)) return [];
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, blankContent(child)]),
    );
  }
  return value;
}

function CharacterCount({ value, recommended }: { value: string; recommended: [number, number] }) {
  const length = value.length;
  const isIdeal = length >= recommended[0] && length <= recommended[1];
  return (
    <span className={`text-[10px] font-semibold ${isIdeal ? "text-green-600" : "text-muted-foreground"}`}>
      {length} karakter · önerilen {recommended[0]}–{recommended[1]}
    </span>
  );
}

export default function SeoAdminPage() {
  const { apiFetch } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeLang, setActiveLang] = useState<LocaleCode>("tr");
  const [activeSection, setActiveSection] = useState<SeoSection>("general");
  const [activePage, setActivePage] = useState<SeoPageKey>("home");
  const [seoGlobal, setSeoGlobal] = useState(defaultGlobalSeo);
  const [siteContent, setSiteContent] = useState<Record<LocaleCode, any>>({
    tr: blankContent(translations.tr),
    en: blankContent(translations.en),
    ar: blankContent(translations.ar),
  });

  useEffect(() => {
    void fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await apiFetch("/settings") as { data: Record<string, any> };
      const data = res.data;
      if (data.site_content) {
        setSiteContent({
          tr: deepMerge(blankContent(translations.tr), data.site_content.tr || {}),
          en: deepMerge(blankContent(translations.en), data.site_content.en || {}),
          ar: deepMerge(blankContent(translations.ar), data.site_content.ar || {}),
        });
      }
      if (data.seo_global) {
        setSeoGlobal({ ...defaultGlobalSeo, ...data.seo_global });
      }
    } catch (caughtError: any) {
      setError(caughtError.message || "SEO ayarları yüklenirken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSaving(true);

    let mergedContent = structuredClone(siteContent);
    try {
      const currentRes = await apiFetch("/settings") as { data: Record<string, any> };
      const currentSiteContent = currentRes?.data?.site_content;
      if (currentSiteContent && typeof currentSiteContent === "object") {
        mergedContent = {
          tr: { ...currentSiteContent.tr, ...siteContent.tr },
          en: { ...currentSiteContent.en, ...siteContent.en },
          ar: { ...currentSiteContent.ar, ...siteContent.ar },
        };
      }
    } catch {
      // Local state remains a safe fallback when the preliminary merge request fails.
    }

    try {
      await apiFetch("/settings", {
        method: "POST",
        body: JSON.stringify({
          settings: {
            site_content: mergedContent,
            seo_global: seoGlobal,
          },
        }),
      });
      setSuccess("SEO ayarları frontend’e uygulanmak üzere başarıyla güncellendi.");
    } catch (caughtError: any) {
      setError(caughtError.message || "SEO ayarları kaydedilemedi.");
    } finally {
      setIsSaving(false);
    }
  };

  const updateSeo = (updater: (seo: Record<string, any>) => void) => {
    setSiteContent((previous) => {
      const copy = structuredClone(previous);
      if (!copy[activeLang].seo) copy[activeLang].seo = {};
      updater(copy[activeLang].seo);
      return copy;
    });
  };

  const updateSeoField = (field: string, value: unknown) => {
    updateSeo((seo) => {
      seo[field] = value;
    });
  };

  const updateSocialField = (group: "openGraph" | "twitter", field: string, value: unknown) => {
    updateSeo((seo) => {
      if (!seo[group]) seo[group] = {};
      seo[group][field] = value;
    });
  };

  const updatePageField = (field: string, value: unknown) => {
    updateSeo((seo) => {
      if (!seo.pages) seo.pages = {};
      if (!seo.pages[activePage]) seo.pages[activePage] = {};
      seo.pages[activePage][field] = value;
    });
  };

  if (isLoading) {
    return <AdminLoadingState label="SEO ayarları yükleniyor..." />;
  }

  const seo = siteContent[activeLang]?.seo || {};
  const pageSeo = seo.pages?.[activePage] || {};
  const openGraph = seo.openGraph || {};
  const twitter = seo.twitter || {};
  const previewTitle = pageSeo.title || seo.title || "Atlantis Crane";
  const previewDescription = pageSeo.description || seo.description || "Arama sonuçlarında gösterilecek açıklama.";

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="SEO ve Meta Ayarları"
        description="Arama motoru, sosyal paylaşım ve indeksleme ayarlarını frontend ile birlikte yönetin."
        actions={<AdminLanguageTabs value={activeLang} onChange={setActiveLang} />}
      />

      {error && <AdminNotice type="error">{error}</AdminNotice>}
      {success && <AdminNotice type="success">{success}</AdminNotice>}

      <AdminSectionTabs tabs={seoTabs} activeTab={activeSection} onChange={setActiveSection} />

      <form onSubmit={handleSave} className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
        {activeSection === "general" && (
          <div className="space-y-6 p-6 sm:p-8">
            <h3 className="border-b border-border/40 pb-3 text-[11px] font-black uppercase tracking-[0.1em] text-muted-foreground">
              Genel Arama Motoru Bilgileri
            </h3>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Varsayılan Site Başlığı</label>
                  <CharacterCount value={seo.title || ""} recommended={[50, 60]} />
                </div>
                <input
                  type="text"
                  required
                  value={seo.title || ""}
                  onChange={(event) => updateSeoField("title", event.target.value)}
                  placeholder="Atlantis Crane | Marine Crane Solutions"
                  className="w-full rounded-lg border border-border/70 bg-background px-3 py-2.5 text-sm outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Sayfa Başlığı Şablonu</label>
                <input
                  type="text"
                  value={seo.titleTemplate || ""}
                  onChange={(event) => updateSeoField("titleTemplate", event.target.value)}
                  placeholder="%s | Atlantis Crane"
                  className="w-full rounded-lg border border-border/70 bg-background px-3 py-2.5 text-sm outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                />
                <p className="mt-1 text-[10px] text-muted-foreground">%s yerine sayfa başlığı otomatik gelir. Örnek: Ürünler | Atlantis Crane</p>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Varsayılan Meta Açıklaması</label>
                  <CharacterCount value={seo.description || ""} recommended={[140, 160]} />
                </div>
                <textarea
                  rows={4}
                  required
                  value={seo.description || ""}
                  onChange={(event) => updateSeoField("description", event.target.value)}
                  placeholder="Atlantis Crane’in ürünlerini ve mühendislik çözümlerini kısa biçimde anlatın."
                  className="w-full rounded-lg border border-border/70 bg-background px-3 py-2.5 text-sm outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Anahtar Kelimeler</label>
                <textarea
                  rows={2}
                  value={seo.keywords || ""}
                  onChange={(event) => updateSeoField("keywords", event.target.value)}
                  placeholder="marine crane, offshore crane, ship crane, Atlantis Crane"
                  className="w-full rounded-lg border border-border/70 bg-background px-3 py-2.5 text-sm outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                />
                <p className="mt-1 text-[10px] text-muted-foreground">Kelimeleri virgülle ayırın. Başlık ve açıklamada doğal biçimde kullanılan kelimelere öncelik verin.</p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">İçerik Yazarı / Kuruluş</label>
                  <input type="text" value={seo.author || ""} onChange={(event) => updateSeoField("author", event.target.value)} className="w-full rounded-lg border border-border/70 bg-background px-3 py-2.5 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10" />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Yayıncı</label>
                  <input type="text" value={seo.publisher || ""} onChange={(event) => updateSeoField("publisher", event.target.value)} className="w-full rounded-lg border border-border/70 bg-background px-3 py-2.5 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10" />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-xs font-bold text-muted-foreground">
                <Search className="h-4 w-4" /> Google Önizlemesi
              </div>
              <p className="truncate text-sm text-green-700">{seoGlobal.siteUrl}/{activeLang}</p>
              <p className="mt-1 text-xl font-medium text-[#1a0dab]">{seo.title || "Atlantis Crane"}</p>
              <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-600">{seo.description || "Meta açıklaması burada görünecek."}</p>
            </div>
          </div>
        )}

        {activeSection === "pages" && (
          <div className="space-y-6 p-6 sm:p-8">
            <h3 className="border-b border-border/40 pb-3 text-[11px] font-black uppercase tracking-[0.1em] text-muted-foreground">
              Sayfa Bazlı SEO
            </h3>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {pageOptions.map((page) => (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => setActivePage(page.id)}
                  className={`min-w-max rounded-lg border px-3 py-2 text-xs font-bold transition-colors ${
                    activePage === page.id
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {page.label}
                </button>
              ))}
            </div>

            <div className="rounded-xl border border-border/60 bg-muted/20 p-4 text-xs text-muted-foreground">
              <strong className="text-foreground">Adres:</strong>{" "}
              {pageOptions.find((page) => page.id === activePage)?.path}
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Sayfa SEO Başlığı</label>
                <CharacterCount value={pageSeo.title || ""} recommended={[45, 60]} />
              </div>
              <input
                type="text"
                value={pageSeo.title || ""}
                onChange={(event) => updatePageField("title", event.target.value)}
                placeholder={seo.title || "Varsayılan site başlığı kullanılır"}
                className="w-full rounded-lg border border-border/70 bg-background px-3 py-2.5 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Sayfa Meta Açıklaması</label>
                <CharacterCount value={pageSeo.description || ""} recommended={[140, 160]} />
              </div>
              <textarea
                rows={4}
                value={pageSeo.description || ""}
                onChange={(event) => updatePageField("description", event.target.value)}
                placeholder={seo.description || "Varsayılan meta açıklaması kullanılır"}
                className="w-full rounded-lg border border-border/70 bg-background px-3 py-2.5 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Sayfaya Özel Anahtar Kelimeler</label>
              <input
                type="text"
                value={pageSeo.keywords || ""}
                onChange={(event) => updatePageField("keywords", event.target.value)}
                placeholder="Virgülle ayrılmış anahtar kelimeler"
                className="w-full rounded-lg border border-border/70 bg-background px-3 py-2.5 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <label className="flex items-start gap-3 rounded-xl border border-border bg-muted/20 p-4">
              <input
                type="checkbox"
                checked={pageSeo.index !== false}
                onChange={(event) => updatePageField("index", event.target.checked)}
                className="mt-0.5 h-4 w-4 accent-primary"
              />
              <span>
                <span className="block text-sm font-bold text-foreground">Arama motorlarında indekslensin</span>
                <span className="mt-1 block text-xs text-muted-foreground">Kapatıldığında bu sayfa noindex olarak işaretlenir ve sitemap dışında bırakılır.</span>
              </span>
            </label>

            <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
              <p className="text-sm text-green-700">{seoGlobal.siteUrl}/{activeLang}/{activePage === "home" ? "" : activePage}</p>
              <p className="mt-1 text-xl font-medium text-[#1a0dab]">{previewTitle}</p>
              <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-600">{previewDescription}</p>
            </div>
          </div>
        )}

        {activeSection === "social" && (
          <div className="space-y-6 p-6 sm:p-8">
            <h3 className="border-b border-border/40 pb-3 text-[11px] font-black uppercase tracking-[0.1em] text-muted-foreground">
              Sosyal Paylaşım Kartları
            </h3>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Open Graph Başlığı</label>
                <input type="text" value={openGraph.title || ""} onChange={(event) => updateSocialField("openGraph", "title", event.target.value)} placeholder={seo.title || "Varsayılan SEO başlığı"} className="w-full rounded-lg border border-border/70 bg-background px-3 py-2.5 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10" />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">X Kart Tipi</label>
                <select value={twitter.card || "summary_large_image"} onChange={(event) => updateSocialField("twitter", "card", event.target.value)} className="w-full rounded-lg border border-border/70 bg-background px-3 py-2.5 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10">
                  <option value="summary_large_image">Büyük görselli kart</option>
                  <option value="summary">Küçük görselli özet</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Open Graph Açıklaması</label>
                <textarea rows={3} value={openGraph.description || ""} onChange={(event) => updateSocialField("openGraph", "description", event.target.value)} placeholder={seo.description || "Varsayılan meta açıklaması"} className="w-full rounded-lg border border-border/70 bg-background px-3 py-2.5 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10" />
              </div>
              <div className="md:col-span-2">
                <FileUpload label="Open Graph Paylaşım Görseli (önerilen 1200×630)" value={openGraph.image || ""} onChange={(value) => updateSocialField("openGraph", "image", value)} accept="image/*" placeholder="/og-image.jpg" />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">X Başlığı</label>
                <input type="text" value={twitter.title || ""} onChange={(event) => updateSocialField("twitter", "title", event.target.value)} placeholder={openGraph.title || seo.title || "Varsayılan başlık"} className="w-full rounded-lg border border-border/70 bg-background px-3 py-2.5 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10" />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">X Açıklaması</label>
                <input type="text" value={twitter.description || ""} onChange={(event) => updateSocialField("twitter", "description", event.target.value)} placeholder={openGraph.description || seo.description || "Varsayılan açıklama"} className="w-full rounded-lg border border-border/70 bg-background px-3 py-2.5 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10" />
              </div>
              <div className="md:col-span-2">
                <FileUpload label="X Paylaşım Görseli (boşsa Open Graph görseli kullanılır)" value={twitter.image || ""} onChange={(value) => updateSocialField("twitter", "image", value)} accept="image/*" placeholder="/twitter-card.jpg" />
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
              {openGraph.image ? (
                <div className="aspect-[1.91/1] w-full bg-cover bg-center" style={{ backgroundImage: `url("${openGraph.image}")` }} />
              ) : (
                <div className="flex aspect-[1.91/1] w-full items-center justify-center bg-slate-100 text-sm text-slate-400">Paylaşım görseli seçilmedi</div>
              )}
              <div className="p-4">
                <p className="text-[10px] uppercase tracking-widest text-slate-400">{seoGlobal.siteUrl}</p>
                <p className="mt-1 font-bold text-slate-900">{openGraph.title || seo.title || "Atlantis Crane"}</p>
                <p className="mt-1 text-sm text-slate-500">{openGraph.description || seo.description || "Sosyal paylaşım açıklaması"}</p>
              </div>
            </div>
          </div>
        )}

        {activeSection === "technical" && (
          <div className="space-y-6 p-6 sm:p-8">
            <h3 className="border-b border-border/40 pb-3 text-[11px] font-black uppercase tracking-[0.1em] text-muted-foreground">
              Teknik SEO ve İndeksleme
            </h3>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Canlı Site Adresi</label>
              <div className="relative">
                <Globe2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="url"
                  value={seoGlobal.siteUrl}
                  onChange={(event) => setSeoGlobal({ ...seoGlobal, siteUrl: event.target.value })}
                  placeholder="https://www.atlantiscrane.com"
                  className="w-full rounded-lg border border-border/70 bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                />
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground">Canonical adresler, sitemap ve sosyal paylaşım bağlantıları bu alanı kullanır.</p>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Varsayılan Dil</label>
              <select value={seoGlobal.defaultLocale} onChange={(event) => setSeoGlobal({ ...seoGlobal, defaultLocale: event.target.value as LocaleCode })} className="w-full rounded-lg border border-border/70 bg-background px-3 py-2.5 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10">
                <option value="tr">Türkçe</option>
                <option value="en">ENGLISH</option>
                <option value="ar">العربية</option>
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                { key: "robotsIndex", title: "İndekslemeye izin ver", description: "Arama motorları sayfaları sonuçlara ekleyebilir." },
                { key: "robotsFollow", title: "Bağlantıları takip et", description: "Arama motorları sayfalardaki bağlantıları izleyebilir." },
                { key: "sitemapEnabled", title: "Sitemap yayınla", description: "Aktif sayfalar sitemap.xml içinde listelenir." },
              ].map((option) => (
                <label key={option.key} className="flex items-start gap-3 rounded-xl border border-border bg-muted/20 p-4">
                  <input
                    type="checkbox"
                    checked={seoGlobal[option.key as keyof typeof seoGlobal] !== false}
                    onChange={(event) => setSeoGlobal({ ...seoGlobal, [option.key]: event.target.checked })}
                    className="mt-0.5 h-4 w-4 accent-primary"
                  />
                  <span>
                    <span className="block text-sm font-bold text-foreground">{option.title}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{option.description}</span>
                  </span>
                </label>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Google Doğrulama Kodu</label>
                <input type="text" value={seoGlobal.googleVerification} onChange={(event) => setSeoGlobal({ ...seoGlobal, googleVerification: event.target.value })} placeholder="Meta etiketindeki content değeri" className="w-full rounded-lg border border-border/70 bg-background px-3 py-2.5 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10" />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Bing Doğrulama Kodu</label>
                <input type="text" value={seoGlobal.bingVerification} onChange={(event) => setSeoGlobal({ ...seoGlobal, bingVerification: event.target.value })} placeholder="msvalidate.01 değeri" className="w-full rounded-lg border border-border/70 bg-background px-3 py-2.5 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10" />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Yandex Doğrulama Kodu</label>
                <input type="text" value={seoGlobal.yandexVerification} onChange={(event) => setSeoGlobal({ ...seoGlobal, yandexVerification: event.target.value })} placeholder="yandex-verification değeri" className="w-full rounded-lg border border-border/70 bg-background px-3 py-2.5 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10" />
              </div>
            </div>
          </div>
        )}

        <AdminSaveBar isSaving={isSaving} label="SEO Ayarlarını Kaydet" />
      </form>
    </AdminPageShell>
  );
}
