"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { FileUpload } from "../components/FileUpload";
import { AdminSectionTabs } from "../components/AdminSectionTabs";
import { AdminLoadingState, AdminNotice, AdminPageHeader, AdminPageShell, AdminSaveBar } from "../components/AdminUI";
import { MapPin, Plus, Trash2 } from "lucide-react";

type SettingsSection = "identity" | "contact" | "addresses";
const settingsTabs = [
  { id: "identity", label: "Genel Kimlik", description: "Sitenin marka adı, ana logosu ve tarayıcı ikonunu yönetin." },
  { id: "contact", label: "İletişim Kanalları", description: "Sitenin genelinde kullanılan e-posta ve telefon bilgisini düzenleyin." },
  { id: "addresses", label: "Ofis Adresleri", description: "Ofis ve şube adreslerini ekleyin, kaldırın ve üç dilde yönetin." },
] as const;

type TranslatedText = { tr: string; en: string; ar: string };
type OfficeAddress = {
  id: string;
  title: TranslatedText;
  address: TranslatedText;
  tag: string;
  mapUrl: string;
};

const emptyTranslatedText = (): TranslatedText => ({ tr: "", en: "", ar: "" });

const createOfficeAddress = (): OfficeAddress => ({
  id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `office-${Date.now()}`,
  title: emptyTranslatedText(),
  address: emptyTranslatedText(),
  tag: "",
  mapUrl: "",
});

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
  const [officeAddresses, setOfficeAddresses] = useState<OfficeAddress[]>([]);

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
      
      if (Array.isArray(data.office_addresses?.items)) {
        setOfficeAddresses(data.office_addresses.items);
      } else {
        const migratedAddresses: OfficeAddress[] = [];
        if (data.address_istanbul) {
          migratedAddresses.push({
            id: "istanbul",
            title: { tr: "İstanbul Genel Merkez", en: "Istanbul Headquarters", ar: "المقر الرئيسي في إسطنبول" },
            address: {
              tr: data.address_istanbul.tr || "",
              en: data.address_istanbul.en || "",
              ar: data.address_istanbul.ar || "",
            },
            tag: "TR",
            mapUrl: "",
          });
        }
        if (data.address_dubai) {
          migratedAddresses.push({
            id: "dubai",
            title: { tr: "Dubai Bölge Ofisi", en: "Dubai Regional Office", ar: "المكتب الإقليمي في دبي" },
            address: {
              tr: data.address_dubai.tr || "",
              en: data.address_dubai.en || "",
              ar: data.address_dubai.ar || "",
            },
            tag: "UAE",
            mapUrl: "",
          });
        }
        setOfficeAddresses(migratedAddresses);
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
        office_addresses: { items: officeAddresses },
        // Eski frontend sürümleri için ilk iki adresi geçici olarak koru.
        address_istanbul: officeAddresses[0]?.address || emptyTranslatedText(),
        address_dubai: officeAddresses[1]?.address || emptyTranslatedText(),
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

  const updateOffice = (
    id: string,
    field: "title" | "address",
    locale: keyof TranslatedText,
    value: string,
  ) => {
    setOfficeAddresses((items) =>
      items.map((item) =>
        item.id === id ? { ...item, [field]: { ...item[field], [locale]: value } } : item,
      ),
    );
  };

  const updateOfficeMeta = (id: string, field: "tag" | "mapUrl", value: string) => {
    setOfficeAddresses((items) =>
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
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
        {activeSection === "addresses" && <div className="p-6 sm:p-8 space-y-5">
          <div className="flex flex-col gap-3 border-b border-border/40 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.1em]">3. Ofis Adresleri</h3>
              <p className="mt-1 text-xs text-muted-foreground">Eklenen adresler iletişim sayfasında ve site alt bilgisinde gösterilir.</p>
            </div>
            <button
              type="button"
              onClick={() => setOfficeAddresses((items) => [...items, createOfficeAddress()])}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" /> Yeni Adres Ekle
            </button>
          </div>

          {officeAddresses.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center">
              <MapPin className="mx-auto h-7 w-7 text-muted-foreground/60" />
              <p className="mt-3 text-sm font-bold text-card-foreground">Henüz ofis adresi eklenmedi.</p>
              <p className="mt-1 text-xs text-muted-foreground">İlk adresi oluşturmak için “Yeni Adres Ekle” düğmesini kullanın.</p>
            </div>
          ) : officeAddresses.map((office, index) => (
            <section key={office.id} className="overflow-hidden rounded-xl border border-border/70 bg-muted/10">
              <div className="flex items-center justify-between border-b border-border/60 bg-muted/30 px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-black text-primary">{index + 1}</span>
                  <span className="text-xs font-bold text-card-foreground">{office.title.tr || `Yeni Ofis ${index + 1}`}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setOfficeAddresses((items) => items.filter((item) => item.id !== office.id))}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-destructive transition-colors hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Kaldır
                </button>
              </div>
              <div className="space-y-5 p-5">
                <div className="grid gap-4 md:grid-cols-3">
                  {(["tr", "en", "ar"] as const).map((locale) => (
                    <div key={`${office.id}-title-${locale}`}>
                      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                        Ofis Adı · {locale === "tr" ? "Türkçe" : locale === "en" ? "ENGLISH" : "العربية"}
                      </label>
                      <input
                        type="text"
                        required
                        value={office.title[locale]}
                        onChange={(event) => updateOffice(office.id, "title", locale, event.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                      />
                    </div>
                  ))}
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {(["tr", "en", "ar"] as const).map((locale) => (
                    <div key={`${office.id}-address-${locale}`}>
                      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                        Açık Adres · {locale === "tr" ? "Türkçe" : locale === "en" ? "ENGLISH" : "العربية"}
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={office.address[locale]}
                        onChange={(event) => updateOffice(office.id, "address", locale, event.target.value)}
                        className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                      />
                    </div>
                  ))}
                </div>
                <div className="grid gap-4 md:grid-cols-[160px_1fr]">
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Kısa Kod</label>
                    <input type="text" value={office.tag} onChange={(event) => updateOfficeMeta(office.id, "tag", event.target.value.toUpperCase())} placeholder="TR, UAE…" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Google Maps Embed URL (İsteğe Bağlı)</label>
                    <input type="url" value={office.mapUrl} onChange={(event) => updateOfficeMeta(office.id, "mapUrl", event.target.value)} placeholder="https://www.google.com/maps/embed?pb=…" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary" />
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>}

        <AdminSaveBar isSaving={isSaving} label="Ayarları Kaydet" />
      </form>
    </AdminPageShell>
  );
}
