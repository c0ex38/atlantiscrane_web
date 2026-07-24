import sys

content = """"use client";

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

export default function ProductTextsAdminPage() {
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
      setSuccess("Ürün detay metinleri başarıyla güncellendi.");
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
  const productDetail = currentContent.productDetail || {};

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
        <div>
          <h2 className="text-2xl font-black text-card-foreground tracking-tight">Ürün Sayfası Sabit Metinleri</h2>
          <p className="text-xs text-muted-foreground mt-1">Ürün detay sayfalarındaki sabit başlıklar, tablo sütun adları ve butonları yönetin.</p>
        </div>

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
        
        {/* Titles */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-card-foreground uppercase tracking-wider border-b border-[#F2F0EF] pb-2">1. Bölüm Başlıkları</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-xs font-bold text-muted-foreground mb-2">Teknik Özellikler (SpecsTitle)</label><input type="text" value={productDetail.specsTitle || ""} onChange={(e) => updateField("productDetail", "specsTitle", e.target.value)} className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm" /></div>
            <div><label className="block text-xs font-bold text-muted-foreground mb-2">Standart Ekipman (standardEquipTitle)</label><input type="text" value={productDetail.standardEquipTitle || ""} onChange={(e) => updateField("productDetail", "standardEquipTitle", e.target.value)} className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm" /></div>
            <div><label className="block text-xs font-bold text-muted-foreground mb-2">Opsiyonel Ekipman (optionalEquipTitle)</label><input type="text" value={productDetail.optionalEquipTitle || ""} onChange={(e) => updateField("productDetail", "optionalEquipTitle", e.target.value)} className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm" /></div>
            <div><label className="block text-xs font-bold text-muted-foreground mb-2">Açıklama Başlığı (descTitle)</label><input type="text" value={productDetail.descTitle || ""} onChange={(e) => updateField("productDetail", "descTitle", e.target.value)} className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm" /></div>
            <div><label className="block text-xs font-bold text-muted-foreground mb-2">Kullanım Alanı Başlığı (usageTitle)</label><input type="text" value={productDetail.usageTitle || ""} onChange={(e) => updateField("productDetail", "usageTitle", e.target.value)} className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm" /></div>
            <div><label className="block text-xs font-bold text-muted-foreground mb-2">Özellikler Başlığı (featuresTitle)</label><input type="text" value={productDetail.featuresTitle || ""} onChange={(e) => updateField("productDetail", "featuresTitle", e.target.value)} className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm" /></div>
            <div><label className="block text-xs font-bold text-muted-foreground mb-2">Yük Tablosu Başlığı (loadChartTitle)</label><input type="text" value={productDetail.loadChartTitle || ""} onChange={(e) => updateField("productDetail", "loadChartTitle", e.target.value)} className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm" /></div>
          </div>
        </div>

        {/* Labels & Buttons */}
        <div className="border-t border-[#F2F0EF] pt-6 space-y-4">
          <h3 className="text-sm font-black text-card-foreground uppercase tracking-wider border-b border-[#F2F0EF] pb-2">2. Etiketler ve Butonlar</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-xs font-bold text-muted-foreground mb-2">Standart Etiketi</label><input type="text" value={productDetail.standardLabel || ""} onChange={(e) => updateField("productDetail", "standardLabel", e.target.value)} className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm" /></div>
            <div><label className="block text-xs font-bold text-muted-foreground mb-2">Opsiyonel Etiketi</label><input type="text" value={productDetail.optionalLabel || ""} onChange={(e) => updateField("productDetail", "optionalLabel", e.target.value)} className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm" /></div>
            <div><label className="block text-xs font-bold text-muted-foreground mb-2">Sertifika Etiketi (classCertLabel)</label><input type="text" value={productDetail.classCertLabel || ""} onChange={(e) => updateField("productDetail", "classCertLabel", e.target.value)} className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm" /></div>
            <div><label className="block text-xs font-bold text-muted-foreground mb-2">Yük Zarfları (loadEnvelope)</label><input type="text" value={productDetail.loadEnvelope || ""} onChange={(e) => updateField("productDetail", "loadEnvelope", e.target.value)} className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm" /></div>
            <div><label className="block text-xs font-bold text-muted-foreground mb-2">Kapasite (Büyük Harf)</label><input type="text" value={productDetail.capacityUpper || ""} onChange={(e) => updateField("productDetail", "capacityUpper", e.target.value)} className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm" /></div>
            <div><label className="block text-xs font-bold text-muted-foreground mb-2">Erişim (Büyük Harf)</label><input type="text" value={productDetail.outreachUpper || ""} onChange={(e) => updateField("productDetail", "outreachUpper", e.target.value)} className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm" /></div>
            <div><label className="block text-xs font-bold text-muted-foreground mb-2">Izgara Etiketi (gridLabel)</label><input type="text" value={productDetail.gridLabel || ""} onChange={(e) => updateField("productDetail", "gridLabel", e.target.value)} className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm" /></div>
            <div><label className="block text-xs font-bold text-muted-foreground mb-2">Yük Tablosu Sütun - Erişim</label><input type="text" value={productDetail.outreachCol || ""} onChange={(e) => updateField("productDetail", "outreachCol", e.target.value)} className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm" /></div>
            <div><label className="block text-xs font-bold text-muted-foreground mb-2">Yük Tablosu Sütun - Kapasite</label><input type="text" value={productDetail.capacityCol || ""} onChange={(e) => updateField("productDetail", "capacityCol", e.target.value)} className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm" /></div>
            <div><label className="block text-xs font-bold text-muted-foreground mb-2">Teklif İste Butonu (quoteBtn)</label><input type="text" value={productDetail.quoteBtn || ""} onChange={(e) => updateField("productDetail", "quoteBtn", e.target.value)} className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm" /></div>
            <div><label className="block text-xs font-bold text-muted-foreground mb-2">Listeye Dön Butonu (backToList)</label><input type="text" value={productDetail.backToList || ""} onChange={(e) => updateField("productDetail", "backToList", e.target.value)} className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm" /></div>
          </div>
        </div>

        <div className="border-t border-[#F2F0EF] pt-6 flex justify-end">
          <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 disabled:bg-gray-400 text-white text-sm font-bold rounded-lg shadow-lg shadow-primary/15 transition-all">
            <Save className="h-4 w-4" />
            <span>{isSaving ? "Kaydediliyor..." : "İçerikleri Kaydet"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
"""
with open("frontend/src/app/admin/product-texts/page.tsx", "w") as f:
    f.write(content)
