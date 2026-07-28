"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  BarChart3,
  ChevronLeft,
  ChevronRight,
  FileText,
  Globe,
  Smartphone,
  Monitor,
  MousePointerClick,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { AdminLoadingState, AdminNotice, AdminPageHeader, AdminPageShell } from "../components/AdminUI";

type AnalyticsTab = "overview" | "pages" | "visits";

type Visit = {
  id: string;
  ip?: string;
  path?: string;
  userAgent?: string;
  isMobile: boolean;
  createdAt: string;
};

type PageStat = {
  path: string;
  visits: number;
  mobile: number;
  desktop: number;
  percentage: number;
  lastVisit?: string;
};

type AnalyticsStats = {
  total: number;
  mobile: number;
  desktop: number;
  recent: Visit[];
  pageStats: PageStat[];
  chartData: { date: string; visits: number }[];
};

const tabs: { id: AnalyticsTab; label: string; icon: typeof Globe }[] = [
  { id: "overview", label: "Genel Bakış", icon: BarChart3 },
  { id: "pages", label: "Sayfalar", icon: FileText },
  { id: "visits", label: "Son Ziyaretler", icon: MousePointerClick },
];

const pageSize = 10;

function getPageName(path: string) {
  const cleanPath = path.split("?")[0].replace(/^\/(tr|en|ar)(?=\/|$)/, "") || "/";
  if (cleanPath === "/") return "Ana Sayfa";
  if (cleanPath === "/about") return "Hakkımızda";
  if (cleanPath === "/products") return "Ürünler";
  if (cleanPath === "/projects") return "Projeler";
  if (cleanPath === "/contact") return "İletişim";

  return cleanPath
    .split("/")
    .filter(Boolean)
    .map((part) => decodeURIComponent(part).replace(/-/g, " "))
    .join(" / ");
}

