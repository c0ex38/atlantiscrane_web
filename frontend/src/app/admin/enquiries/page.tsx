"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  Mail, 
  Trash2, 
  Check, 
  AlertCircle,
  Clock,
  LayoutGrid,
  List
} from "lucide-react";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function EnquiriesAdminPage() {
  const { apiFetch } = useAuth();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  useEffect(() => {
    fetchEnquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEnquiries = async () => {
    setIsLoading(true);
    try {
      const res = await apiFetch("/enquiries") as { data: Enquiry[] };
      setEnquiries(res.data);
    } catch (e: any) {
      setError(e.message || "Talepler yüklenirken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await apiFetch(`/enquiries/${id}/read`, { method: "PATCH" });
      setSuccess("Talep okundu olarak işaretlendi.");
      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, isRead: true } : e))
      );
    } catch (e: any) {
      setError(e.message || "İşlem gerçekleştirilemedi.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu talebi kalıcı olarak silmek istediğinize emin misiniz?")) return;
    setError(null);
    try {
      await apiFetch(`/enquiries/${id}`, { method: "DELETE" });
      setSuccess("Talep başarıyla silindi.");
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
    } catch (e: any) {
      setError(e.message || "Silme işlemi başarısız.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h2 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
            <Mail className="h-6 w-6 text-primary" />
            Gelen Talepler
          </h2>
          <p className="text-sm text-muted-foreground mt-1">İletişim formundan gelen mesajları ve teklif taleplerini yönetin.</p>
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

      {/* Display */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : enquiries.length === 0 ? (
        <div className="soft-card p-16 text-center">
          <p className="text-[15px] text-muted-foreground font-medium">Henüz gelen bir talep bulunmuyor.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-300">
          {enquiries.map((enquiry) => (
            <div 
              key={enquiry.id}
              className={`soft-card overflow-hidden transition-all duration-300 flex flex-col h-full group ${!enquiry.isRead ? 'border-primary/40 ring-1 ring-primary/20 shadow-md shadow-primary/5' : ''}`}
            >
              <div className="p-6 flex-1 space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-extrabold text-[17px] text-card-foreground group-hover:text-primary transition-colors">
                    {enquiry.name}
                  </h3>
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shrink-0 ${
                    !enquiry.isRead 
                      ? "bg-primary/10 text-primary" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {!enquiry.isRead ? "Yeni Mesaj" : "Okundu"}
                  </span>
                </div>
                
                <p className="text-sm font-medium text-muted-foreground border-b border-border/50 pb-3">{enquiry.email}</p>
                
                {enquiry.subject && (
                  <p className="text-[13px] font-bold text-foreground">
                    Konu: <span className="text-primary">{enquiry.subject}</span>
                  </p>
                )}
                
                <div className="text-[13px] text-card-foreground/80 leading-relaxed font-medium bg-muted/30 p-3 rounded-xl border border-border/50">
                  {enquiry.message}
                </div>
                
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground pt-2">
                  <Clock className="h-3.5 w-3.5" />
                  {new Date(enquiry.createdAt).toLocaleString('tr-TR')}
                </div>
              </div>

              <div className="px-6 py-4 bg-muted/30 border-t border-border/50 flex items-center justify-end gap-3">
                {!enquiry.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(enquiry.id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-xl text-xs font-bold text-primary transition-all shadow-sm active:scale-95"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Okundu İşaretle</span>
                  </button>
                )}
                <button
                  onClick={() => handleDelete(enquiry.id)}
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
                <th className="px-6 py-5 whitespace-nowrap">Gönderen</th>
                <th className="px-6 py-5 whitespace-nowrap">Konu / Mesaj</th>
                <th className="px-6 py-5 whitespace-nowrap">Tarih</th>
                <th className="px-6 py-5 whitespace-nowrap">Durum</th>
                <th className="px-6 py-5 whitespace-nowrap text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {enquiries.map((enquiry) => (
                <tr key={enquiry.id} className={`hover:bg-muted/10 transition-colors group ${!enquiry.isRead ? 'bg-primary/5' : ''}`}>
                  <td className="px-6 py-4">
                    <p className="font-extrabold text-[15px] text-card-foreground group-hover:text-primary transition-colors">
                      {enquiry.name}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium mt-1">{enquiry.email}</p>
                  </td>
                  <td className="px-6 py-4 max-w-md">
                    {enquiry.subject && (
                      <p className="text-card-foreground font-bold text-sm line-clamp-1">{enquiry.subject}</p>
                    )}
                    <p className="text-muted-foreground text-xs mt-1 line-clamp-2">{enquiry.message}</p>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-muted-foreground">
                    {new Date(enquiry.createdAt).toLocaleString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider inline-block ${
                      !enquiry.isRead 
                        ? "bg-primary/10 text-primary" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {!enquiry.isRead ? "Yeni Mesaj" : "Okundu"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {!enquiry.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(enquiry.id)}
                          title="Okundu İşaretle"
                          className="p-2 hover:bg-primary/10 bg-background border border-border/50 rounded-xl text-primary transition-colors shadow-sm active:scale-95"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(enquiry.id)}
                        title="Sil"
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
    </div>
  );
}
