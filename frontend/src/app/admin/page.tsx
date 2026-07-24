"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import { 
  HardHat, 
  FolderKanban, 
  MessageSquare, 
  TrendingUp, 
  Plus, 
  History,
  Mail,
  UserCheck,
  Globe,
  Smartphone,
  Monitor,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const { user, apiFetch } = useAuth();
  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([]);
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const statsRes = await apiFetch("/analytics/stats") as { data: any };
        setStats(statsRes.data);

        const enquiriesRes = await apiFetch("/enquiries/recent") as { data: any[] };
        setRecentEnquiries(enquiriesRes.data);

        const productsRes = await apiFetch("/products") as { data: any[] };
        // Just take the first 3 for recent products
        setRecentProducts(productsRes.data.slice(0, 3));
      } catch (err) {
        console.error("Dashboard data load error:", err);
      }
    };
    loadData();
  }, []);

  const metrics = [
    {
      title: "Toplam Ürün",
      value: stats?.totalProducts || 0,
      change: "Aktif ürünler",
      trend: "up",
      icon: HardHat,
    },
    {
      title: "Toplam Proje",
      value: stats?.totalProjects || 0,
      change: "Aktif projeler",
      trend: "up",
      icon: FolderKanban,
    },
    {
      title: "Ziyaretçi Sayısı",
      value: stats?.total || 0,
      change: "Tüm zamanlar",
      trend: "up",
      icon: Globe,
    },
  ];

  const handleMarkAsRead = async (id: string) => {
    try {
      await apiFetch(`/enquiries/${id}/read`, { method: 'PATCH' });
      setRecentEnquiries(prev => 
        prev.map(e => e.id === id ? { ...e, isRead: true } : e)
      );
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* Top Banner (Welcome message) */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-card border border-border p-6 rounded-2xl shadow-sm relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10">
          <h2 className="text-xl sm:text-2xl font-extrabold text-card-foreground flex items-center gap-2 tracking-tight">
            Hoş geldin, <span className="text-primary">{user?.email || "Yönetici"}</span> 👋
          </h2>
          <p className="text-[13px] sm:text-sm text-muted-foreground mt-1.5 font-medium max-w-xl leading-relaxed">
            Atlantis Crane web sitesinin içerik ve teklif yönetim paneline buradan erişebilirsiniz. Sol menüyü kullanarak işlemleri gerçekleştirebilirsiniz.
          </p>
        </div>
        <div className="flex gap-3 relative z-10">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-[13px] font-bold shadow-md shadow-primary/20 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <Plus className="h-[18px] w-[18px]" />
            <span>Yeni Ürün Ekle</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {metrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div 
              key={i}
              className="bg-card border border-border rounded-2xl p-6 flex justify-between items-start shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group cursor-default"
            >
              <div className="space-y-3">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {metric.title}
                </span>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-4xl font-black text-card-foreground tracking-tighter">
                    {metric.value}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    <TrendingUp className="w-3 h-3" />
                    {metric.change}
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/15 transition-all duration-300">
                <Icon className="h-6 w-6 shrink-0" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Columns */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
        
        {/* Recent Enquiries Card */}
        <div className="bg-card border border-border rounded-2xl shadow-sm flex flex-col hover:shadow-md transition-shadow duration-300">
          <div className="px-6 py-5 border-b border-border flex items-center justify-between">
            <h3 className="font-extrabold text-card-foreground flex items-center gap-2 text-sm uppercase tracking-wider">
              <Mail className="h-4 w-4 text-primary" />
              <span>Son Gelen Teklif Talepleri</span>
            </h3>
            <span className="text-xs font-bold text-primary hover:text-primary/80 hover:underline cursor-pointer transition-colors flex items-center gap-1">
              Tümünü Gör <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>

          <div className="divide-y divide-border flex-1">
            {recentEnquiries.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">Henüz gelen talep yok.</div>
            ) : recentEnquiries.map((enquiry) => (
              <div 
                key={enquiry.id}
                className="p-6 hover:bg-muted/50 transition-colors duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-[14px] text-card-foreground group-hover:text-primary transition-colors">{enquiry.name}</span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full tracking-wide ${
                      !enquiry.isRead
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {!enquiry.isRead ? "Yeni" : "Okundu"}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">{enquiry.email}</p>
                  {enquiry.subject && (
                    <p className="text-xs text-card-foreground font-semibold mt-1 bg-background px-2 py-1 rounded-md inline-block border border-border">
                      Konu: <span className="text-primary">{enquiry.subject}</span>
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{enquiry.message}</p>
                </div>
                <div className="text-right shrink-0 flex flex-col items-end gap-2">
                  <span className="text-[11px] font-semibold text-muted-foreground block">
                    {new Date(enquiry.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {!enquiry.isRead && (
                    <button 
                      onClick={() => handleMarkAsRead(enquiry.id)}
                      className="text-xs font-bold text-primary border border-primary/20 hover:bg-primary/10 px-4 py-1.5 rounded-lg transition-colors active:scale-95"
                    >
                      Okundu İşaretle
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Activity Logs Card */}
        <div className="bg-card border border-border rounded-2xl shadow-sm flex flex-col hover:shadow-md transition-shadow duration-300">
          <div className="px-6 py-5 border-b border-border flex items-center justify-between">
            <h3 className="font-extrabold text-card-foreground flex items-center gap-2 text-sm uppercase tracking-wider">
              <History className="h-4 w-4 text-primary" />
              <span>Son Eklenen Ürünler</span>
            </h3>
          </div>

          <div className="divide-y divide-border flex-1">
            {recentProducts.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">Kayıtlı ürün bulunmuyor.</div>
            ) : recentProducts.map((product) => (
              <div 
                key={product.id}
                className="p-6 hover:bg-muted/50 transition-colors duration-200 flex items-start gap-4 group"
              >
                <div className="h-9 w-9 bg-muted border border-border rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
                  <HardHat className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="space-y-1">
                  <p className="text-[13px] font-bold text-card-foreground leading-snug">
                    Yeni ürün eklendi: {product.title?.tr || product.title?.en || product.slug}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
                    <span>Admin</span>
                    <span className="text-border/80">•</span>
                    <span>{new Date(product.createdAt || Date.now()).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