export default function AnalyticsAdminPage() {
  const { apiFetch } = useAuth();
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("overview");
  const [visitPage, setVisitPage] = useState(1);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        setError("");
        const res = await apiFetch("/analytics/stats") as { data: AnalyticsStats };
        setStats(res.data);
      } catch (err) {
        console.error("Stats load error:", err);
        setError(err instanceof Error ? err.message : "Ziyaretçi istatistikleri yüklenemedi.");
      } finally {
        setIsLoading(false);
      }
    };
    loadStats();
  }, [apiFetch]);

  const paginatedVisits = useMemo(() => {
    const start = (visitPage - 1) * pageSize;
    return (stats?.recent || []).slice(start, start + pageSize);
  }, [stats?.recent, visitPage]);
  const totalVisitPages = Math.max(1, Math.ceil((stats?.recent?.length || 0) / pageSize));

  const metrics = [
    {
      title: "Toplam Ziyaret",
      value: stats?.total || 0,
      change: "Tüm zamanlar",
      icon: Globe,
    },
    {
      title: "Mobil Cihazlar",
      value: stats?.mobile || 0,
      change: "Tüm zamanlar",
      icon: Smartphone,
    },
    {
      title: "Masaüstü",
      value: stats?.desktop || 0,
      change: "Tüm zamanlar",
      icon: Monitor,
    },
  ];

  if (isLoading) {
    return <AdminLoadingState label="Ziyaretçi istatistikleri yükleniyor..." />;
  }

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Ziyaretçi İstatistikleri"
        description="Trafiği genel görünüm, sayfa performansı ve tekil ziyaret kayıtları üzerinden inceleyin."
      />

      {error && <AdminNotice type="error">{error}</AdminNotice>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div 
              key={i}
            className="bg-card border border-border rounded-2xl p-6 flex justify-between items-start shadow-sm"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  {metric.title}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-card-foreground tracking-tight">
                    {metric.value}
                  </span>
                  <span className="text-[10px] font-semibold text-[#168A4A] flex items-center gap-0.5 bg-[#E3F4EA] px-1.5 py-0.5 rounded-full">
                    {metric.change}
                  </span>
                </div>
              </div>
              <div className="h-10 w-10 bg-[#FFE5DF] text-primary rounded-lg flex items-center justify-center">
                <Icon className="h-5 w-5 shrink-0" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-1 overflow-x-auto rounded-xl border border-border/70 bg-muted/40 p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-card text-card-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className={`h-4 w-4 ${activeTab === tab.id ? "text-primary" : ""}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "overview" && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col p-6 shadow-sm">
          <h3 className="font-bold text-card-foreground flex items-center gap-2 text-sm uppercase tracking-wide mb-6">
            <Globe className="h-4 w-4 text-primary" />
            <span>Son 30 Günün Ziyaretçi Trendi</span>
          </h3>
          <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={stats?.chartData || []}
              margin={{ top: 5, right: 30, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F2F0EF" vertical={false} />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#6F6B69' }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#6F6B69' }}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #DEDAD8', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ fontWeight: 'bold', color: '#111010', marginBottom: '4px' }}
                itemStyle={{ color: '#FF2700', fontSize: '14px', fontWeight: 'bold' }}
              />
              <Line 
                type="monotone" 
                dataKey="visits" 
                stroke="#FF2700" 
                strokeWidth={3}
                dot={{ r: 4, fill: '#FF2700', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#FF2700', stroke: '#FFE5DF', strokeWidth: 4 }}
                name="Ziyaret"
              />
            </LineChart>
          </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === "pages" && (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border bg-muted/20 px-6 py-5">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-card-foreground">
              <FileText className="h-4 w-4 text-primary" />
              Sayfa Performansı
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">En çok görüntülenen sayfalar ve cihaz dağılımları.</p>
          </div>
          <div className="divide-y divide-border">
            {(stats?.pageStats || []).length > 0 ? stats?.pageStats.map((page) => (
              <div key={page.path} className="grid gap-4 px-6 py-5 transition-colors hover:bg-muted/20 md:grid-cols-[minmax(0,1fr)_100px_180px] md:items-center">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-bold text-card-foreground">{getPageName(page.path)}</span>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">%{page.percentage}</span>
                  </div>
                  <p className="mt-1 truncate font-mono text-[11px] text-muted-foreground">{page.path}</p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(page.percentage, 1)}%` }} />
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-black text-card-foreground">{page.visits}</p>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Görüntülenme</p>
                </div>
                <div className="flex gap-2">
                  <span className="flex flex-1 items-center gap-1.5 rounded-lg bg-muted/60 px-3 py-2 text-xs font-semibold text-muted-foreground">
                    <Monitor className="h-3.5 w-3.5" /> {page.desktop}
                  </span>
                  <span className="flex flex-1 items-center gap-1.5 rounded-lg bg-muted/60 px-3 py-2 text-xs font-semibold text-muted-foreground">
                    <Smartphone className="h-3.5 w-3.5" /> {page.mobile}
                  </span>
                </div>
              </div>
            )) : (
              <div className="px-6 py-14 text-center text-sm text-muted-foreground">Henüz sayfa görüntüleme kaydı bulunmuyor.</div>
            )}
          </div>
        </div>
      )}

      {activeTab === "visits" && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col shadow-sm">
          <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-muted/20">
            <div>
              <h3 className="font-bold text-card-foreground flex items-center gap-2 text-sm uppercase tracking-wide">
                <MousePointerClick className="h-4 w-4 text-primary" />
                <span>Son Ziyaretler</span>
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">Son 50 kaydın 10’ar satırlık görünümü.</p>
            </div>
          </div>
          <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-card text-xs font-bold text-muted-foreground border-b border-border">
                <th className="px-6 py-4 font-bold">Cihaz Tipi</th>
                <th className="px-6 py-4 font-bold">IP Adresi</th>
                <th className="px-6 py-4 font-bold">Ziyaret Edilen Sayfa</th>
                <th className="px-6 py-4 font-bold">Tarayıcı (User-Agent)</th>
                <th className="px-6 py-4 font-bold">Tarih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DEDAD8]">
              {paginatedVisits.length > 0 ? (
                paginatedVisits.map((visit) => (
                  <tr key={visit.id} className="hover:bg-muted/30 transition-colors text-sm">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-[#E9E6E4]/40 rounded-full flex items-center justify-center shrink-0">
                          {visit.isMobile ? (
                            <Smartphone className="h-4 w-4 text-primary" />
                          ) : (
                            <Monitor className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <span className="font-semibold text-card-foreground">
                          {visit.isMobile ? "Mobil" : "Masaüstü"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-card-foreground font-medium">{visit.ip}</td>
                    <td className="px-6 py-4 text-muted-foreground">{visit.path}</td>
                    <td className="px-6 py-4 text-muted-foreground text-xs max-w-[200px] truncate" title={visit.userAgent}>
                      {visit.userAgent}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-xs">
                      {new Date(visit.createdAt).toLocaleString("tr-TR")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-muted-foreground">
                    Henüz ziyaretçi kaydı bulunmuyor.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
          {(stats?.recent?.length || 0) > pageSize && (
            <div className="flex items-center justify-between border-t border-border bg-muted/20 px-6 py-4">
              <p className="text-xs text-muted-foreground">
                {stats?.recent.length} kayıttan {(visitPage - 1) * pageSize + 1}–{Math.min(visitPage * pageSize, stats?.recent.length || 0)}
              </p>
              <div className="flex items-center gap-2">
                <button type="button" aria-label="Önceki sayfa" disabled={visitPage === 1} onClick={() => setVisitPage((page) => page - 1)} className="rounded-lg border border-border bg-card p-2 text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="min-w-16 text-center text-xs font-bold text-card-foreground">{visitPage} / {totalVisitPages}</span>
                <button type="button" aria-label="Sonraki sayfa" disabled={visitPage === totalVisitPages} onClick={() => setVisitPage((page) => page + 1)} className="rounded-lg border border-border bg-card p-2 text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </AdminPageShell>
  );
}
