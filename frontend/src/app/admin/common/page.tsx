"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Info } from "lucide-react";
import { translations } from "../../lib/site-content";
import { deepMerge } from "../../lib/api";
import { AdminSectionTabs } from "../components/AdminSectionTabs";
import { AdminLanguageTabs, AdminLoadingState, AdminNotice, AdminPageHeader, AdminPageShell, AdminSaveBar } from "../components/AdminUI";
type CommonSection = "terms" | "notFound" | "footer";
const commonTabs = [
  { id: "terms", label: "Ortak Terimler", description: "Ürün sayfaları ve ana sayfa haritasında tekrar kullanılan genel metinleri yönetin." },
  { id: "notFound", label: "404 Sayfası", description: "Bulunamayan adreslerde gösterilen hata sayfasının metinlerini düzenleyin." },
  { id: "footer", label: "Alt Bilgi", description: "Tüm sayfaların en altındaki şirket tanıtımı ve telif metinlerini yönetin." },
] as const;

function UsageNote({ children, unused = false }: { children: React.ReactNode; unused?: boolean }) {
  return (
    <p className={`mt-1.5 text-[11px] leading-relaxed ${unused ? "font-semibold text-amber-700" : "text-muted-foreground/75"}`}>
      <span className="font-bold">{unused ? "Durum:" : "Sitede görünür:"}</span> {children}
    </p>
  );
}

function SectionUsage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-blue-200/70 bg-blue-50/70 px-4 py-3 text-xs leading-relaxed text-blue-800">
      <Info className="mt-0.5 h-4 w-4 shrink-0" />
      <span><strong>Bu bölüm nerede değişir?</strong> {children}</span>
    </div>
  );
}

function blankContent(value: any): any {
  if (typeof value === "string") return "";
  if (typeof value === "number") return 0;
  if (Array.isArray(value)) return [];
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, blankContent(child)]));
  return value;
}

