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

    const payload = {
      settings: {
        site_content: siteContent,
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
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const currentContent = siteContent[activeLang] || {};
  const seo = currentContent.seo || {};

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
        <div>
          <h2 className="text-2xl font-black text-card-foreground tracking-tight">SEO ve Meta Ayarları</h2>
          <p className="text-xs text-muted-foreground mt-1">Sitenizin arama motorlarındaki görünümünü ve etiketlerini yönetin.</p>
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
        
        {/* SEO Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-card-foreground uppercase tracking-wider border-b border-[#F2F0EF] pb-2">Arama Motoru (Meta) Bilgileri</h3>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-2">Site Başlığı (Title)</label>
              <input
                type="text"
                required
                value={seo.title || ""}
                onChange={(e) => updateField("seo", "title", e.target.value)}
                placeholder="Örn: Atlantis Crane - Deniz Vinçleri"
                className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm"
              />
              <p className="text-[10px] text-muted-foreground mt-1">Tarayıcı sekmesinde ve arama sonuçlarında görünen ana başlıktır. (Önerilen: 50-60 karakter)</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-2">Site Açıklaması (Meta Description)</label>
              <textarea
                rows={3}
                required
                value={seo.description || ""}
                onChange={(e) => updateField("seo", "description", e.target.value)}
                placeholder="Sitenizin kısa ve özlü bir tanıtımını yapın..."
                className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm"
              />
              <p className="text-[10px] text-muted-foreground mt-1">Arama sonuçlarında başlığın altında görünen özet metindir. (Önerilen: 150-160 karakter)</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-2">Anahtar Kelimeler (Meta Keywords)</label>
              <textarea
                rows={2}
                value={seo.keywords || ""}
                onChange={(e) => updateField("seo", "keywords", e.target.value)}
                placeholder="Örn: vinç, deniz vinci, offshore platform vinci, atlantis crane"
                className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm"
              />
              <p className="text-[10px] text-muted-foreground mt-1">Kelimeleri virgülle ayırarak yazın.</p>
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
            <span>{isSaving ? "Kaydediliyor..." : "Ayarları Kaydet"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
