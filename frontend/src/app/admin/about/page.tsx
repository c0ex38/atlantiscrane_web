"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { AdminSectionTabs } from "../components/AdminSectionTabs";
import { AdminLanguageTabs, AdminLoadingState, AdminNotice, AdminPageHeader, AdminPageShell, AdminSaveBar } from "../components/AdminUI";
type AboutSection = "hero" | "story" | "mission";
const aboutTabs = [
  { id: "hero", label: "Giriş Alanı", description: "Hakkımızda sayfasının üst başlık ve açıklamasını düzenleyin." },
  { id: "story", label: "Hikayemiz", description: "Şirket hikayesi, paragraflar ve deneyim rozetini yönetin." },
  { id: "mission", label: "Misyonumuz", description: "Misyon bölümünün başlık ve açıklamasını düzenleyin." },
] as const;

export default function AboutAdminPage() {
  const { apiFetch } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [activeLang, setActiveLang] = useState<"tr" | "en" | "ar">("tr");
  const [activeSection, setActiveSection] = useState<AboutSection>("hero");
  const [aboutPage, setAboutPage] = useState<Record<string, any>>({
    tr: {
      hero: { title: "", description: "" },
      story: { eyebrow: "", title: "", p1: "", p2: "", p3: "", badgeTitle: "", badgeSubtitle: "" },
      mission: { eyebrow: "", title: "", description: "" }
    },
    en: {
      hero: { title: "", description: "" },
      story: { eyebrow: "", title: "", p1: "", p2: "", p3: "", badgeTitle: "", badgeSubtitle: "" },
      mission: { eyebrow: "", title: "", description: "" }
    },
    ar: {
      hero: { title: "", description: "" },
      story: { eyebrow: "", title: "", p1: "", p2: "", p3: "", badgeTitle: "", badgeSubtitle: "" },
      mission: { eyebrow: "", title: "", description: "" }
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
    return <AdminLoadingState label="Hakkımızda içerikleri yükleniyor..." />;
  }

  const currentContent = aboutPage[activeLang] || {};
  const hero = currentContent.hero || {};
  const story = currentContent.story || {};
  const mission = currentContent.mission || {};

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Hakkımızda İçerik Yönetimi"
        description="Hakkımızda sayfasındaki başlık, hikaye, vizyon ve misyon metinlerini yönetin."
        actions={<AdminLanguageTabs value={activeLang} onChange={setActiveLang} />}
      />

      {/* Notifications */}
      {error && <AdminNotice type="error">{error}</AdminNotice>}
      {success && <AdminNotice type="success">{success}</AdminNotice>}

      <AdminSectionTabs tabs={aboutTabs} activeTab={activeSection} onChange={setActiveSection} />

      <form onSubmit={handleSave} className="space-y-0 bg-card border border-border/70 rounded-2xl overflow-hidden shadow-sm">
        
        {/* Hero Section */}
        {activeSection === "hero" && <div className="p-6 sm:p-8 space-y-5">
          <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.1em] pb-3 border-b border-border/40 mb-1">1. Giriş Alanı (Hero)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-3">
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Başlık (Vurgulu kısımlar için &lt;span&gt; kullanın)</label>
              <input
                type="text"
                value={hero.title || ""}
                onChange={(e) => updateField("hero", "title", e.target.value)}
                className="w-full px-3 py-2.5 bg-background border border-border/70 outline-none rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Açıklama</label>
              <textarea
                rows={2}
                value={hero.description || ""}
                onChange={(e) => updateField("hero", "description", e.target.value)}
                className="w-full px-3 py-2.5 bg-background border border-border/70 outline-none rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>
        </div>}

        {/* Story Section */}
        {activeSection === "story" && <div className="p-6 sm:p-8 space-y-5">
          <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.1em] pb-3 border-b border-border/40 mb-1">2. Hikayemiz</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Üst Başlık (Eyebrow)</label>
              <input
                type="text"
                value={story.eyebrow || ""}
                onChange={(e) => updateField("story", "eyebrow", e.target.value)}
                className="w-full px-3 py-2.5 bg-background border border-border/70 outline-none rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
            <div className="md:col-span-2">
              {/* Spacer */}
            </div>

            <div className="md:col-span-3">
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Başlık (Vurgulu kısımlar için &lt;span&gt; kullanın)</label>
              <input
                type="text"
                value={story.title || ""}
                onChange={(e) => updateField("story", "title", e.target.value)}
                className="w-full px-3 py-2.5 bg-background border border-border/70 outline-none rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Paragraf 1</label>
              <textarea
                rows={4}
                value={story.p1 || ""}
                onChange={(e) => updateField("story", "p1", e.target.value)}
                className="w-full px-3 py-2 border border-border outline-none rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Paragraf 2</label>
              <textarea
                rows={4}
                value={story.p2 || ""}
                onChange={(e) => updateField("story", "p2", e.target.value)}
                className="w-full px-3 py-2 border border-border outline-none rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Paragraf 3</label>
              <textarea
                rows={4}
                value={story.p3 || ""}
                onChange={(e) => updateField("story", "p3", e.target.value)}
                className="w-full px-3 py-2 border border-border outline-none rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Rozet Başlığı (Badge Title)</label>
              <input
                type="text"
                value={story.badgeTitle || ""}
                onChange={(e) => updateField("story", "badgeTitle", e.target.value)}
                className="w-full px-3 py-2.5 bg-background border border-border/70 outline-none rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Rozet Altbaşlığı (Badge Subtitle)</label>
              <input
                type="text"
                value={story.badgeSubtitle || ""}
                onChange={(e) => updateField("story", "badgeSubtitle", e.target.value)}
                className="w-full px-3 py-2.5 bg-background border border-border/70 outline-none rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>
        </div>}

        {/* Mission Section */}
        {activeSection === "mission" && <div className="p-6 sm:p-8 space-y-5">
          <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.1em] pb-3 border-b border-border/40 mb-1">3. Misyonumuz</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Üst Başlık (Eyebrow)</label>
              <input
                type="text"
                value={mission.eyebrow || ""}
                onChange={(e) => updateField("mission", "eyebrow", e.target.value)}
                className="w-full px-3 py-2.5 bg-background border border-border/70 outline-none rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
            <div className="md:col-span-2">
              {/* Spacer */}
            </div>

            <div className="md:col-span-3">
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Başlık (Vurgulu kısımlar için &lt;span&gt; kullanın)</label>
              <input
                type="text"
                value={mission.title || ""}
                onChange={(e) => updateField("mission", "title", e.target.value)}
                className="w-full px-3 py-2.5 bg-background border border-border/70 outline-none rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Misyon Açıklaması</label>
              <textarea
                rows={3}
                value={mission.description || ""}
                onChange={(e) => updateField("mission", "description", e.target.value)}
                className="w-full px-3 py-2.5 bg-background border border-border/70 outline-none rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>
        </div>}

        <AdminSaveBar isSaving={isSaving} label="İçerikleri Kaydet" />
      </form>
    </AdminPageShell>
  );
}
