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

export default function ContactAdminPage() {
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
      setSuccess("İletişim sayfası içerikleri başarıyla güncellendi.");
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
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-primary border-t-transparent"></div>
      </div>
    );
  }

  const currentContent = siteContent[activeLang] || {};
  const contact = currentContent.contact || {};

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">İletişim Sayfası İçerikleri</h2>
          <p className="text-xs text-muted-foreground mt-0.5">İletişim formları, başlıklar ve statik metinleri yönetin.</p>
        </div>

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
        
        {/* Contact Intro */}
        <div className="p-6 sm:p-8 space-y-5">
          <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.1em] pb-3 border-b border-border/40 mb-1">1. Sayfa Girişi</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Küçük Başlık (Eyebrow)</label>
              <input type="text" value={contact.eyebrow || ""} onChange={(e) => updateField("contact", "eyebrow", e.target.value)} className="w-full px-3 py-2.5 bg-background border border-border/70 outline-none rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Başlık</label>
              <input type="text" value={contact.title || ""} onChange={(e) => updateField("contact", "title", e.target.value)} className="w-full px-3 py-2.5 bg-background border border-border/70 outline-none rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Açıklama Paragrafı</label>
              <textarea rows={3} value={contact.description || ""} onChange={(e) => updateField("contact", "description", e.target.value)} className="w-full px-3 py-2.5 bg-background border border-border/70 outline-none rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all" />
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="border-t border-border/50 p-6 sm:p-8 space-y-5">
          <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.1em] pb-3 border-b border-border/40 mb-1">2. İletişim Formu</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Form Başlığı</label><input type="text" value={contact.formTitle || ""} onChange={(e) => updateField("contact", "formTitle", e.target.value)} className="w-full px-3 py-2.5 bg-background border border-border/70 outline-none rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all" /></div>
            <div><label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Form Açıklaması</label><input type="text" value={contact.formDesc || ""} onChange={(e) => updateField("contact", "formDesc", e.target.value)} className="w-full px-3 py-2.5 bg-background border border-border/70 outline-none rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all" /></div>
            <div><label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Adınız Label/Placeholder</label><input type="text" value={contact.namePlaceholder || ""} onChange={(e) => updateField("contact", "namePlaceholder", e.target.value)} className="w-full px-3 py-2.5 bg-background border border-border/70 outline-none rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all" /></div>
            <div><label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">E-posta Label/Placeholder</label><input type="text" value={contact.emailPlaceholder || ""} onChange={(e) => updateField("contact", "emailPlaceholder", e.target.value)} className="w-full px-3 py-2.5 bg-background border border-border/70 outline-none rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all" /></div>
            <div><label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Konu Label/Placeholder</label><input type="text" value={contact.subjectPlaceholder || ""} onChange={(e) => updateField("contact", "subjectPlaceholder", e.target.value)} className="w-full px-3 py-2.5 bg-background border border-border/70 outline-none rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all" /></div>
            <div><label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Gönder Butonu</label><input type="text" value={contact.sendBtn || ""} onChange={(e) => updateField("contact", "sendBtn", e.target.value)} className="w-full px-3 py-2.5 bg-background border border-border/70 outline-none rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all" /></div>
            <div className="md:col-span-2"><label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Mesaj Label/Placeholder</label><input type="text" value={contact.messagePlaceholder || ""} onChange={(e) => updateField("contact", "messagePlaceholder", e.target.value)} className="w-full px-3 py-2.5 bg-background border border-border/70 outline-none rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all" /></div>
          </div>
        </div>

        {/* Contact Info Labels */}
        <div className="border-t border-border/50 p-6 sm:p-8 space-y-5">
          <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.1em] pb-3 border-b border-border/40 mb-1">3. Adres / İletişim Bilgileri Etiketleri</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">E-Posta Etiketi (örn: Bize Yazın)</label><input type="text" value={contact.email || ""} onChange={(e) => updateField("contact", "email", e.target.value)} className="w-full px-3 py-2.5 bg-background border border-border/70 outline-none rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all" /></div>
            <div><label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Telefon Etiketi (örn: Arayın)</label><input type="text" value={contact.phone || ""} onChange={(e) => updateField("contact", "phone", e.target.value)} className="w-full px-3 py-2.5 bg-background border border-border/70 outline-none rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all" /></div>
            <div><label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Merkez Ofis Başlığı (örn: İstanbul Genel Merkez)</label><input type="text" value={contact.hqTitle || ""} onChange={(e) => updateField("contact", "hqTitle", e.target.value)} className="w-full px-3 py-2.5 bg-background border border-border/70 outline-none rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all" /></div>
            <div><label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Merkez Ofis Açık Adresi (Çeviri)</label><input type="text" value={contact.addressIstanbul || ""} onChange={(e) => updateField("contact", "addressIstanbul", e.target.value)} className="w-full px-3 py-2.5 bg-background border border-border/70 outline-none rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all" /></div>
            <div><label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Şube Başlığı (örn: Dubai Bölge Ofisi)</label><input type="text" value={contact.branchTitle || ""} onChange={(e) => updateField("contact", "branchTitle", e.target.value)} className="w-full px-3 py-2.5 bg-background border border-border/70 outline-none rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all" /></div>
            <div><label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Şube Açık Adresi (Çeviri)</label><input type="text" value={contact.addressDubai || ""} onChange={(e) => updateField("contact", "addressDubai", e.target.value)} className="w-full px-3 py-2.5 bg-background border border-border/70 outline-none rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all" /></div>
          </div>
        </div>

        <div className="border-t border-border/50 p-4 sm:p-6 flex justify-end bg-muted/20">
          <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white text-[13px] font-bold rounded-lg shadow-md shadow-primary/20 transition-all active:scale-95">
            <Save className="h-4 w-4" />
            <span>{isSaving ? "Kaydediliyor..." : "İçerikleri Kaydet"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
