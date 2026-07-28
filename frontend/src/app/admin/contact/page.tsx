"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { translations } from "../../lib/site-content";
import { deepMerge } from "../../lib/api";
import { AdminSectionTabs } from "../components/AdminSectionTabs";
import { AdminLanguageTabs, AdminLoadingState, AdminNotice, AdminPageHeader, AdminPageShell, AdminSaveBar } from "../components/AdminUI";
type ContactSection = "intro" | "form" | "info";
const contactTabs = [
  { id: "intro", label: "Sayfa Girişi", description: "İletişim sayfasının ana başlık ve açıklamasını düzenleyin." },
  { id: "form", label: "İletişim Formu", description: "Form başlıklarını, alan etiketlerini ve gönder butonunu yönetin." },
  { id: "info", label: "Adres ve Etiketler", description: "E-posta, telefon, merkez ve şube metinlerini düzenleyin." },
] as const;

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
  const [activeSection, setActiveSection] = useState<ContactSection>("intro");
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
    return <AdminLoadingState label="İletişim içerikleri yükleniyor..." />;
  }

  const currentContent = siteContent[activeLang] || {};
  const contact = currentContent.contact || {};

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="İletişim Sayfası İçerikleri"
        description="İletişim formları, başlıklar ve statik metinleri yönetin."
        actions={<AdminLanguageTabs value={activeLang} onChange={setActiveLang} />}
      />

      {error && <AdminNotice type="error">{error}</AdminNotice>}
      {success && <AdminNotice type="success">{success}</AdminNotice>}

      <AdminSectionTabs tabs={contactTabs} activeTab={activeSection} onChange={setActiveSection} />

      <form onSubmit={handleSave} className="space-y-0 bg-card border border-border/70 rounded-2xl overflow-hidden shadow-sm">
        
        {/* Contact Intro */}
        {activeSection === "intro" && <div className="p-6 sm:p-8 space-y-5">
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
        </div>}

        {/* Contact Form */}
        {activeSection === "form" && <div className="p-6 sm:p-8 space-y-5">
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
        </div>}

        {/* Contact Info Labels */}
        {activeSection === "info" && <div className="p-6 sm:p-8 space-y-5">
          <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.1em] pb-3 border-b border-border/40 mb-1">3. Adres / İletişim Bilgileri Etiketleri</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">E-Posta Etiketi (örn: Bize Yazın)</label><input type="text" value={contact.email || ""} onChange={(e) => updateField("contact", "email", e.target.value)} className="w-full px-3 py-2.5 bg-background border border-border/70 outline-none rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all" /></div>
            <div><label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Telefon Etiketi (örn: Arayın)</label><input type="text" value={contact.phone || ""} onChange={(e) => updateField("contact", "phone", e.target.value)} className="w-full px-3 py-2.5 bg-background border border-border/70 outline-none rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all" /></div>
            <div><label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Merkez Ofis Başlığı (örn: İstanbul Genel Merkez)</label><input type="text" value={contact.hqTitle || ""} onChange={(e) => updateField("contact", "hqTitle", e.target.value)} className="w-full px-3 py-2.5 bg-background border border-border/70 outline-none rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all" /></div>
            <div><label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Merkez Ofis Açık Adresi (Çeviri)</label><input type="text" value={contact.addressIstanbul || ""} onChange={(e) => updateField("contact", "addressIstanbul", e.target.value)} className="w-full px-3 py-2.5 bg-background border border-border/70 outline-none rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all" /></div>
            <div><label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Şube Başlığı (örn: Dubai Bölge Ofisi)</label><input type="text" value={contact.branchTitle || ""} onChange={(e) => updateField("contact", "branchTitle", e.target.value)} className="w-full px-3 py-2.5 bg-background border border-border/70 outline-none rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all" /></div>
            <div><label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Şube Açık Adresi (Çeviri)</label><input type="text" value={contact.addressDubai || ""} onChange={(e) => updateField("contact", "addressDubai", e.target.value)} className="w-full px-3 py-2.5 bg-background border border-border/70 outline-none rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all" /></div>
          </div>
        </div>}

        <AdminSaveBar isSaving={isSaving} label="İçerikleri Kaydet" />
      </form>
    </AdminPageShell>
  );
}
