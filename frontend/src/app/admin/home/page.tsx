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
      setSuccess("Anasayfa içerikleri başarıyla güncellendi.");
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
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#FF2700] border-t-transparent"></div>
      </div>
    );
  }

  const currentContent = siteContent[activeLang] || {};
  const hero = currentContent.hero || {};
  const about = currentContent.about || {};
  const cta = currentContent.ctaSection || {};

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#DEDAD8] pb-5">
        <div>
          <h2 className="text-2xl font-black text-[#111010] tracking-tight">Anasayfa İçerik Yönetimi</h2>
          <p className="text-xs text-[#6F6B69] mt-1">Anasayfadaki banner, video, yazı ve butonları yönetin.</p>
        </div>

        {/* Language Tabs */}
        <div className="flex gap-1 bg-[#F2F0EF] p-0.5 rounded-lg border border-[#DEDAD8] self-start sm:self-auto">
          {(["tr", "en", "ar"] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setActiveLang(lang)}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all uppercase ${
                activeLang === lang
                  ? "bg-white text-[#111010] shadow-sm"
                  : "text-[#6F6B69] hover:text-[#111010]"
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

      <form onSubmit={handleSave} className="space-y-8 bg-white border border-[#DEDAD8] rounded-2xl p-6 sm:p-8 shadow-sm">
        
        {/* Hero Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-[#111010] uppercase tracking-wider border-b border-[#F2F0EF] pb-2">1. Giriş Alanı (Hero)</h3>
          
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
              <label className="block text-xs font-bold text-[#3E3B3A] mb-2">Etiket (Eyebrow)</label>
              <input
                type="text"
                required
                value={hero.eyebrow || ""}
                onChange={(e) => updateField("hero", "eyebrow", e.target.value)}
                className="w-full px-3 py-2 border border-[#DEDAD8] outline-none rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3E3B3A] mb-2">Ana Başlık</label>
              <input
                type="text"
                required
                value={hero.title || ""}
                onChange={(e) => updateField("hero", "title", e.target.value)}
                className="w-full px-3 py-2 border border-[#DEDAD8] outline-none rounded-lg text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#3E3B3A] mb-2">Açıklama</label>
              <textarea
                rows={3}
                required
                value={hero.description || ""}
                onChange={(e) => updateField("hero", "description", e.target.value)}
                className="w-full px-3 py-2 border border-[#DEDAD8] outline-none rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3E3B3A] mb-2">Birincil Buton (CTA 1)</label>
              <input
                type="text"
                required
                value={hero.primaryCta || ""}
                onChange={(e) => updateField("hero", "primaryCta", e.target.value)}
                className="w-full px-3 py-2 border border-[#DEDAD8] outline-none rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3E3B3A] mb-2">İkincil Buton (CTA 2)</label>
              <input
                type="text"
                required
                value={hero.secondaryCta || ""}
                onChange={(e) => updateField("hero", "secondaryCta", e.target.value)}
                className="w-full px-3 py-2 border border-[#DEDAD8] outline-none rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="border-t border-[#F2F0EF] pt-6 space-y-4">
          <h3 className="text-sm font-black text-[#111010] uppercase tracking-wider border-b border-[#F2F0EF] pb-2">2. Hakkımızda Önizleme Bölümü</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#3E3B3A] mb-2">Küçük Başlık (Eyebrow)</label>
              <input
                type="text"
                required
                value={about.eyebrow || ""}
                onChange={(e) => updateField("about", "eyebrow", e.target.value)}
                className="w-full px-3 py-2 border border-[#DEDAD8] outline-none rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3E3B3A] mb-2">Bölüm Başlığı</label>
              <input
                type="text"
                required
                value={about.title || ""}
                onChange={(e) => updateField("about", "title", e.target.value)}
                className="w-full px-3 py-2 border border-[#DEDAD8] outline-none rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3E3B3A] mb-2">Altbaşlık Vurgulu Kısım</label>
              <input
                type="text"
                required
                value={about.subtitleHighlight || ""}
                onChange={(e) => updateField("about", "subtitleHighlight", e.target.value)}
                className="w-full px-3 py-2 border border-[#DEDAD8] outline-none rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3E3B3A] mb-2">Altbaşlık Devamı</label>
              <input
                type="text"
                required
                value={about.subtitle || ""}
                onChange={(e) => updateField("about", "subtitle", e.target.value)}
                className="w-full px-3 py-2 border border-[#DEDAD8] outline-none rounded-lg text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#3E3B3A] mb-2">Açıklama Paragrafı</label>
              <textarea
                rows={3}
                required
                value={about.description || ""}
                onChange={(e) => updateField("about", "description", e.target.value)}
                className="w-full px-3 py-2 border border-[#DEDAD8] outline-none rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3E3B3A] mb-2">Sol Buton Yazısı</label>
              <input
                type="text"
                required
                value={about.primaryBtn || ""}
                onChange={(e) => updateField("about", "primaryBtn", e.target.value)}
                className="w-full px-3 py-2 border border-[#DEDAD8] outline-none rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3E3B3A] mb-2">Sağ Buton Yazısı</label>
              <input
                type="text"
                required
                value={about.secondaryBtn || ""}
                onChange={(e) => updateField("about", "secondaryBtn", e.target.value)}
                className="w-full px-3 py-2 border border-[#DEDAD8] outline-none rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="border-t border-[#F2F0EF] pt-6 space-y-4">
          <h3 className="text-sm font-black text-[#111010] uppercase tracking-wider border-b border-[#F2F0EF] pb-2">3. Alt İletişim Bandı (CTA Bölümü)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#3E3B3A] mb-2">Küçük Başlık (Eyebrow)</label>
              <input
                type="text"
                required
                value={cta.eyebrow || ""}
                onChange={(e) => updateField("ctaSection", "eyebrow", e.target.value)}
                className="w-full px-3 py-2 border border-[#DEDAD8] outline-none rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3E3B3A] mb-2">Ana Başlık (Satır atlamak için \n kullanın)</label>
              <input
                type="text"
                required
                value={cta.title || ""}
                onChange={(e) => updateField("ctaSection", "title", e.target.value)}
                className="w-full px-3 py-2 border border-[#DEDAD8] outline-none rounded-lg text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#3E3B3A] mb-2">Açıklama</label>
              <textarea
                rows={3}
                required
                value={cta.description || ""}
                onChange={(e) => updateField("ctaSection", "description", e.target.value)}
                className="w-full px-3 py-2 border border-[#DEDAD8] outline-none rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3E3B3A] mb-2">Birincil Buton Yazısı</label>
              <input
                type="text"
                required
                value={cta.primaryBtn || ""}
                onChange={(e) => updateField("ctaSection", "primaryBtn", e.target.value)}
                className="w-full px-3 py-2 border border-[#DEDAD8] outline-none rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3E3B3A] mb-2">İkincil Buton Yazısı</label>
              <input
                type="text"
                required
                value={cta.secondaryBtn || ""}
                onChange={(e) => updateField("ctaSection", "secondaryBtn", e.target.value)}
                className="w-full px-3 py-2 border border-[#DEDAD8] outline-none rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="border-t border-[#F2F0EF] pt-6 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#FF2700] hover:bg-[#D62000] disabled:bg-gray-400 text-white text-sm font-bold rounded-lg shadow-lg shadow-[#FF2700]/15 transition-all"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? "Kaydediliyor..." : "İçerikleri Kaydet"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
