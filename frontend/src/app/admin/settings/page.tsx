"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { FileUpload } from "../components/FileUpload";
import { AdminSectionTabs } from "../components/AdminSectionTabs";
import { AdminLoadingState, AdminNotice, AdminPageHeader, AdminPageShell, AdminSaveBar } from "../components/AdminUI";

type SettingsSection = "identity" | "contact" | "addresses";
const settingsTabs = [
  { id: "identity", label: "Genel Kimlik", description: "Sitenin marka adı, ana logosu ve tarayıcı ikonunu yönetin." },
  { id: "contact", label: "İletişim Kanalları", description: "Sitenin genelinde kullanılan e-posta ve telefon bilgisini düzenleyin." },
  { id: "addresses", label: "Ofis Adresleri", description: "İstanbul ve Dubai ofis adreslerini üç dilde yönetin." },
] as const;

export default function SettingsAdminPage() {
  const { apiFetch } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<SettingsSection>("identity");

  // Form inputs
  const [siteTitle, setSiteTitle] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");
  const [favicon, setFavicon] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [istanbulAddress, setIstanbulAddress] = useState<Record<string, string>>({ tr: "", en: "", ar: "" });
  const [dubaiAddress, setDubaiAddress] = useState<Record<string, string>>({ tr: "", en: "", ar: "" });

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await apiFetch("/settings") as { data: Record<string, any> };
      const data = res.data;
      
      if (data.site_title) setSiteTitle(data.site_title.title || "");
      if (data.company_logo) setCompanyLogo(data.company_logo.logo || "");
      if (data.site_favicon) setFavicon(data.site_favicon.icon || "");
      if (data.contact_email) setEmail(data.contact_email.email || "");
      if (data.contact_phone) setPhone(data.contact_phone.phone || "");
      
      if (data.address_istanbul) {
        setIstanbulAddress({
          tr: data.address_istanbul.tr || "",
          en: data.address_istanbul.en || "",
          ar: data.address_istanbul.ar || "",
        });
      }
      if (data.address_dubai) {
        setDubaiAddress({
          tr: data.address_dubai.tr || "",
          en: data.address_dubai.en || "",
          ar: data.address_dubai.ar || "",
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
        site_title: { title: siteTitle },
        company_logo: { logo: companyLogo },
        site_favicon: { icon: favicon },
        contact_email: { email },
        contact_phone: { phone },
        address_istanbul: istanbulAddress,
        address_dubai: dubaiAddress,
      }
    };

    try {
      await apiFetch("/settings", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      window.dispatchEvent(new CustomEvent("admin-branding-updated", {
        detail: { siteTitle, companyLogo, favicon },
      }));
      setSuccess("Sistem ayarları başarıyla güncellendi.");
    } catch (e: any) {
      setError(e.message || "Ayarlar kaydedilemedi.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <AdminLoadingState label="Sistem ayarları yükleniyor..." />;
  }

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Genel Sistem Ayarları"
        description="Marka kimliği, iletişim ve global şirket bilgilerini yönetin."
      />

      {/* Notifications */}
      {error && <AdminNotice type="error">{error}</AdminNotice>}
      {success && <AdminNotice type="success">{success}</AdminNotice>}

      <AdminSectionTabs tabs={settingsTabs} activeTab={activeSection} onChange={setActiveSection} />

      <form onSubmit={handleSave} className="space-y-0 bg-card border border-border/70 rounded-2xl overflow-hidden shadow-sm">
        
        {/* General Identity */}
        {activeSection === "identity" && <div className="p-6 sm:p-8 space-y-5">
          <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.1em] pb-3 border-b border-border/40">1. Genel Kimlik</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Site Başlığı (Title)</label>
              <input
                type="text"
                required
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
                placeholder="Atlantis Crane"
                className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-[#FF2700]"
              />
            </div>
            <div>
              <FileUpload
                label="Firma Logosu"
                value={companyLogo}
                onChange={setCompanyLogo}
                accept="image/*"
                placeholder="/logo.png"
              />
              <p className="mt-1.5 text-[10px] leading-relaxed text-muted-foreground">
                Web sitesinde ve admin panelinin sol üst marka alanında kullanılır.
              </p>
            </div>
            <div>
              <FileUpload
                label="Favicon / Tarayıcı İkonu"
                value={favicon}
                onChange={setFavicon}
                accept=".ico,image/png,image/svg+xml,image/webp,image/x-icon"
                placeholder="/favicon.ico"
              />
              <p className="mt-1.5 text-[10px] leading-relaxed text-muted-foreground">
                Tarayıcı sekmelerinde görünür. Kare PNG, SVG veya ICO dosyası önerilir.
              </p>
            </div>
          </div>
        </div>}

        {/* Contact Info */}
        {activeSection === "contact" && <div className="p-6 sm:p-8 space-y-5">
          <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.1em] pb-3 border-b border-border/40">2. İletişim Kanalları</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">E-posta Adresi</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="info@atlantiscrane.com"
                className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-[#FF2700]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Telefon Numarası</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+90 216 000 00 00"
                className="w-full px-3 py-2 border border-border outline-none rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-[#FF2700]"
              />
            </div>
          </div>
        </div>}

        {/* Physical Addresses */}
        {activeSection === "addresses" && <>
        <div className="p-6 sm:p-8 space-y-5">
          <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.1em] pb-3 border-b border-border/40">3. İstanbul Genel Merkez Adresi</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Türkçe</label>
              <textarea
                rows={3}
                required
                value={istanbulAddress.tr}
                onChange={(e) => setIstanbulAddress({ ...istanbulAddress, tr: e.target.value })}
                className="w-full px-3 py-2 border border-border outline-none rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">ENGLISH</label>
              <textarea
                rows={3}
                required
                value={istanbulAddress.en}
                onChange={(e) => setIstanbulAddress({ ...istanbulAddress, en: e.target.value })}
                className="w-full px-3 py-2 border border-border outline-none rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">العربية (Arabic)</label>
              <textarea
                rows={3}
                required
                value={istanbulAddress.ar}
                onChange={(e) => setIstanbulAddress({ ...istanbulAddress, ar: e.target.value })}
                className="w-full px-3 py-2 border border-border outline-none rounded-lg text-xs"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 p-6 sm:p-8 space-y-5">
          <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.1em] pb-3 border-b border-border/40">4. Dubai Bölge Ofisi Adresi</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Türkçe</label>
              <textarea
                rows={3}
                required
                value={dubaiAddress.tr}
                onChange={(e) => setDubaiAddress({ ...dubaiAddress, tr: e.target.value })}
                className="w-full px-3 py-2 border border-border outline-none rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">ENGLISH</label>
              <textarea
                rows={3}
                required
                value={dubaiAddress.en}
                onChange={(e) => setDubaiAddress({ ...dubaiAddress, en: e.target.value })}
                className="w-full px-3 py-2 border border-border outline-none rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">العربية (Arabic)</label>
              <textarea
                rows={3}
                required
                value={dubaiAddress.ar}
                onChange={(e) => setDubaiAddress({ ...dubaiAddress, ar: e.target.value })}
                className="w-full px-3 py-2 border border-border outline-none rounded-lg text-xs"
              />
            </div>
          </div>
        </div>
        </>}

        <AdminSaveBar isSaving={isSaving} label="Ayarları Kaydet" />
      </form>
    </AdminPageShell>
  );
}
