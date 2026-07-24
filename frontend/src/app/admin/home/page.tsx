"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Save, Check, AlertCircle } from "lucide-react";
import { translations } from "../../lib/site-content";
import { deepMerge } from "../../lib/api";
import { FileUpload } from "../components/FileUpload";

const localeNames = { tr: "Türkçe", en: "English", ar: "العربية" } as const;

function blankContent(value: any): any {
  if (typeof value === "string") return "";
  if (typeof value === "number") return 0;
  if (Array.isArray(value)) return [];
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, blankContent(child)]));
  return value;
}

export default function HomeAdminPage() {
  const { apiFetch } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [activeLang, setActiveLang] = useState<"tr" | "en" | "ar">("tr");
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
      setSuccess("Anasayfa içerikleri başarıyla güncellendi.");
    } catch (e: any) {
      setError(e.message || "Ayarlar kaydedilemedi.");
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (section: string, field: string, val: any) => {
    setSiteContent((prev) => {
      const copy = structuredClone(prev);
      if (!copy[activeLang][section]) copy[activeLang][section] = {};
      copy[activeLang][section][field] = val;
      return copy;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const currentContent = siteContent[activeLang] || {};
  const hero = currentContent.hero || {};
  const about = currentContent.about || {};
  const history = currentContent.history || {};
  const standards = currentContent.standards || {};
  const exportNetwork = currentContent.exportNetwork || {};

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
        <div>
          <h2 className="text-2xl font-black text-card-foreground tracking-tight">Anasayfa İçerik Yönetimi</h2>
          <p className="text-xs text-muted-foreground mt-1">Anasayfadaki banner, video, yazı ve butonları yönetin.</p>
        </div>

        {/* Language Tabs */}
        <div className="flex gap-1 bg-muted p-0.5 rounded-lg border border-border self-start sm:self-auto">
          {(["tr", "en", "ar"] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setActiveLang(lang)}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all uppercase ${
                activeLang === lang
                  ? "bg-card text-card-foreground shadow-sm"
                  : "text-muted-foreground hover:text-card-foreground"
              }`}
            >
              {localeNames[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
          <Check className="h-5 w-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8 bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
        
        {/* Hero Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-card-foreground uppercase tracking-wider border-b border-[#F2F0EF] pb-2">1. Giriş Alanı (Hero)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <FileUpload
                label="Arka Plan Video Yolu / URL"
                value={hero.videoUrl || ""}
                onChange={(url) => updateField("hero", "videoUrl", url)}
                accept="video/*,image/*"
                placeholder="/hero-loop.mp4"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-2">Etiket (Eyebrow)</label>
              <input
                type="text"
                required
                value={hero.eyebrow || ""}
                onChange={(e) => updateField("hero", "eyebrow", e.target.value)}
                className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-2">Ana Başlık (Vurgu için &lt;span&gt; kullanın)</label>
              <input
                type="text"
                required
                value={hero.title || ""}
                onChange={(e) => updateField("hero", "title", e.target.value)}
                className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-muted-foreground mb-2">Açıklama (Vurgu için &lt;span&gt; kullanın)</label>
              <textarea
                rows={3}
                required
                value={hero.description || ""}
                onChange={(e) => updateField("hero", "description", e.target.value)}
                className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-2">Birincil Buton (CTA 1)</label>
              <input
                type="text"
                required
                value={hero.primaryCta || ""}
                onChange={(e) => updateField("hero", "primaryCta", e.target.value)}
                className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-2">İkincil Buton (CTA 2)</label>
              <input
                type="text"
                required
                value={hero.secondaryCta || ""}
                onChange={(e) => updateField("hero", "secondaryCta", e.target.value)}
                className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="border-t border-[#F2F0EF] pt-6 space-y-4">
          <h3 className="text-sm font-black text-card-foreground uppercase tracking-wider border-b border-[#F2F0EF] pb-2">2. Hakkımızda Önizleme Bölümü</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-2">Küçük Başlık (Eyebrow)</label>
              <input
                type="text"
                required
                value={about.eyebrow || ""}
                onChange={(e) => updateField("about", "eyebrow", e.target.value)}
                className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-2">Bölüm Başlığı (Vurgu için &lt;span&gt; kullanın)</label>
              <input
                type="text"
                required
                value={about.title || ""}
                onChange={(e) => updateField("about", "title", e.target.value)}
                className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-muted-foreground mb-2">Altbaşlık (Vurgulu kısımlar için &lt;span&gt; kullanın)</label>
              <input
                type="text"
                required
                value={about.subtitle || ""}
                onChange={(e) => updateField("about", "subtitle", e.target.value)}
                className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-muted-foreground mb-2">Açıklama Paragrafı (Vurgu için &lt;span&gt; kullanın)</label>
              <textarea
                rows={3}
                required
                value={about.description || ""}
                onChange={(e) => updateField("about", "description", e.target.value)}
                className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-2">Sol Buton Yazısı</label>
              <input
                type="text"
                required
                value={about.primaryBtn || ""}
                onChange={(e) => updateField("about", "primaryBtn", e.target.value)}
                className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-2">Sağ Buton Yazısı</label>
              <input
                type="text"
                required
                value={about.secondaryBtn || ""}
                onChange={(e) => updateField("about", "secondaryBtn", e.target.value)}
                className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm"
              />
            </div>
          </div>
        </div>


        {/* History Section */}
        <div className="border-t border-[#F2F0EF] pt-6 space-y-4">
          <h3 className="text-sm font-black text-card-foreground uppercase tracking-wider border-b border-[#F2F0EF] pb-2">3. Tarihçe (History)</h3>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-2">Küçük Başlık (Eyebrow)</label>
                <input type="text" value={history.eyebrow || ""} onChange={(e) => updateField("history", "eyebrow", e.target.value)} className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-2">Başlık (Title)</label>
                <input type="text" value={history.title || ""} onChange={(e) => updateField("history", "title", e.target.value)} className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm" />
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="block text-xs font-bold text-muted-foreground">Tarihçe Öğeleri (Yıl ve Açıklama)</label>
              {[0, 1, 2, 3, 4, 5, 6].map((idx) => {
                const items = history.items || [];
                const item = items[idx] || {};
                const updateItem = (field: string, val: string) => {
                  const newItems = [...items];
                  newItems[idx] = { ...item, [field]: val };
                  updateField("history", "items", newItems);
                };
                return (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border border-border rounded-xl bg-muted/30">
                    <div className="md:col-span-2">
                      <input placeholder="Yıl" type="text" value={item.year || ""} onChange={(e) => updateItem("year", e.target.value)} className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm" />
                    </div>
                    <div className="md:col-span-4">
                      <input placeholder="Başlık" type="text" value={item.title || ""} onChange={(e) => updateItem("title", e.target.value)} className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm" />
                    </div>
                    <div className="md:col-span-6">
                      <input placeholder="Açıklama" type="text" value={item.description || ""} onChange={(e) => updateItem("description", e.target.value)} className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Standards Section */}
        <div className="border-t border-[#F2F0EF] pt-6 space-y-4">
          <h3 className="text-sm font-black text-card-foreground uppercase tracking-wider border-b border-[#F2F0EF] pb-2">4. Mühendislik Standartları</h3>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-2">Küçük Başlık (Eyebrow)</label>
                <input type="text" value={standards.eyebrow || ""} onChange={(e) => updateField("standards", "eyebrow", e.target.value)} className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-2">Başlık (Title)</label>
                <input type="text" value={standards.title || ""} onChange={(e) => updateField("standards", "title", e.target.value)} className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm" />
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="block text-xs font-bold text-muted-foreground">Standart Öğeleri</label>
              {[0, 1, 2].map((idx) => {
                const items = standards.items || [];
                const item = items[idx] || {};
                const updateItem = (field: string, val: string) => {
                  const newItems = [...items];
                  newItems[idx] = { ...item, [field]: val };
                  updateField("standards", "items", newItems);
                };
                return (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-border rounded-xl bg-muted/30">
                    <div>
                      <input placeholder="Başlık" type="text" value={item.title || ""} onChange={(e) => updateItem("title", e.target.value)} className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm" />
                    </div>
                    <div>
                      <input placeholder="Açıklama" type="text" value={item.description || ""} onChange={(e) => updateItem("description", e.target.value)} className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Export Network Section */}
        <div className="border-t border-[#F2F0EF] pt-6 space-y-4">
          <h3 className="text-sm font-black text-card-foreground uppercase tracking-wider border-b border-[#F2F0EF] pb-2">5. İhracat Ağı</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-2">Küçük Başlık</label>
              <input type="text" value={exportNetwork.eyebrow || ""} onChange={(e) => updateField("exportNetwork", "eyebrow", e.target.value)} className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-2">Başlık</label>
              <input type="text" value={exportNetwork.title || ""} onChange={(e) => updateField("exportNetwork", "title", e.target.value)} className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-2">Alt Başlık (Subtitle)</label>
              <input type="text" value={exportNetwork.subtitle || ""} onChange={(e) => updateField("exportNetwork", "subtitle", e.target.value)} className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-2">Liste Başlığı</label>
              <input type="text" value={exportNetwork.listTitle || ""} onChange={(e) => updateField("exportNetwork", "listTitle", e.target.value)} className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-2">Vinç Etiketi (örn: Vinç)</label>
              <input type="text" value={exportNetwork.craneLabel || ""} onChange={(e) => updateField("exportNetwork", "craneLabel", e.target.value)} className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-2">Aktif Operasyon Etiketi</label>
              <input type="text" value={exportNetwork.activeOperation || ""} onChange={(e) => updateField("exportNetwork", "activeOperation", e.target.value)} className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm" />
            </div>
            
            <div className="md:col-span-2 space-y-4">
              <label className="block text-xs font-bold text-muted-foreground">Ülke Listesi (En fazla 7 adet önerilir)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[0, 1, 2, 3, 4, 5, 6].map((idx) => {
                  const items = exportNetwork.items || [];
                  const item = items[idx] || {};
                  const updateItem = (field: string, val: any) => {
                    const newItems = [...items];
                    newItems[idx] = { ...item, [field]: val };
                    updateField("exportNetwork", "items", newItems);
                  };
                  return (
                    <div key={idx} className="flex gap-2 p-3 border border-border rounded-xl bg-muted/30">
                      <input placeholder="Ülke Adı" type="text" value={item.country || ""} onChange={(e) => updateItem("country", e.target.value)} className="w-2/3 px-3 py-2 border border-border outline-none rounded-lg text-sm" />
                      <input placeholder="Sayı" type="number" value={item.count || ""} onChange={(e) => updateItem("count", parseInt(e.target.value) || 0)} className="w-1/3 px-3 py-2 border border-border outline-none rounded-lg text-sm" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="border-t border-[#F2F0EF] pt-6 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 disabled:bg-gray-400 text-white text-sm font-bold rounded-lg shadow-lg shadow-primary/15 transition-all"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? "Kaydediliyor..." : "İçerikleri Kaydet"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
