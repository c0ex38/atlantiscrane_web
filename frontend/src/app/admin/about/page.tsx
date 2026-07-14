"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Save, Check, AlertCircle } from "lucide-react";

const localeNames = { tr: "Türkçe", en: "English", ar: "العربية" } as const;

export default function AboutAdminPage() {
  const { apiFetch } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [activeLang, setActiveLang] = useState<"tr" | "en" | "ar">("tr");
  const [aboutPage, setAboutPage] = useState<Record<string, any>>({
    tr: {
      hero: { title1: "", titleHighlight: "", title2: "", description: "" },
      story: { eyebrow: "", title1: "", titleHighlight: "", title2: "", p1: "", p2: "", p3: "", badgeTitle: "", badgeSubtitle: "" },
      mission: { eyebrow: "", title1: "", titleHighlight: "", title2: "", description: "" }
    },
    en: {
      hero: { title1: "", titleHighlight: "", title2: "", description: "" },
      story: { eyebrow: "", title1: "", titleHighlight: "", title2: "", p1: "", p2: "", p3: "", badgeTitle: "", badgeSubtitle: "" },
      mission: { eyebrow: "", title1: "", titleHighlight: "", title2: "", description: "" }
    },
    ar: {
      hero: { title1: "", titleHighlight: "", title2: "", description: "" },
      story: { eyebrow: "", title1: "", titleHighlight: "", title2: "", p1: "", p2: "", p3: "", badgeTitle: "", badgeSubtitle: "" },
      mission: { eyebrow: "", title1: "", titleHighlight: "", title2: "", description: "" }
    }
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
      
      if (data.about_page) {
        setAboutPage({
          tr: { ...aboutPage.tr, ...data.about_page.tr },
          en: { ...aboutPage.en, ...data.about_page.en },
          ar: { ...aboutPage.ar, ...data.about_page.ar },
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
        about_page: aboutPage,
      }
    };

    try {
      await apiFetch("/settings", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setSuccess("Hakkımızda içerikleri başarıyla güncellendi.");
    } catch (e: any) {
      setError(e.message || "Ayarlar kaydedilemedi.");
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (section: string, field: string, val: string) => {
    setAboutPage((prev) => {
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

  const currentContent = aboutPage[activeLang] || {};
  const hero = currentContent.hero || {};
  const story = currentContent.story || {};
  const mission = currentContent.mission || {};

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#DEDAD8] pb-5">
        <div>
          <h2 className="text-2xl font-black text-[#111010] tracking-tight">Hakkımızda İçerik Yönetimi</h2>
          <p className="text-xs text-[#6F6B69] mt-1">Hakkımızda sayfasındaki başlık, hikaye, vizyon ve misyon metinlerini yönetin.</p>
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#3E3B3A] mb-2">Başlık Satır 1</label>
              <input
                type="text"
                value={hero.title1 || ""}
                onChange={(e) => updateField("hero", "title1", e.target.value)}
                className="w-full px-3 py-2 border border-[#DEDAD8] outline-none rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#3E3B3A] mb-2">Vurgulu Kısım</label>
              <input
                type="text"
                value={hero.titleHighlight || ""}
                onChange={(e) => updateField("hero", "titleHighlight", e.target.value)}
                className="w-full px-3 py-2 border border-[#DEDAD8] outline-none rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#3E3B3A] mb-2">Başlık Satır 2</label>
              <input
                type="text"
                value={hero.title2 || ""}
                onChange={(e) => updateField("hero", "title2", e.target.value)}
                className="w-full px-3 py-2 border border-[#DEDAD8] outline-none rounded-lg text-sm"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-[#3E3B3A] mb-2">Açıklama</label>
              <textarea
                rows={2}
                value={hero.description || ""}
                onChange={(e) => updateField("hero", "description", e.target.value)}
                className="w-full px-3 py-2 border border-[#DEDAD8] outline-none rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="border-t border-[#F2F0EF] pt-6 space-y-4">
          <h3 className="text-sm font-black text-[#111010] uppercase tracking-wider border-b border-[#F2F0EF] pb-2">2. Hikayemiz</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#3E3B3A] mb-2">Üst Başlık (Eyebrow)</label>
              <input
                type="text"
                value={story.eyebrow || ""}
                onChange={(e) => updateField("story", "eyebrow", e.target.value)}
                className="w-full px-3 py-2 border border-[#DEDAD8] outline-none rounded-lg text-sm"
              />
            </div>
            <div className="md:col-span-2">
              {/* Spacer */}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3E3B3A] mb-2">Başlık Satır 1</label>
              <input
                type="text"
                value={story.title1 || ""}
                onChange={(e) => updateField("story", "title1", e.target.value)}
                className="w-full px-3 py-2 border border-[#DEDAD8] outline-none rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#3E3B3A] mb-2">Vurgulu Kısım</label>
              <input
                type="text"
                value={story.titleHighlight || ""}
                onChange={(e) => updateField("story", "titleHighlight", e.target.value)}
                className="w-full px-3 py-2 border border-[#DEDAD8] outline-none rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#3E3B3A] mb-2">Başlık Satır 2</label>
              <input
                type="text"
                value={story.title2 || ""}
                onChange={(e) => updateField("story", "title2", e.target.value)}
                className="w-full px-3 py-2 border border-[#DEDAD8] outline-none rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3E3B3A] mb-2">Paragraf 1</label>
              <textarea
                rows={4}
                value={story.p1 || ""}
                onChange={(e) => updateField("story", "p1", e.target.value)}
                className="w-full px-3 py-2 border border-[#DEDAD8] outline-none rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#3E3B3A] mb-2">Paragraf 2</label>
              <textarea
                rows={4}
                value={story.p2 || ""}
                onChange={(e) => updateField("story", "p2", e.target.value)}
                className="w-full px-3 py-2 border border-[#DEDAD8] outline-none rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#3E3B3A] mb-2">Paragraf 3</label>
              <textarea
                rows={4}
                value={story.p3 || ""}
                onChange={(e) => updateField("story", "p3", e.target.value)}
                className="w-full px-3 py-2 border border-[#DEDAD8] outline-none rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3E3B3A] mb-2">Rozet Başlığı (Badge Title)</label>
              <input
                type="text"
                value={story.badgeTitle || ""}
                onChange={(e) => updateField("story", "badgeTitle", e.target.value)}
                className="w-full px-3 py-2 border border-[#DEDAD8] outline-none rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#3E3B3A] mb-2">Rozet Altbaşlığı (Badge Subtitle)</label>
              <input
                type="text"
                value={story.badgeSubtitle || ""}
                onChange={(e) => updateField("story", "badgeSubtitle", e.target.value)}
                className="w-full px-3 py-2 border border-[#DEDAD8] outline-none rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="border-t border-[#F2F0EF] pt-6 space-y-4">
          <h3 className="text-sm font-black text-[#111010] uppercase tracking-wider border-b border-[#F2F0EF] pb-2">3. Misyonumuz</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#3E3B3A] mb-2">Üst Başlık (Eyebrow)</label>
              <input
                type="text"
                value={mission.eyebrow || ""}
                onChange={(e) => updateField("mission", "eyebrow", e.target.value)}
                className="w-full px-3 py-2 border border-[#DEDAD8] outline-none rounded-lg text-sm"
              />
            </div>
            <div className="md:col-span-2">
              {/* Spacer */}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3E3B3A] mb-2">Başlık Satır 1</label>
              <input
                type="text"
                value={mission.title1 || ""}
                onChange={(e) => updateField("mission", "title1", e.target.value)}
                className="w-full px-3 py-2 border border-[#DEDAD8] outline-none rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#3E3B3A] mb-2">Vurgulu Kısım</label>
              <input
                type="text"
                value={mission.titleHighlight || ""}
                onChange={(e) => updateField("mission", "titleHighlight", e.target.value)}
                className="w-full px-3 py-2 border border-[#DEDAD8] outline-none rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#3E3B3A] mb-2">Başlık Satır 2</label>
              <input
                type="text"
                value={mission.title2 || ""}
                onChange={(e) => updateField("mission", "title2", e.target.value)}
                className="w-full px-3 py-2 border border-[#DEDAD8] outline-none rounded-lg text-sm"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-[#3E3B3A] mb-2">Misyon Açıklaması</label>
              <textarea
                rows={3}
                value={mission.description || ""}
                onChange={(e) => updateField("mission", "description", e.target.value)}
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
