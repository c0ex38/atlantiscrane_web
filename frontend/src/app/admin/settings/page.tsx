"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Save, Check, AlertCircle } from "lucide-react";
import { FileUpload } from "../components/FileUpload";

export default function SettingsAdminPage() {
  const { apiFetch } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form inputs
  const [siteTitle, setSiteTitle] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");
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
      setSuccess("Sistem ayarları başarıyla güncellendi.");
    } catch (e: any) {
      setError(e.message || "Ayarlar kaydedilemedi.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between border-b border-border pb-5">
        <div>
          <h2 className="text-2xl font-black text-card-foreground tracking-tight">Sistem Ayarları</h2>
          <p className="text-xs text-muted-foreground mt-1">İletişim, adresler ve global şirket parametrelerini güncelleyin.</p>
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
        
        {/* General Identity */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-card-foreground uppercase tracking-wider">Genel Kimlik</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-2">Site Başlığı (Title)</label>
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
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-[#F2F0EF] pt-6 space-y-4">
          <h3 className="text-sm font-black text-card-foreground uppercase tracking-wider">İletişim Kanalları</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-2">E-posta Adresi</label>
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
              <label className="block text-xs font-bold text-muted-foreground mb-2">Telefon Numarası</label>
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
        </div>

        {/* Physical Addresses */}
        <div className="border-t border-[#F2F0EF] pt-6 space-y-4">
          <h3 className="text-sm font-black text-card-foreground uppercase tracking-wider">İstanbul Genel Merkez Adresi</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-2">Türkçe</label>
              <textarea
                rows={3}
                required
                value={istanbulAddress.tr}
                onChange={(e) => setIstanbulAddress({ ...istanbulAddress, tr: e.target.value })}
                className="w-full px-3 py-2 border border-border outline-none rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-2">English</label>
              <textarea
                rows={3}
                required
                value={istanbulAddress.en}
                onChange={(e) => setIstanbulAddress({ ...istanbulAddress, en: e.target.value })}
                className="w-full px-3 py-2 border border-border outline-none rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-2">العربية (Arabic)</label>
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

        <div className="border-t border-[#F2F0EF] pt-6 space-y-4">
          <h3 className="text-sm font-black text-card-foreground uppercase tracking-wider">Dubai Bölge Ofisi Adresi</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-2">Türkçe</label>
              <textarea
                rows={3}
                required
                value={dubaiAddress.tr}
                onChange={(e) => setDubaiAddress({ ...dubaiAddress, tr: e.target.value })}
                className="w-full px-3 py-2 border border-border outline-none rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-2">English</label>
              <textarea
                rows={3}
                required
                value={dubaiAddress.en}
                onChange={(e) => setDubaiAddress({ ...dubaiAddress, en: e.target.value })}
                className="w-full px-3 py-2 border border-border outline-none rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-2">العربية (Arabic)</label>
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