export default function CommonAdminPage() {
  const { apiFetch } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [activeLang, setActiveLang] = useState<"tr" | "en" | "ar">("tr");
  const [activeSection, setActiveSection] = useState<CommonSection>("terms");
  const [siteContent, setSiteContent] = useState<Record<string, any>>({
    tr: blankContent(translations.tr),
    en: blankContent(translations.en),
    ar: blankContent(translations.ar)
  });

  useEffect(() => {
    fetchSettings();
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
    } catch (e: any) {
      setError(e.message || "Ayarlar yüklenirken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSaving(true);

    // Fetch current backend state and merge to avoid wiping other admin pages' data
    let mergedContent = structuredClone(siteContent);
    try {
      const currentRes = await apiFetch("/settings") as { data: Record<string, any> };
      const currentSiteContent = currentRes?.data?.site_content;
      if (currentSiteContent && typeof currentSiteContent === "object") {
        // Merge: backend is base, our edits override
        mergedContent = {
          tr: { ...currentSiteContent.tr, ...siteContent.tr },
          en: { ...currentSiteContent.en, ...siteContent.en },
          ar: { ...currentSiteContent.ar, ...siteContent.ar },
        };
      }
    } catch { /* continue with local state */ }

    const payload = {
      settings: {
        site_content: mergedContent,
      }
    };

    try {
      await apiFetch("/settings", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setSuccess("Ortak metinler başarıyla güncellendi.");
    } catch (e: any) {
      setError(e.message || "Ayarlar kaydedilemedi.");
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (section: string, field: string, val: string) => {
    setSiteContent((prev) => {
      const copy = structuredClone(prev);
      if (!copy[activeLang][section]) copy[activeLang][section] = {};
      copy[activeLang][section][field] = val;
      return copy;
    });
  };

  if (isLoading) {
    return <AdminLoadingState label="Ortak metinler yükleniyor..." />;
  }

  const currentContent = siteContent[activeLang] || {};
  const common = currentContent.common || {};
  const notFound = currentContent.notFound || {};
  const footer = currentContent.footer || {};

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Ortak Metinler Yönetimi"
        description="Sistemdeki genel buton, sayfa isimleri ve 404 gibi alanları yönetin."
        actions={<AdminLanguageTabs value={activeLang} onChange={setActiveLang} />}
      />

      {/* Notifications */}
      {error && <AdminNotice type="error">{error}</AdminNotice>}
      {success && <AdminNotice type="success">{success}</AdminNotice>}

      <AdminSectionTabs tabs={commonTabs} activeTab={activeSection} onChange={setActiveSection} />

      <form onSubmit={handleSave} className="space-y-0 bg-card border border-border/70 rounded-2xl overflow-hidden shadow-sm">
        
        {/* Ortak Terimler */}
        {activeSection === "terms" && <div className="p-6 sm:p-8 space-y-5">
          <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.1em] pb-3 border-b border-border/40 mb-1">1. Ortak Terimler</h3>
          <SectionUsage>
            Ürün listeleme ve ürün detay ekranlarındaki bilgi etiketleri ile ana sayfadaki ihracat haritası açıklamasını etkiler.
          </SectionUsage>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Kapasite</label>
              <input
                type="text"
                value={common.capacity || ""}
                onChange={(e) => updateField("common", "capacity", e.target.value)}
                className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-sm text-card-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                placeholder="Örn: Kapasite"
              />
              <UsageNote>Ürün listeleme kartları ve ürün detay sayfasının üst bilgi alanı.</UsageNote>
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Erişim (Outreach)</label>
              <input
                type="text"
                value={common.outreach || ""}
                onChange={(e) => updateField("common", "outreach", e.target.value)}
                className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-sm text-card-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                placeholder="Örn: Erişim"
              />
              <UsageNote>Ürün listeleme kartları ve ürün detay sayfasının üst bilgi alanı.</UsageNote>
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Detaylı İncele (Buton)</label>
              <input
                type="text"
                value={common.viewDetails || ""}
                onChange={(e) => updateField("common", "viewDetails", e.target.value)}
                className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-sm text-card-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                placeholder="Örn: Detaylı İncele"
              />
              <UsageNote>Ürünler sayfasındaki ürün kartlarının yönlendirme butonu.</UsageNote>
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Harita Etkileşim Yazısı</label>
              <input
                type="text"
                value={common.mapInstruction || ""}
                onChange={(e) => updateField("common", "mapInstruction", e.target.value)}
                className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-sm text-card-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                placeholder="Örn: Detaylar için haritada bir ülkeye tıklayın"
              />
              <UsageNote>Ana sayfadaki İhracat Ağı haritasının altındaki kullanım açıklaması.</UsageNote>
            </div>
          </div>
        </div>}

        {/* 404 Hata Sayfası */}
        {activeSection === "notFound" && <div className="p-6 sm:p-8 space-y-5">
          <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.1em] pb-3 border-b border-border/40 mb-1">2. 404 Hata Sayfası</h3>
          <SectionUsage>
            Ziyaretçi sitede bulunmayan veya silinmiş bir adrese gittiğinde açılan 404 hata ekranını etkiler.
          </SectionUsage>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Sayfa Başlığı</label>
              <input
                type="text"
                value={notFound.title || ""}
                onChange={(e) => updateField("notFound", "title", e.target.value)}
                className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-sm text-card-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                placeholder="Örn: Kayıp mı Oldunuz?"
              />
              <UsageNote>404 ekranındaki ana başlık.</UsageNote>
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Açıklama Metni</label>
              <textarea
                value={notFound.description || ""}
                onChange={(e) => updateField("notFound", "description", e.target.value)}
                className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-sm text-card-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors min-h-[80px]"
                placeholder="Örn: Aradığınız sayfa derin sulara gömülmüş..."
              />
              <UsageNote>404 ekranında başlığın altında yer alan açıklama.</UsageNote>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Ana Sayfaya Dön Butonu</label>
                <input
                  type="text"
                  value={notFound.goHome || ""}
                  onChange={(e) => updateField("notFound", "goHome", e.target.value)}
                  className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-sm text-card-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="Örn: Ana Sayfaya Dön"
                />
                <UsageNote>404 ekranındaki ana sayfaya yönlendiren birincil buton.</UsageNote>
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Ürünleri İncele Butonu</label>
                <input
                  type="text"
                  value={notFound.viewProducts || ""}
                  onChange={(e) => updateField("notFound", "viewProducts", e.target.value)}
                  className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-sm text-card-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="Örn: Ürünlerimizi İnceleyin"
                />
                <UsageNote>404 ekranındaki ürünler sayfasına yönlendiren ikincil buton.</UsageNote>
              </div>
            </div>
          </div>
        </div>}


        {/* Footer */}
        {activeSection === "footer" && <div className="p-6 sm:p-8 space-y-5">
          <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.1em] pb-3 border-b border-border/40 mb-1">3. Footer (Alt Bilgi)</h3>
          <SectionUsage>
            Bu alanlar sitenin tüm sayfalarının en altındaki koyu renkli Alt Bilgi bölümünü etkiler.
          </SectionUsage>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Şirket Açıklaması</label>
              <textarea
                value={footer.description || ""}
                onChange={(e) => updateField("footer", "description", e.target.value)}
                className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-sm text-card-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors min-h-[80px]"
              />
              <UsageNote>Alt Bilgi alanının sol sütununda, logonun altında.</UsageNote>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Hızlı Bağlantılar Başlığı</label>
                <input type="text" value={footer.quickLinks || ""} onChange={(e) => updateField("footer", "quickLinks", e.target.value)} className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-sm" />
                <UsageNote>Alt Bilgi alanının orta sütunundaki bağlantı listesinin başlığı.</UsageNote>
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Tasarım Tarafından (Örn: Designed by)</label>
                <input type="text" value={footer.designedBy || ""} onChange={(e) => updateField("footer", "designedBy", e.target.value)} className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-sm" />
                <UsageNote>Alt Bilgi alanının en altındaki tasarım ajansı ifadesi.</UsageNote>
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Tüm Hakları Saklıdır</label>
                <input type="text" value={footer.allRightsReserved || ""} onChange={(e) => updateField("footer", "allRightsReserved", e.target.value)} className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-sm" />
                <UsageNote>Alt Bilgi alanının en altındaki telif satırının başlangıcı.</UsageNote>
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Haklar</label>
                <input type="text" value={footer.rights || ""} onChange={(e) => updateField("footer", "rights", e.target.value)} className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-sm" />
                <UsageNote unused>Bu alan mevcut site arayüzünde kullanılmıyor; değiştirilmesi görünür bir alanı etkilemez.</UsageNote>
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Çok Dilli (Multilingual)</label>
                <input type="text" value={footer.multilingual || ""} onChange={(e) => updateField("footer", "multilingual", e.target.value)} className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-sm" />
                <UsageNote unused>Bu alan mevcut site arayüzünde kullanılmıyor; dil adı sistem tarafından otomatik gösteriliyor.</UsageNote>
              </div>
            </div>
          </div>
        </div>}

        <AdminSaveBar isSaving={isSaving} />
      </form>
    </AdminPageShell>
  );
}
