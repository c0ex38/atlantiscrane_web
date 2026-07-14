"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Check, 
  AlertCircle 
} from "lucide-react";
import { FileUpload } from "../components/FileUpload";

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
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#DEDAD8] pb-5">
        <div>
          <h2 className="text-2xl font-black text-[#111010] tracking-tight">Referans Yönetimi</h2>
          <p className="text-xs text-[#6F6B69] mt-1">Gemi inşa ve global vinç teslimat referanslarını yönetin.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#FF2700] hover:bg-[#D62000] text-white text-sm font-bold rounded-lg shadow-lg shadow-[#FF2700]/15 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Yeni Referans Ekle</span>
        </button>
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

      {/* Listing Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#FF2700] border-t-transparent"></div>
        </div>
      ) : references.length === 0 ? (
        <div className="bg-white border border-[#DEDAD8] rounded-2xl p-12 text-center">
          <p className="text-sm text-[#6F6B69] font-medium">Henüz kayıtlı referans bulunmuyor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {references.map((reference) => (
            <div 
              key={reference.id}
              className="bg-white border border-[#DEDAD8] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
            >
              <div className="p-6 flex-1 space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-extrabold text-lg text-[#111010] line-clamp-1">{reference.title.tr || reference.title.en}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                    reference.isActive 
                      ? "bg-green-100 text-green-800" 
                      : "bg-gray-100 text-gray-500"
                  }`}>
                    {reference.isActive ? "Aktif" : "Pasif"}
                  </span>
                </div>
                
                <div className="space-y-1.5">
                  <p className="text-xs text-[#3E3B3A]">
                    <span className="text-[#9B9795] font-bold">Müşteri:</span> {reference.client?.tr || reference.client?.en}
                  </p>
                  <p className="text-xs text-[#3E3B3A]">
                    <span className="text-[#9B9795] font-bold">Kategori:</span> {reference.category?.tr || reference.category?.en}
                  </p>
                </div>

                <p className="text-sm text-[#6F6B69] line-clamp-3 leading-relaxed">
                  {reference.description?.tr || reference.description?.en}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-4 bg-[#F8F6F5] border-t border-[#DEDAD8] flex items-center justify-end gap-3">
                <button
                  onClick={() => handleOpenEditModal(reference)}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-[#DEDAD8] hover:bg-[#E9E6E4] rounded-lg text-xs font-bold text-[#3E3B3A] transition-colors"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span>Düzenle</span>
                </button>
                <button
                  onClick={() => handleDelete(reference.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Sil</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#DEDAD8] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b border-[#DEDAD8] flex items-center justify-between">
              <h3 className="text-lg font-black text-[#111010]">
                {editingReference ? "Referansı Düzenle" : "Yeni Referans Ekle"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-[#F2F0EF] rounded-lg text-[#6F6B69] hover:text-[#111010] transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
              
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
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="h-5 w-5 rounded border-[#DEDAD8] text-[#FF2700] focus:ring-[#FF2700]"
                    />
                    <span className="text-sm font-bold text-[#111010]">Aktif / Listelensin</span>
                  </label>
                </div>
              </div>

              {/* Language Tabs */}
              <div className="border-b border-[#DEDAD8]">
                <div className="flex gap-2">
                  {(["tr", "en", "ar"] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setActiveLang(lang)}
                      className={`px-4 py-2.5 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${
                        activeLang === lang
                          ? "border-[#FF2700] text-[#FF2700]"
                          : "border-transparent text-[#9B9795] hover:text-[#3E3B3A]"
                      }`}
                    >
                      {lang === "tr" ? "Türkçe" : lang === "en" ? "English" : "العربية (Arabic)"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Multilingual inputs */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-[#3E3B3A] uppercase tracking-wider mb-2">Referans Başlığı ({activeLang})</label>
                    <input
                      type="text"
                      required
                      value={title[activeLang] || ""}
                      onChange={(e) => setTitle({ ...title, [activeLang]: e.target.value })}
                      className="w-full px-3 py-2 border border-[#DEDAD8] outline-none rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-[#3E3B3A] uppercase tracking-wider mb-2">Müşteri ({activeLang})</label>
                    <input
                      type="text"
                      value={client[activeLang] || ""}
                      onChange={(e) => setClient({ ...client, [activeLang]: e.target.value })}
                      placeholder="Örn: National Marine"
                      className="w-full px-3 py-2 border border-[#DEDAD8] outline-none rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#3E3B3A] uppercase tracking-wider mb-2">Kategori ({activeLang})</label>
                  <input
                    type="text"
                    value={category[activeLang] || ""}
                    onChange={(e) => setCategory({ ...category, [activeLang]: e.target.value })}
                    placeholder="Örn: Liman & Altyapı"
                    className="w-full px-3 py-2 border border-[#DEDAD8] outline-none rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-[#3E3B3A] uppercase tracking-wider mb-2">Açıklama ({activeLang})</label>
                  <textarea
                    rows={4}
                    value={description[activeLang] || ""}
                    onChange={(e) => setDescription({ ...description, [activeLang]: e.target.value })}
                    className="w-full px-3 py-2 border border-[#DEDAD8] outline-none rounded-lg text-sm"
                  />
                </div>
              </div>
            </form>

            <div className="p-6 border-t border-[#DEDAD8] bg-[#F8F6F5] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-[#DEDAD8] hover:bg-[#E9E6E4] rounded-lg text-sm font-bold text-[#3E3B3A] transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2 bg-[#FF2700] hover:bg-[#D62000] text-white text-sm font-bold rounded-lg transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Kaydet</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
