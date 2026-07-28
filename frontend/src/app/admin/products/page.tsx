"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Layers, 
  TrendingUp, 
  Check,
} from "lucide-react";
import { FileUpload } from "../components/FileUpload";
import { AdminEditorModal, AdminEmptyState, AdminLanguageTabs, AdminLoadingState, AdminNotice, AdminPageHeader, AdminPageShell, AdminViewToggle, adminPrimaryButtonClass } from "../components/AdminUI";

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
  showOnHome: boolean;
}

export default function ProductsAdminPage() {
  const { apiFetch } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // View State
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Tabs for Multilingual fields
  const [activeLang, setActiveLang] = useState<"tr" | "en" | "ar">("tr");

  // Form Fields
  const [slug, setSlug] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [showOnHome, setShowOnHome] = useState(false);
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
    setShowOnHome(false);
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
    setShowOnHome(product.showOnHome || false);
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
      showOnHome,
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
    <AdminPageShell>
      <AdminPageHeader
        title="Ürün Yönetimi"
        description="Gemi ve offshore kreyn ürün gruplarını yönetin."
        actions={<>
          <AdminViewToggle value={viewMode} onChange={setViewMode} />
          <button
            type="button"
            onClick={handleOpenAddModal}
            className={adminPrimaryButtonClass}
          >
            <Plus className="h-[18px] w-[18px]" />
            <span>Yeni Ürün Ekle</span>
          </button>
        </>}
      />

      {/* Notifications */}
      {error && <AdminNotice type="error">{error}</AdminNotice>}
      {success && <AdminNotice type="success">{success}</AdminNotice>}

      {/* Products Display */}
      {isLoading ? (
        <AdminLoadingState label="Ürünler yükleniyor..." />
      ) : products.length === 0 ? (
        <AdminEmptyState title="Henüz kayıtlı ürün bulunmuyor." description="İlk ürün kaydını oluşturmak için Yeni Ürün Ekle butonunu kullanın." />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-300">
          {products.map((product) => (
            <div 
              key={product.id}
              className="soft-card overflow-hidden hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group"
            >
              {/* Product Header Card */}
              <div className="p-6 flex-1 space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-extrabold text-[17px] text-card-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {product.title.tr || product.title.en}
                  </h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shrink-0 ${
                    product.isActive 
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {product.isActive ? "Aktif" : "Pasif"}
                  </span>
                </div>
                
                <p className="text-xs text-muted-foreground font-mono">Slug: {product.slug}</p>
                <p className="text-[13px] text-card-foreground/80 line-clamp-3 leading-relaxed font-medium">
                  {product.shortIntro?.tr || product.shortIntro?.en}
                </p>
                
                <div className="grid grid-cols-2 gap-4 pt-4 text-xs border-t border-border/50 mt-auto">
                  <div>
                    <span className="text-muted-foreground block mb-1 uppercase tracking-wider text-[10px] font-bold">Kapasite</span>
                    <strong className="text-card-foreground font-bold text-sm">{product.capacity?.tr || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1 uppercase tracking-wider text-[10px] font-bold">Bom Erişimi</span>
                    <strong className="text-card-foreground font-bold text-sm">{product.outreach?.tr || "-"}</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-4 bg-muted/30 border-t border-border/50 flex items-center justify-end gap-3">
                <button
                  onClick={() => handleOpenEditModal(product)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-background border border-border/50 hover:bg-muted rounded-xl text-xs font-bold text-foreground transition-all shadow-sm active:scale-95"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span>Düzenle</span>
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
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
                <th className="px-6 py-5 whitespace-nowrap">Başlık & Slug</th>
                <th className="px-6 py-5 whitespace-nowrap">Kapasite / Erişim</th>
                <th className="px-6 py-5 whitespace-nowrap">Durum</th>
                <th className="px-6 py-5 whitespace-nowrap text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-muted/10 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="h-12 w-12 bg-muted/50 rounded-xl flex items-center justify-center overflow-hidden border border-border/50">
                      {product.image ? (
                        <img src={product.image} alt={product.slug} className="h-full w-full object-cover mix-blend-multiply dark:mix-blend-normal dark:bg-white rounded-md" />
                      ) : (
                        <Layers className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-extrabold text-[15px] text-card-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {product.title.tr || product.title.en}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono mt-1">{product.slug}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-card-foreground font-bold text-sm">{product.capacity?.tr || "-"}</p>
                    <p className="text-muted-foreground text-xs mt-1">{product.outreach?.tr || "-"}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider inline-block ${
                      product.isActive 
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {product.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditModal(product)}
                        className="p-2 hover:bg-muted bg-background border border-border/50 rounded-xl text-muted-foreground hover:text-foreground transition-colors shadow-sm active:scale-95"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
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
          title={editingProduct ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
          description="Ürünün temel ayarlarını ve üç dilde gösterilecek içeriklerini düzenleyin."
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSave}
        >
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
                {/* Left Column: Image & Settings */}
                <div className="space-y-5">
                  {/* Image Card */}
                  <div className="bg-card p-5 rounded-2xl border border-border/50 shadow-sm">
                    <FileUpload
                      label="Ürün Görseli"
                      value={image || ""}
                      onChange={setImage}
                      accept="image/*,video/*"
                      placeholder="/about-facility.png"
                    />
                  </div>

                  {/* Settings Card */}
                  <div className="bg-card p-5 rounded-2xl border border-border/50 shadow-sm space-y-5">
                    <h4 className="text-xs font-black text-muted-foreground uppercase tracking-wider border-b border-border/50 pb-2">Temel Ayarlar</h4>
                    
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-2">Slug (URL Uzantısı)</label>
                      <input
                        type="text"
                        required
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="orn-8-ton-katlanir-vinch"
                        className="w-full px-3 py-2.5 bg-muted/30 border border-border focus:border-primary focus:bg-background outline-none rounded-xl text-[13px] transition-all font-mono"
                      />
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                      <label className="flex items-center gap-3 cursor-pointer group p-2 -mx-2 hover:bg-muted/50 rounded-xl transition-colors">
                        <div className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all ${isActive ? 'bg-primary border-primary shadow-sm shadow-primary/20' : 'bg-background border-border group-hover:border-primary/50'}`}>
                          {isActive && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
                        </div>
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={(e) => setIsActive(e.target.checked)}
                          className="hidden"
                        />
                        <span className="text-sm font-bold text-foreground">Aktif (Sitede Görünsün)</span>
                      </label>
                      
                      <label className="flex items-center gap-3 cursor-pointer group p-2 -mx-2 hover:bg-muted/50 rounded-xl transition-colors">
                        <div className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all ${showOnHome ? 'bg-primary border-primary shadow-sm shadow-primary/20' : 'bg-background border-border group-hover:border-primary/50'}`}>
                          {showOnHome && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
                        </div>
                        <input
                          type="checkbox"
                          checked={showOnHome}
                          onChange={(e) => setShowOnHome(e.target.checked)}
                          className="hidden"
                        />
                        <span className="text-sm font-bold text-foreground">Anasayfada Öne Çıkar</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Right Column: Multilingual Data */}
                <div className="min-w-0 space-y-5">
                  <AdminLanguageTabs value={activeLang} onChange={setActiveLang} />

                  {/* Localized Form Fields */}
                  <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Ürün Başlığı</label>
                        <input
                          type="text"
                          required
                          value={title[activeLang] || ""}
                          onChange={(e) => setTitle({ ...title, [activeLang]: e.target.value })}
                          className="w-full px-4 py-2.5 bg-muted/30 border border-border focus:border-primary focus:bg-background outline-none rounded-xl text-[14px] font-bold transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Kapasite Metni</label>
                        <input
                          type="text"
                          value={capacity[activeLang] || ""}
                          onChange={(e) => setCapacity({ ...capacity, [activeLang]: e.target.value })}
                          placeholder="Örn: 1.5 - 25 Ton"
                          className="w-full px-4 py-2.5 bg-muted/30 border border-border focus:border-primary focus:bg-background outline-none rounded-xl text-[13px] transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Erişim Metni</label>
                        <input
                          type="text"
                          value={outreach[activeLang] || ""}
                          onChange={(e) => setOutreach({ ...outreach, [activeLang]: e.target.value })}
                          placeholder="Örn: 6 - 24 Metre"
                          className="w-full px-4 py-2.5 bg-muted/30 border border-border focus:border-primary focus:bg-background outline-none rounded-xl text-[13px] transition-all"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Kısa Tanıtım</label>
                        <textarea
                          rows={2}
                          value={shortIntro[activeLang] || ""}
                          onChange={(e) => setShortIntro({ ...shortIntro, [activeLang]: e.target.value })}
                          className="w-full px-4 py-3 bg-muted/30 border border-border focus:border-primary focus:bg-background outline-none rounded-xl text-[13px] transition-all resize-none leading-relaxed"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Açıklama</label>
                        <textarea
                          rows={4}
                          value={description[activeLang] || ""}
                          onChange={(e) => setDescription({ ...description, [activeLang]: e.target.value })}
                          className="w-full px-4 py-3 bg-muted/30 border border-border focus:border-primary focus:bg-background outline-none rounded-xl text-[13px] transition-all resize-y leading-relaxed"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Kullanım / Uygulamalar</label>
                        <textarea
                          rows={2}
                          value={usage[activeLang] || ""}
                          onChange={(e) => setUsage({ ...usage, [activeLang]: e.target.value })}
                          className="w-full px-4 py-3 bg-muted/30 border border-border focus:border-primary focus:bg-background outline-none rounded-xl text-[13px] transition-all resize-none leading-relaxed"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Öne Çıkan Özellikler</label>
                          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">Her satıra bir özellik</span>
                        </div>
                        <textarea
                          rows={4}
                          value={featuresText[activeLang] || ""}
                          onChange={(e) => setFeaturesText({ ...featuresText, [activeLang]: e.target.value })}
                          placeholder="Hidrolik çalışma sistemi sağlar.&#10;Katlanabilir bom yapısına sahiptir."
                          className="w-full px-4 py-3 bg-muted/30 border border-border focus:border-primary focus:bg-background outline-none rounded-xl text-[13px] font-mono transition-all resize-y leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Load Chart Points */}
                  <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-border/50 pb-4">
                      <h4 className="text-[13px] font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                        <TrendingUp className="h-[18px] w-[18px] text-primary" />
                        <span>Yük Kapasite Eğrisi (Load Chart)</span>
                      </h4>
                      <button
                        type="button"
                        onClick={handleAddLoadChartRow}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-primary/30 hover:bg-primary/10 text-primary text-xs font-bold rounded-lg transition-all shadow-sm active:scale-95"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Nokta Ekle</span>
                      </button>
                    </div>

                    {loadChart.length === 0 ? (
                      <div className="bg-muted/30 border border-dashed border-border/50 rounded-xl p-6 text-center">
                        <p className="text-[13px] text-muted-foreground font-medium italic">Kapasite eğrisi tanımlanmadı. Grafik çizilmeyecektir.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {loadChart.map((point, idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-muted/20 p-3 rounded-xl border border-border/50 shadow-sm group hover:border-primary/50 transition-colors">
                            <div className="flex-1 space-y-2.5">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase w-16">Erişim:</span>
                                <input
                                  type="text"
                                  required
                                  placeholder="örn: 2.50 m"
                                  value={point.outreach}
                                  onChange={(e) => handleLoadChartChange(idx, "outreach", e.target.value)}
                                  className="flex-1 px-3 py-1.5 text-xs bg-background border border-border focus:border-primary rounded-lg outline-none transition-all"
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase w-16">Kapasite:</span>
                                <input
                                  type="text"
                                  required
                                  placeholder="örn: 3200 kg"
                                  value={point.capacity}
                                  onChange={(e) => handleLoadChartChange(idx, "capacity", e.target.value)}
                                  className="flex-1 px-3 py-1.5 text-xs bg-background border border-border focus:border-primary rounded-lg outline-none transition-all"
                                />
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveLoadChartRow(idx)}
                              className="text-destructive/50 hover:text-destructive hover:bg-destructive/10 p-2.5 rounded-xl transition-colors border border-transparent hover:border-destructive/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
        </AdminEditorModal>
      )}
    </AdminPageShell>
  );
}
