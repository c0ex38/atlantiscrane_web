"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Save, Check, AlertCircle } from "lucide-react";
import { translations } from "../../lib/site-content";
import { deepMerge } from "../../lib/api";

const localeNames = { tr: "Türkçe", en: "English", ar: "العربية" } as const;

function blankContent(value: any): any {
  if (typeof value === "string") return "";
  if (typeof value === "number") return 0;
  if (Array.isArray(value)) return [];
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, blankContent(child)]));
  return value;
}

export default function SeoAdminPage() {
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
      setSuccess("SEO ayarları başarıyla güncellendi.");
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
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-primary border-t-transparent"></div>
      </div>
    );
  }

  const currentContent = siteContent[activeLang] || {};
  const seo = currentContent.seo || {};

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">SEO ve Meta Ayarları</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Sitenizin arama motorlarındaki görünümünü ve etiketlerini yönetin.</p>
        </div>

        {/* Language Tabs */}
        <div className="flex gap-0.5 bg-muted/50 p-0.5 rounded-lg border border-border/60 self-start sm:self-auto">
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
        <div className="flex items-center gap-3 p-3.5 bg-red-50/80 border border-red-200/70 text-red-700 rounded-xl text-sm font-medium">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-3 p-3.5 bg-green-50/80 border border-green-200/70 text-green-700 rounded-xl text-sm font-medium">
          <Check className="h-5 w-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-0 bg-card border border-border/70 rounded-2xl overflow-hidden shadow-sm">
        
        {/* SEO Section */}
        <div className="p-6 sm:p-8 space-y-5">
          <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.1em] pb-3 border-b border-border/40 mb-1">Arama Motoru (Meta) Bilgileri</h3>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Site Başlığı (Title)</label>
              <input
                type="text"
                required
                value={seo.title || ""}
                onChange={(e) => updateField("seo", "title", e.target.value)}
                placeholder="Örn: Atlantis Crane - Deniz Vinçleri"
                className="w-full px-3 py-2.5 bg-background border border-border/70 outline-none rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
              />
              <p className="text-[10px] text-muted-foreground mt-1">Tarayıcı sekmesinde ve arama sonuçlarında görünen ana başlıktır. (Önerilen: 50-60 karakter)</p>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Site Açıklaması (Meta Description)</label>
              <textarea
                rows={3}
                required
                value={seo.description || ""}
                onChange={(e) => updateField("seo", "description", e.target.value)}
                placeholder="Sitenizin kısa ve özlü bir tanıtımını yapın..."
                className="w-full px-3 py-2.5 bg-background border border-border/70 outline-none rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
              />
              <p className="text-[10px] text-muted-foreground mt-1">Arama sonuçlarında başlığın altında görünen özet metindir. (Önerilen: 150-160 karakter)</p>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Anahtar Kelimeler (Meta Keywords)</label>
              <textarea
                rows={2}
                value={seo.keywords || ""}
                onChange={(e) => updateField("seo", "keywords", e.target.value)}
                placeholder="Örn: vinç, deniz vinci, offshore platform vinci, atlantis crane"
                className="w-full px-3 py-2.5 bg-background border border-border/70 outline-none rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
              />
              <p className="text-[10px] text-muted-foreground mt-1">Kelimeleri virgülle ayırarak yazın.</p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="border-t border-border/50 p-4 sm:p-6 flex justify-end bg-muted/20">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white text-[13px] font-bold rounded-lg shadow-md shadow-primary/20 transition-all active:scale-95"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? "Kaydediliyor..." : "Ayarları Kaydet"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
