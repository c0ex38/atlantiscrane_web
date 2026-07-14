"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Layers, 
  TrendingUp, 
  Check, 
  AlertCircle 
} from "lucide-react";
import { FileUpload } from "../components/FileUpload";

interface Product {
  id: string;
  slug: string;
  title: Record<string, string>;
  shortIntro?: Record<string, string>;
  description?: Record<string, string>;
  usage?: Record<string, string>;
  capacity?: Record<string, string>;
  outreach?: Record<string, string>;
  features?: Record<string, string[]>;
  loadChart?: { outreach: string; capacity: string }[];
  image?: string;
  isActive: boolean;
}

export default function ProductsAdminPage() {
  const { apiFetch } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Tabs for Multilingual fields
  const [activeLang, setActiveLang] = useState<"tr" | "en" | "ar">("tr");

  // Form Fields
  const [slug, setSlug] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [image, setImage] = useState("");
  const [title, setTitle] = useState<Record<string, string>>({ tr: "", en: "", ar: "" });
  const [shortIntro, setShortIntro] = useState<Record<string, string>>({ tr: "", en: "", ar: "" });
  const [description, setDescription] = useState<Record<string, string>>({ tr: "", en: "", ar: "" });
  const [usage, setUsage] = useState<Record<string, string>>({ tr: "", en: "", ar: "" });
  const [capacity, setCapacity] = useState<Record<string, string>>({ tr: "", en: "", ar: "" });
  const [outreach, setOutreach] = useState<Record<string, string>>({ tr: "", en: "", ar: "" });
  
  // Array inputs mapped as dynamic textareas (split by lines)
  const [featuresText, setFeaturesText] = useState<Record<string, string>>({ tr: "", en: "", ar: "" });

  // Load Chart Points
  const [loadChart, setLoadChart] = useState<{ outreach: string; capacity: string }[]>([]);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await apiFetch("/products") as { data: Product[] };
      setProducts(res.data);
    } catch (e: any) {
      setError(e.message || "Ürünler yüklenirken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setSlug("");
    setIsActive(true);
    setImage("/about-facility.png");
    setTitle({ tr: "", en: "", ar: "" });
    setShortIntro({ tr: "", en: "", ar: "" });
    setDescription({ tr: "", en: "", ar: "" });
    setUsage({ tr: "", en: "", ar: "" });
    setCapacity({ tr: "", en: "", ar: "" });
    setOutreach({ tr: "", en: "", ar: "" });
    setFeaturesText({ tr: "", en: "", ar: "" });
    setLoadChart([]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setSlug(product.slug);
    setIsActive(product.isActive);
    setImage(product.image || "");
    setTitle({ tr: product.title.tr || "", en: product.title.en || "", ar: product.title.ar || "" });
    setShortIntro({ 
      tr: product.shortIntro?.tr || "", 
      en: product.shortIntro?.en || "", 
      ar: product.shortIntro?.ar || "" 
    });
    setDescription({ 
      tr: product.description?.tr || "", 
      en: product.description?.en || "", 
      ar: product.description?.ar || "" 
    });
    setUsage({ 
      tr: product.usage?.tr || "", 
      en: product.usage?.en || "", 
      ar: product.usage?.ar || "" 
    });
    setCapacity({ 
      tr: product.capacity?.tr || "", 
      en: product.capacity?.en || "", 
      ar: product.capacity?.ar || "" 
    });
    setOutreach({ 
      tr: product.outreach?.tr || "", 
      en: product.outreach?.en || "", 
      ar: product.outreach?.ar || "" 
    });
    
    // Map array features to textarea lines
    const featTr = product.features?.tr?.join("\n") || "";
    const featEn = product.features?.en?.join("\n") || "";
    const featAr = product.features?.ar?.join("\n") || "";
    setFeaturesText({ tr: featTr, en: featEn, ar: featAr });

    setLoadChart(product.loadChart || []);
    setIsModalOpen(true);
  };

  const handleAddLoadChartRow = () => {
    setLoadChart([...loadChart, { outreach: "", capacity: "" }]);
  };

  const handleRemoveLoadChartRow = (idx: number) => {
    setLoadChart(loadChart.filter((_, i) => i !== idx));
  };

  const handleLoadChartChange = (idx: number, field: "outreach" | "capacity", val: string) => {
    const updated = [...loadChart];
    updated[idx][field] = val;
    setLoadChart(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Format features back to arrays
    const formattedFeatures = {
      tr: featuresText.tr.split("\n").map(l => l.trim()).filter(Boolean),
      en: featuresText.en.split("\n").map(l => l.trim()).filter(Boolean),
      ar: featuresText.ar.split("\n").map(l => l.trim()).filter(Boolean),
    };

    const payload = {
      slug,
      isActive,
      image,
      title,
      shortIntro,
      description,
      usage,
      capacity,
      outreach,
      features: formattedFeatures,
      loadChart: loadChart.filter(point => point.outreach && point.capacity),
    };

    try {
      if (editingProduct) {
        await apiFetch(`/products/${editingProduct.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setSuccess("Ürün başarıyla güncellendi.");
      } else {
        await apiFetch("/products", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setSuccess("Ürün başarıyla oluşturuldu.");
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (e: any) {
      setError(e.message || "İşlem gerçekleştirilemedi.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    setError(null);
    try {
      await apiFetch(`/products/${id}`, { method: "DELETE" });
      setSuccess("Ürün başarıyla silindi.");
      fetchProducts();
    } catch (e: any) {
      setError(e.message || "Silme işlemi başarısız.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#DEDAD8] pb-5">
        <div>
          <h2 className="text-2xl font-black text-[#111010] tracking-tight">Ürün Yönetimi</h2>
          <p className="text-xs text-[#6F6B69] mt-1">Gemi ve offshore kreyn ürün gruplarını yönetin.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#FF2700] hover:bg-[#D62000] text-white text-sm font-bold rounded-lg shadow-lg shadow-[#FF2700]/15 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Yeni Ürün Ekle</span>
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

      {/* Products Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#FF2700] border-t-transparent"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white border border-[#DEDAD8] rounded-2xl p-12 text-center">
          <p className="text-sm text-[#6F6B69] font-medium">Henüz kayıtlı ürün bulunmuyor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map((product) => (
            <div 
              key={product.id}
              className="bg-white border border-[#DEDAD8] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
            >
              {/* Product Header Card */}
              <div className="p-6 flex-1 space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-extrabold text-lg text-[#111010] line-clamp-1">{product.title.tr || product.title.en}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                    product.isActive 
                      ? "bg-green-100 text-green-800" 
                      : "bg-gray-100 text-gray-500"
                  }`}>
                    {product.isActive ? "Aktif" : "Pasif"}
                  </span>
                </div>
                
                <p className="text-xs text-[#6F6B69] font-mono">Slug: {product.slug}</p>
                <p className="text-sm text-[#3E3B3A] line-clamp-3 leading-relaxed">
                  {product.shortIntro?.tr || product.shortIntro?.en}
                </p>
                
                <div className="grid grid-cols-2 gap-4 pt-2 text-xs border-t border-[#F2F0EF]">
                  <div>
                    <span className="text-[#9B9795] block mb-0.5">Kapasite</span>
                    <strong className="text-[#111010] font-bold">{product.capacity?.tr || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-[#9B9795] block mb-0.5">Bom Erişimi</span>
                    <strong className="text-[#111010] font-bold">{product.outreach?.tr || "-"}</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-4 bg-[#F8F6F5] border-t border-[#DEDAD8] flex items-center justify-end gap-3">
                <button
                  onClick={() => handleOpenEditModal(product)}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-[#DEDAD8] hover:bg-[#E9E6E4] rounded-lg text-xs font-bold text-[#3E3B3A] transition-colors"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span>Düzenle</span>
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
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
          <div className="bg-white border border-[#DEDAD8] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#DEDAD8] flex items-center justify-between">
              <h3 className="text-lg font-black text-[#111010]">
                {editingProduct ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-[#F2F0EF] rounded-lg text-[#6F6B69] hover:text-[#111010] transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Base Metadata Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-black text-[#3E3B3A] uppercase tracking-wider mb-2">Slug</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="8-ton-katlanir-vinch"
                    className="w-full px-3 py-2 border border-[#DEDAD8] focus:border-[#FF2700] focus:ring-1 focus:ring-[#FF2700] outline-none rounded-lg text-sm"
                  />
                </div>
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

              {/* Language Tabs Selector */}
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

              {/* Multilingual Text Inputs */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-black text-[#3E3B3A] uppercase tracking-wider mb-2">Başlık ({activeLang})</label>
                    <input
                      type="text"
                      required
                      value={title[activeLang] || ""}
                      onChange={(e) => setTitle({ ...title, [activeLang]: e.target.value })}
                      className="w-full px-3 py-2 border border-[#DEDAD8] outline-none rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-[#3E3B3A] uppercase tracking-wider mb-2">Kapasite Metni ({activeLang})</label>
                    <input
                      type="text"
                      value={capacity[activeLang] || ""}
                      onChange={(e) => setCapacity({ ...capacity, [activeLang]: e.target.value })}
                      placeholder="1.5 - 25 Ton"
                      className="w-full px-3 py-2 border border-[#DEDAD8] outline-none rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-[#3E3B3A] uppercase tracking-wider mb-2">Erişim Metni ({activeLang})</label>
                    <input
                      type="text"
                      value={outreach[activeLang] || ""}
                      onChange={(e) => setOutreach({ ...outreach, [activeLang]: e.target.value })}
                      placeholder="6 - 24 Metre"
                      className="w-full px-3 py-2 border border-[#DEDAD8] outline-none rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#3E3B3A] uppercase tracking-wider mb-2">Kısa Tanıtım ({activeLang})</label>
                  <textarea
                    rows={2}
                    value={shortIntro[activeLang] || ""}
                    onChange={(e) => setShortIntro({ ...shortIntro, [activeLang]: e.target.value })}
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

                <div>
                  <label className="block text-xs font-black text-[#3E3B3A] uppercase tracking-wider mb-2">Kullanım / Uygulamalar ({activeLang})</label>
                  <textarea
                    rows={2}
                    value={usage[activeLang] || ""}
                    onChange={(e) => setUsage({ ...usage, [activeLang]: e.target.value })}
                    className="w-full px-3 py-2 border border-[#DEDAD8] outline-none rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-[#3E3B3A] uppercase tracking-wider mb-2">
                    Öne Çıkan Özellikler ({activeLang}) <span className="text-[10px] text-[#9B9795] font-medium">(Her satıra bir özellik yazın)</span>
                  </label>
                  <textarea
                    rows={4}
                    value={featuresText[activeLang] || ""}
                    onChange={(e) => setFeaturesText({ ...featuresText, [activeLang]: e.target.value })}
                    placeholder="Hidrolik çalışma sistemi sağlar.&#10;Katlanabilir bom yapısına sahiptir."
                    className="w-full px-3 py-2 border border-[#DEDAD8] outline-none rounded-lg text-sm font-mono"
                  />
                </div>
              </div>

              {/* Load Chart Points */}
              <div className="border-t border-[#DEDAD8] pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-[#3E3B3A] uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-[#FF2700]" />
                    <span>Yük Kapasite Eğrisi (Load Chart)</span>
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddLoadChartRow}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-[#FF2700] hover:bg-[#FF2700]/5 text-[#FF2700] text-xs font-bold rounded-lg transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Nokta Ekle</span>
                  </button>
                </div>

                {loadChart.length === 0 ? (
                  <p className="text-xs text-[#9B9795] italic">Kapasite eğrisi tanımlanmadı. Grafik veritabanından çizilmeyecektir.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {loadChart.map((point, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-[#F8F6F5] p-3 rounded-lg border border-[#DEDAD8]">
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            required
                            placeholder="Erişim (örn: 2.50 m)"
                            value={point.outreach}
                            onChange={(e) => handleLoadChartChange(idx, "outreach", e.target.value)}
                            className="w-full px-2.5 py-1 text-xs border border-[#DEDAD8] rounded outline-none"
                          />
                          <input
                            type="text"
                            required
                            placeholder="Kapasite (örn: 3200 kg)"
                            value={point.capacity}
                            onChange={(e) => handleLoadChartChange(idx, "capacity", e.target.value)}
                            className="w-full px-2.5 py-1 text-xs border border-[#DEDAD8] rounded outline-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveLoadChartRow(idx)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </form>

            {/* Modal Actions */}
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
