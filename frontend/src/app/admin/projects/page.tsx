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
  AlertCircle,
  LayoutGrid,
  List,
  Layers
} from "lucide-react";
import { FileUpload } from "../components/FileUpload";

interface Project {
  id: string;
  title: Record<string, string>;
  client?: Record<string, string>;
  category?: Record<string, string>;
  description?: Record<string, string>;
  image?: string;
  isActive: boolean;
  showOnHome: boolean;
}

export default function ProjectsAdminPage() {
  const { apiFetch } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // View State
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Tab State
  const [activeLang, setActiveLang] = useState<"tr" | "en" | "ar">("tr");

  // Form Fields
  const [isActive, setIsActive] = useState(true);
  const [showOnHome, setShowOnHome] = useState(false);
  const [image, setImage] = useState("");
  const [title, setTitle] = useState<Record<string, string>>({ tr: "", en: "", ar: "" });
  const [client, setClient] = useState<Record<string, string>>({ tr: "", en: "", ar: "" });
  const [category, setCategory] = useState<Record<string, string>>({ tr: "", en: "", ar: "" });
  const [description, setDescription] = useState<Record<string, string>>({ tr: "", en: "", ar: "" });

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const res = await apiFetch("/projects") as { data: Project[] };
      setProjects(res.data);
    } catch (e: any) {
      setError(e.message || "Projeler yüklenirken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingProject(null);
    setIsActive(true);
    setShowOnHome(false);
    setImage("/about-facility.png");
    setTitle({ tr: "", en: "", ar: "" });
    setClient({ tr: "", en: "", ar: "" });
    setCategory({ tr: "", en: "", ar: "" });
    setDescription({ tr: "", en: "", ar: "" });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project: Project) => {
    setEditingProject(project);
    setIsActive(project.isActive);
    setShowOnHome(project.showOnHome || false);
    setImage(project.image || "");
    setTitle({ tr: project.title?.tr || "", en: project.title?.en || "", ar: project.title?.ar || "" });
    setClient({ tr: project.client?.tr || "", en: project.client?.en || "", ar: project.client?.ar || "" });
    setCategory({ tr: project.category?.tr || "", en: project.category?.en || "", ar: project.category?.ar || "" });
    setDescription({ tr: project.description?.tr || "", en: project.description?.en || "", ar: project.description?.ar || "" });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const payload = {
      isActive,
      showOnHome,
      image,
      title,
      client,
      category,
      description,
    };

    try {
      if (editingProject) {
        await apiFetch(`/projects/${editingProject.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setSuccess("Proje başarıyla güncellendi.");
      } else {
        await apiFetch("/projects", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setSuccess("Proje başarıyla oluşturuldu.");
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (e: any) {
      setError(e.message || "İşlem gerçekleştirilemedi.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu projeyi silmek istediğinize emin misiniz?")) return;
    setError(null);
    try {
      await apiFetch(`/projects/${id}`, { method: "DELETE" });
      setSuccess("Proje başarıyla silindi.");
      fetchProjects();
    } catch (e: any) {
      setError(e.message || "Silme işlemi başarısız.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h2 className="text-2xl font-black text-foreground tracking-tight">Proje Yönetimi</h2>
          <p className="text-sm text-muted-foreground mt-1">Devreye alınan referans mühendislik projelerini yönetin.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="bg-muted p-1 rounded-xl flex items-center shadow-inner border border-border/50">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-all ${viewMode === "grid" ? "bg-card shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
              title="Kart Görünümü"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition-all ${viewMode === "table" ? "bg-card shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
              title="Tablo Görünümü"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold rounded-xl shadow-md shadow-primary/20 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="h-[18px] w-[18px]" />
            <span>Yeni Proje Ekle</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl text-sm font-medium animate-in slide-in-from-top-2">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl text-sm font-medium animate-in slide-in-from-top-2">
          <Check className="h-5 w-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Projects Display */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="soft-card p-16 text-center">
          <p className="text-[15px] text-muted-foreground font-medium">Henüz kayıtlı proje bulunmuyor.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-300">
          {projects.map((project) => (
            <div 
              key={project.id}
              className="soft-card overflow-hidden hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group"
            >
              <div className="p-6 flex-1 space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-extrabold text-[17px] text-card-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {project.title.tr || project.title.en}
                  </h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shrink-0 ${
                    project.isActive 
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {project.isActive ? "Aktif" : "Pasif"}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <p className="text-[13px] text-card-foreground">
                    <span className="text-muted-foreground font-bold mr-1">Müşteri:</span> {project.client?.tr || project.client?.en || "-"}
                  </p>
                  <p className="text-[13px] text-card-foreground">
                    <span className="text-muted-foreground font-bold mr-1">Kategori:</span> {project.category?.tr || project.category?.en || "-"}
                  </p>
                </div>

                <p className="text-[13px] text-muted-foreground line-clamp-3 leading-relaxed mt-2 pt-4 border-t border-border/50">
                  {project.description?.tr || project.description?.en || "Açıklama bulunmuyor."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-4 bg-muted/30 border-t border-border/50 flex items-center justify-end gap-3">
                <button
                  onClick={() => handleOpenEditModal(project)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-background border border-border/50 hover:bg-muted rounded-xl text-xs font-bold text-foreground transition-all shadow-sm active:scale-95"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span>Düzenle</span>
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
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
                <th className="px-6 py-5 whitespace-nowrap">Proje Adı</th>
                <th className="px-6 py-5 whitespace-nowrap">Müşteri / Kategori</th>
                <th className="px-6 py-5 whitespace-nowrap">Durum</th>
                <th className="px-6 py-5 whitespace-nowrap text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-muted/10 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="h-12 w-12 bg-muted/50 rounded-xl flex items-center justify-center overflow-hidden border border-border/50">
                      {project.image ? (
                        <img src={project.image} alt={project.title.tr || ""} className="h-full w-full object-cover mix-blend-multiply dark:mix-blend-normal" />
                      ) : (
                        <Layers className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-extrabold text-[15px] text-card-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {project.title.tr || project.title.en}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-card-foreground font-bold text-sm">{project.client?.tr || "-"}</p>
                    <p className="text-muted-foreground text-xs mt-1">{project.category?.tr || "-"}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider inline-block ${
                      project.isActive 
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {project.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditModal(project)}
                        className="p-2 hover:bg-muted bg-background border border-border/50 rounded-xl text-muted-foreground hover:text-foreground transition-colors shadow-sm active:scale-95"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="soft-card border-none w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border/50 flex items-center justify-between bg-card/50 backdrop-blur-xl">
              <h3 className="text-xl font-black text-card-foreground tracking-tight">
                {editingProject ? "Projeyi Düzenle" : "Yeni Proje Ekle"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              
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
                <div className="flex flex-col gap-4 pt-8">
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
                  
                  <label className="flex items-center gap-3 cursor-pointer select-none group">
                    <div className={`h-5 w-5 rounded border flex items-center justify-center transition-colors ${showOnHome ? 'bg-primary border-primary' : 'bg-background border-border group-hover:border-primary/50'}`}>
                      {showOnHome && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
                    </div>
                    <input
                      type="checkbox"
                      checked={showOnHome}
                      onChange={(e) => setShowOnHome(e.target.checked)}
                      className="hidden"
                    />
                    <span className="text-sm font-bold text-card-foreground">Anasayfada Göster</span>
                  </label>
                </div>
              </div>

              {/* Language Tabs */}
              <div className="border-b border-border/50">
                <div className="flex gap-2">
                  {(["tr", "en", "ar"] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setActiveLang(lang)}
                      className={`px-5 py-3 text-[13px] font-black uppercase tracking-widest border-b-2 transition-all ${
                        activeLang === lang
                          ? "border-primary text-primary"
                          : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-t-lg"
                      }`}
                    >
                      {lang === "tr" ? "Türkçe" : lang === "en" ? "English" : "العربية (Arabic)"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Multilingual inputs */}
              <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-foreground uppercase tracking-wider mb-2">Proje Adı ({activeLang})</label>
                    <input
                      type="text"
                      required
                      value={title[activeLang] || ""}
                      onChange={(e) => setTitle({ ...title, [activeLang]: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-xl text-[13px] font-medium transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-foreground uppercase tracking-wider mb-2">Müşteri ({activeLang})</label>
                    <input
                      type="text"
                      value={client[activeLang] || ""}
                      onChange={(e) => setClient({ ...client, [activeLang]: e.target.value })}
                      placeholder="Örn: National Marine"
                      className="w-full px-4 py-2.5 bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-xl text-[13px] font-medium transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-foreground uppercase tracking-wider mb-2">Kategori ({activeLang})</label>
                  <input
                    type="text"
                    value={category[activeLang] || ""}
                    onChange={(e) => setCategory({ ...category, [activeLang]: e.target.value })}
                    placeholder="Örn: Liman & Altyapı"
                    className="w-full px-4 py-2.5 bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-xl text-[13px] font-medium transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-foreground uppercase tracking-wider mb-2">Açıklama ({activeLang})</label>
                  <textarea
                    rows={4}
                    value={description[activeLang] || ""}
                    onChange={(e) => setDescription({ ...description, [activeLang]: e.target.value })}
                    className="w-full px-4 py-2.5 bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-xl text-[13px] font-medium transition-all"
                  />
                </div>
              </div>
            </form>

            <div className="p-6 border-t border-border/50 bg-muted/30 flex items-center justify-end gap-3 rounded-b-2xl">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 border border-border bg-card hover:bg-muted rounded-xl text-[13px] font-bold text-foreground transition-all shadow-sm active:scale-95"
              >
                İptal
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-[13px] font-bold rounded-xl shadow-md shadow-primary/20 transition-all active:scale-95 cursor-pointer"
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
