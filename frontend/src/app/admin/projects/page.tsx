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
    <AdminPageShell>
      <AdminPageHeader
        title="Proje Yönetimi"
        description="Devreye alınan referans mühendislik projelerini yönetin."
        actions={<>
          <AdminViewToggle value={viewMode} onChange={setViewMode} />
          <button
            type="button"
            onClick={handleOpenAddModal}
            className={adminPrimaryButtonClass}
          >
            <Plus className="h-[18px] w-[18px]" />
            <span>Yeni Proje Ekle</span>
          </button>
        </>}
      />

      {/* Notifications */}
      {error && <AdminNotice type="error">{error}</AdminNotice>}
      {success && <AdminNotice type="success">{success}</AdminNotice>}

      {/* Projects Display */}
      {isLoading ? (
        <AdminLoadingState label="Projeler yükleniyor..." />
      ) : projects.length === 0 ? (
        <AdminEmptyState title="Henüz kayıtlı proje bulunmuyor." description="İlk proje kaydını oluşturmak için Yeni Proje Ekle butonunu kullanın." />
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
                        <img src={project.image} alt={project.title.tr || ""} className="h-full w-full object-cover mix-blend-multiply dark:mix-blend-normal dark:bg-white rounded-md p-0.5" />
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
        <AdminEditorModal
          open={isModalOpen}
          title={editingProject ? "Projeyi Düzenle" : "Yeni Proje Ekle"}
          description="Proje görselini, görünürlüğünü ve üç dilde yayınlanacak bilgileri düzenleyin."
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSave}
        >
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
                {/* Left Column: Image & Settings */}
                <div className="space-y-5">
                  {/* Image Card */}
                  <div className="bg-card p-5 rounded-2xl border border-border/50 shadow-sm">
                    <FileUpload
                      label="Proje Görseli"
                      value={image || ""}
                      onChange={setImage}
                      accept="image/*,video/*"
                      placeholder="/about-facility.png"
                    />
                  </div>

                  {/* Settings Card */}
                  <div className="bg-card p-5 rounded-2xl border border-border/50 shadow-sm space-y-5">
                    <h4 className="text-xs font-black text-muted-foreground uppercase tracking-wider border-b border-border/50 pb-2">Görünürlük Ayarları</h4>
                    
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
                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Proje Adı</label>
                        <input
                          type="text"
                          required
                          value={title[activeLang] || ""}
                          onChange={(e) => setTitle({ ...title, [activeLang]: e.target.value })}
                          className="w-full px-4 py-2.5 bg-muted/30 border border-border focus:border-primary focus:bg-background outline-none rounded-xl text-[14px] font-bold transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Müşteri</label>
                        <input
                          type="text"
                          value={client[activeLang] || ""}
                          onChange={(e) => setClient({ ...client, [activeLang]: e.target.value })}
                          placeholder="Örn: National Marine"
                          className="w-full px-4 py-2.5 bg-muted/30 border border-border focus:border-primary focus:bg-background outline-none rounded-xl text-[13px] transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Kategori</label>
                        <input
                          type="text"
                          value={category[activeLang] || ""}
                          onChange={(e) => setCategory({ ...category, [activeLang]: e.target.value })}
                          placeholder="Örn: Liman & Altyapı"
                          className="w-full px-4 py-2.5 bg-muted/30 border border-border focus:border-primary focus:bg-background outline-none rounded-xl text-[13px] transition-all"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Açıklama</label>
                        <textarea
                          rows={5}
                          value={description[activeLang] || ""}
                          onChange={(e) => setDescription({ ...description, [activeLang]: e.target.value })}
                          className="w-full px-4 py-3 bg-muted/30 border border-border focus:border-primary focus:bg-background outline-none rounded-xl text-[13px] transition-all resize-y leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
        </AdminEditorModal>
      )}
    </AdminPageShell>
  );
}
