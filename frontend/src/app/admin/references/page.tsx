"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Check,
  Layers
} from "lucide-react";
import { FileUpload } from "../components/FileUpload";
import { AdminEditorModal, AdminEmptyState, AdminLanguageTabs, AdminLoadingState, AdminNotice, AdminPageHeader, AdminPageShell, AdminViewToggle, adminPrimaryButtonClass } from "../components/AdminUI";

interface Reference {
  id: string;
  title: Record<string, string>;
  client?: Record<string, string>;
  category?: Record<string, string>;
  description?: Record<string, string>;
  image?: string;
  isActive: boolean;
}

export default function ReferencesAdminPage() {
  const { apiFetch } = useAuth();
  const [references, setReferences] = useState<Reference[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // View State
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReference, setEditingReference] = useState<Reference | null>(null);

  // Tab State
  const [activeLang, setActiveLang] = useState<"tr" | "en" | "ar">("tr");

  // Form Fields
  const [isActive, setIsActive] = useState(true);
  const [image, setImage] = useState("");
  const [title, setTitle] = useState<Record<string, string>>({ tr: "", en: "", ar: "" });
  const [client, setClient] = useState<Record<string, string>>({ tr: "", en: "", ar: "" });
  const [category, setCategory] = useState<Record<string, string>>({ tr: "", en: "", ar: "" });
  const [description, setDescription] = useState<Record<string, string>>({ tr: "", en: "", ar: "" });

  useEffect(() => {
    fetchReferences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchReferences = async () => {
    setIsLoading(true);
    try {
      const res = await apiFetch("/references") as { data: Reference[] };
      setReferences(res.data);
    } catch (e: any) {
      setError(e.message || "Referanslar yüklenirken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingReference(null);
    setIsActive(true);
    setImage("/about-facility.png");
    setTitle({ tr: "", en: "", ar: "" });
    setClient({ tr: "", en: "", ar: "" });
    setCategory({ tr: "", en: "", ar: "" });
    setDescription({ tr: "", en: "", ar: "" });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (reference: Reference) => {
    setEditingReference(reference);
    setIsActive(reference.isActive);
    setImage(reference.image || "");
    setTitle({ tr: reference.title?.tr || "", en: reference.title?.en || "", ar: reference.title?.ar || "" });
    setClient({ tr: reference.client?.tr || "", en: reference.client?.en || "", ar: reference.client?.ar || "" });
    setCategory({ tr: reference.category?.tr || "", en: reference.category?.en || "", ar: reference.category?.ar || "" });
    setDescription({ tr: reference.description?.tr || "", en: reference.description?.en || "", ar: reference.description?.ar || "" });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const payload = {
      isActive,
      image,
      title,
      client,
      category,
      description,
    };

    try {
      if (editingReference) {
        await apiFetch(`/references/${editingReference.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setSuccess("Referans başarıyla güncellendi.");
      } else {
        await apiFetch("/references", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setSuccess("Referans başarıyla oluşturuldu.");
      }
      setIsModalOpen(false);
      fetchReferences();
    } catch (e: any) {
      setError(e.message || "İşlem gerçekleştirilemedi.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu referansı silmek istediğinize emin misiniz?")) return;
    setError(null);
    try {
      await apiFetch(`/references/${id}`, { method: "DELETE" });
      setSuccess("Referans başarıyla silindi.");
      fetchReferences();
    } catch (e: any) {
      setError(e.message || "Silme işlemi başarısız.");
    }
  };

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Referans Yönetimi"
        description="Gemi inşa ve global vinç teslimat referanslarını yönetin."
        actions={<>
          <AdminViewToggle value={viewMode} onChange={setViewMode} />
          <button
            type="button"
            onClick={handleOpenAddModal}
            className={adminPrimaryButtonClass}
          >
            <Plus className="h-[18px] w-[18px]" />
            <span>Yeni Referans Ekle</span>
          </button>
        </>}
      />

      {/* Notifications */}
      {error && <AdminNotice type="error">{error}</AdminNotice>}
      {success && <AdminNotice type="success">{success}</AdminNotice>}

      {/* Listing Grid */}
      {isLoading ? (
        <AdminLoadingState label="Referanslar yükleniyor..." />
      ) : references.length === 0 ? (
        <AdminEmptyState title="Henüz kayıtlı referans bulunmuyor." description="İlk referans kaydını oluşturmak için Yeni Referans Ekle butonunu kullanın." />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-300">
          {references.map((reference) => (
            <div 
              key={reference.id}
              className="soft-card overflow-hidden hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group"
            >
              {reference.image && (
                <div className="w-full h-32 bg-muted/50 border-b border-border/50 flex items-center justify-center p-4">
                  <img src={reference.image} alt={reference.title.tr || ""} className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal dark:bg-white rounded-md p-1" />
                </div>
              )}
              <div className="p-6 flex-1 space-y-4 flex flex-col justify-center">
                <div className="flex justify-between items-center gap-2">
                  <h3 className="font-extrabold text-[17px] text-card-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {reference.title.tr || reference.title.en}
                  </h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shrink-0 ${
                    reference.isActive 
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {reference.isActive ? "Aktif" : "Pasif"}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-4 bg-muted/30 border-t border-border/50 flex items-center justify-end gap-3 mt-auto">
                <button
                  onClick={() => handleOpenEditModal(reference)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-background border border-border/50 hover:bg-muted rounded-xl text-xs font-bold text-foreground transition-all shadow-sm active:scale-95"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span>Düzenle</span>
                </button>
                <button
                  onClick={() => handleDelete(reference.id)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Sil</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="soft-card overflow-x-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/30 border-b border-border/50 text-muted-foreground text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-5 whitespace-nowrap">Görsel</th>
                <th className="px-6 py-5 whitespace-nowrap">Firma Adı</th>
                <th className="px-6 py-5 whitespace-nowrap">Durum</th>
                <th className="px-6 py-5 whitespace-nowrap text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {references.map((reference) => (
                <tr key={reference.id} className="hover:bg-muted/10 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="h-12 w-24 bg-muted/50 rounded-lg flex items-center justify-center overflow-hidden border border-border/50 p-2">
                      {reference.image ? (
                        <img src={reference.image} alt={reference.title.tr || ""} className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal dark:bg-white rounded-md p-0.5" />
                      ) : (
                        <Layers className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-extrabold text-[15px] text-card-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {reference.title.tr || reference.title.en}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider inline-block ${
                      reference.isActive 
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {reference.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditModal(reference)}
                        className="p-2 hover:bg-muted bg-background border border-border/50 rounded-xl text-muted-foreground hover:text-foreground transition-colors shadow-sm active:scale-95"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(reference.id)}
                        className="p-2 hover:bg-destructive/10 bg-background border border-border/50 rounded-xl text-muted-foreground hover:text-destructive transition-colors shadow-sm active:scale-95"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Editor Modal */}
      {isModalOpen && (
        <AdminEditorModal
          open={isModalOpen}
          title={editingReference ? "Referansı Düzenle" : "Yeni Referans Ekle"}
          description="Referans görselini, görünürlüğünü ve çok dilli firma bilgisini düzenleyin."
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSave}
        >
            <div className="space-y-6">
              
              {/* Image & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <FileUpload
                    label="Görsel Yolu"
                    value={image || ""}
                    onChange={setImage}
                    accept="image/*,video/*"
                    placeholder="/about-facility.png"
                  />
                </div>
                <div className="flex items-center pt-8">
                  <label className="flex items-center gap-3 cursor-pointer select-none group">
                    <div className={`h-5 w-5 rounded border flex items-center justify-center transition-colors ${isActive ? 'bg-primary border-primary' : 'bg-background border-border group-hover:border-primary/50'}`}>
                      {isActive && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
                    </div>
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="hidden"
                    />
                    <span className="text-sm font-bold text-card-foreground">Aktif / Listelensin</span>
                  </label>
                </div>
              </div>

              <AdminLanguageTabs value={activeLang} onChange={setActiveLang} />

              {/* Multilingual inputs */}
              <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                <div>
                  <label className="block text-xs font-black text-foreground uppercase tracking-wider mb-2">Firma Adı ({activeLang})</label>
                  <input
                    type="text"
                    required
                    value={title[activeLang] || ""}
                    onChange={(e) => setTitle({ ...title, [activeLang]: e.target.value })}
                    className="w-full px-4 py-2.5 bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-xl text-[13px] font-medium transition-all"
                  />
                </div>
              </div>
            </div>
        </AdminEditorModal>
      )}
    </AdminPageShell>
  );
}
