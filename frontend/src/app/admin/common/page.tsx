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

export default function CommonAdminPage() {
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
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const currentContent = siteContent[activeLang] || {};
  const common = currentContent.common || {};
  const notFound = currentContent.notFound || {};

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
        <div>
          <h2 className="text-2xl font-black text-card-foreground tracking-tight">Ortak Metinler Yönetimi</h2>
          <p className="text-xs text-muted-foreground mt-1">Sistemdeki genel buton, sayfa isimleri ve 404 gibi alanları yönetin.</p>
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
        
        {/* Ortak Terimler */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-card-foreground uppercase tracking-wider border-b border-[#F2F0EF] pb-2">1. Ortak Terimler</h3>
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
            </div>
          </div>
        </div>

        {/* 404 Hata Sayfası */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-card-foreground uppercase tracking-wider border-b border-[#F2F0EF] pb-2">2. 404 Hata Sayfası</h3>
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
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Açıklama Metni</label>
              <textarea
                value={notFound.description || ""}
                onChange={(e) => updateField("notFound", "description", e.target.value)}
                className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-sm text-card-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors min-h-[80px]"
                placeholder="Örn: Aradığınız sayfa derin sulara gömülmüş..."
              />
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
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="pt-4 flex items-center justify-end border-t border-border">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#E62300] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSaving ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Değişiklikleri Kaydet</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
