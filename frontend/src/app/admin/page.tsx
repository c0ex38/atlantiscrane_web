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
  Monitor
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const { user, apiFetch } = useAuth();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await apiFetch("/analytics/stats") as { data: any };
        setStats(res.data);
      } catch (err) {
        console.error("Stats load error:", err);
      }
    };
    loadStats();
  }, []);

  const metrics = [
    {
      title: "Toplam Ziyaret",
      value: stats?.total || 0,
      change: "Tüm zamanlar",
      trend: "up",
      icon: Globe,
    },
    {
      title: "Mobil Cihazlar",
      value: stats?.mobile || 0,
      change: "Tüm zamanlar",
      trend: "up",
      icon: Smartphone,
    },
    {
      title: "Masaüstü",
      value: stats?.desktop || 0,
      change: "Tüm zamanlar",
      trend: "up",
      icon: Monitor,
    },
  ];

  const recentEnquiries = [
    {
      id: 1,
      sender: "Yasin Gemi İnşaat",
      email: "info@yasingemi.com.tr",
      product: "Teleskopik Gemi Vinci",
      date: "Bugün, 09:41",
      status: "Yeni",
    },
    {
      id: 2,
      sender: "Marintek Marine",
      email: "procurement@marintek.ae",
      product: "Katlanır Bomlu Güverte Vinci",
      date: "Dün, 16:20",
      status: "Okundu",
    },
    {
      id: 3,
      sender: "Tuzla Tersanesi A.Ş.",
      email: "teklif@tuzlashipyard.com",
      product: "Özel Tasarım Kreyn",
      date: "09 Temmuz, 11:30",
      status: "Okundu",
    },
  ];

  const systemLogs = [
    {
      id: 1,
      event: "Yeni ürün eklendi: Knuckle Boom Crane 15T",
      user: "info@atlantiscrane.com",
      time: "2 saat önce",
    },
    {
      id: 2,
      event: "İngilizce referans metinleri güncellendi",
      user: "info@atlantiscrane.com",
      time: "Dün, 14:15",
    },
    {
      id: 3,
      event: "Sistem ayarlarında SEO açıklaması değiştirildi",
      user: "info@atlantiscrane.com",
      time: "08 Temmuz, 10:05",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner (Welcome message) */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white border border-[#DEDAD8] p-6 rounded-xl">
        <div>
          <h2 className="text-xl font-bold text-[#111010] flex items-center gap-2">
            Hoş geldin, <span className="text-[#FF2700]">{user?.email || "Yönetici"}</span> 👋
          </h2>
          <p className="text-xs text-[#6F6B69] mt-1">
            Atlantis Crane web sitesinin içerik ve teklif yönetim paneline buradan erişebilirsiniz.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF2700] hover:bg-[#DB2100] text-white rounded-lg text-xs font-bold shadow-sm shadow-[#FF2700]/15 active:scale-[0.98] transition-all duration-150 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Yeni Ürün Ekle</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div 
              key={i}
              className="bg-white border border-[#DEDAD8] rounded-xl p-6 flex justify-between items-start"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#6F6B69] uppercase tracking-wide">
                  {metric.title}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-[#111010] tracking-tight">
                    {metric.value}
                  </span>
                  <span className="text-[10px] font-semibold text-[#168A4A] flex items-center gap-0.5 bg-[#E3F4EA] px-1.5 py-0.5 rounded-full">
                    {metric.change}
                  </span>
                </div>
              </div>
              <div className="h-10 w-10 bg-[#FFE5DF] text-[#FF2700] rounded-lg flex items-center justify-center">
                <Icon className="h-5 w-5 shrink-0" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Columns */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Recent Enquiries Card */}
        <div className="bg-white border border-[#DEDAD8] rounded-xl overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-[#DEDAD8] flex items-center justify-between">
            <h3 className="font-bold text-[#111010] flex items-center gap-2 text-sm uppercase tracking-wide">
              <Mail className="h-4 w-4 text-[#FF2700]" />
              <span>Son Gelen Teklif Talepleri</span>
            </h3>
            <span className="text-xs font-semibold text-[#FF2700] hover:underline cursor-pointer">
              Tümünü Gör
            </span>
          </div>

          <div className="divide-y divide-[#DEDAD8] flex-1">
            {recentEnquiries.map((enquiry) => (
              <div 
                key={enquiry.id}
                className="p-6 hover:bg-[#F2F0EF]/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#111010]">{enquiry.sender}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      enquiry.status === "Yeni"
                        ? "bg-[#FFE5DF] text-[#FF2700]"
                        : "bg-[#E9E6E4] text-[#6F6B69]"
                    }`}>
                      {enquiry.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#6F6B69]">{enquiry.email}</p>
                  <p className="text-xs text-[#111010] font-semibold mt-1">
                    Ürün: <span className="text-[#FF2700]">{enquiry.product}</span>
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[11px] font-medium text-[#9B9795] block">{enquiry.date}</span>
                  <button className="mt-2 text-xs font-bold text-[#FF2700] border border-[#FF2700]/20 hover:bg-[#FFE5DF]/40 px-3 py-1 rounded-md transition-colors">
                    Detay
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Activity Logs Card */}
        <div className="bg-white border border-[#DEDAD8] rounded-xl overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-[#DEDAD8] flex items-center justify-between">
            <h3 className="font-bold text-[#111010] flex items-center gap-2 text-sm uppercase tracking-wide">
              <History className="h-4 w-4 text-[#FF2700]" />
              <span>Son Panel Aktiviteleri</span>
            </h3>
            <span className="text-xs font-semibold text-[#FF2700] hover:underline cursor-pointer">
              Tümünü Gör
            </span>
          </div>

          <div className="divide-y divide-[#DEDAD8] flex-1">
            {systemLogs.map((log) => (
              <div 
                key={log.id}
                className="p-6 hover:bg-[#F2F0EF]/30 transition-colors flex items-start gap-4"
              >
                <div className="h-8 w-8 bg-[#E9E6E4]/40 rounded-full flex items-center justify-center shrink-0">
                  <UserCheck className="h-4 w-4 text-[#6F6B69]" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[#111010]">
                    {log.event}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-[#6F6B69]">
                    <span>{log.user}</span>
                    <span>•</span>
                    <span>{log.time}</span>
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
