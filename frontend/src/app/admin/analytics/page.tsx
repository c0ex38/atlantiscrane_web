"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  Globe,
  Smartphone,
  Monitor
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

export default function AnalyticsAdminPage() {
  const { apiFetch } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        const res = await apiFetch("/analytics/stats") as { data: any };
        setStats(res.data);
      } catch (err) {
        console.error("Stats load error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadStats();
  }, []);

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
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#FF2700] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl animate-in fade-in duration-300">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#DEDAD8] pb-5">
        <div>
          <h2 className="text-2xl font-black text-[#111010] tracking-tight">Ziyaretçi İstatistikleri</h2>
          <p className="text-xs text-[#6F6B69] mt-1">Sitenizi ziyaret eden kullanıcıların cihaz ve IP bilgilerini buradan takip edebilirsiniz.</p>
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

      {/* Chart Section */}
      <div className="bg-white border border-[#DEDAD8] rounded-xl overflow-hidden flex flex-col p-6">
        <h3 className="font-bold text-[#111010] flex items-center gap-2 text-sm uppercase tracking-wide mb-6">
          <Globe className="h-4 w-4 text-[#FF2700]" />
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

      {/* Visitor List */}
      <div className="bg-white border border-[#DEDAD8] rounded-xl overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-[#DEDAD8] flex items-center justify-between bg-[#F2F0EF]/30">
          <h3 className="font-bold text-[#111010] flex items-center gap-2 text-sm uppercase tracking-wide">
            <Globe className="h-4 w-4 text-[#FF2700]" />
            <span>Son 50 Ziyaret</span>
          </h3>
        </div>

        <div className="divide-y divide-[#DEDAD8] overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-xs font-bold text-[#6F6B69] border-b border-[#DEDAD8]">
                <th className="px-6 py-4 font-bold">Cihaz Tipi</th>
                <th className="px-6 py-4 font-bold">IP Adresi</th>
                <th className="px-6 py-4 font-bold">Ziyaret Edilen Sayfa</th>
                <th className="px-6 py-4 font-bold">Tarayıcı (User-Agent)</th>
                <th className="px-6 py-4 font-bold">Tarih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DEDAD8]">
              {stats?.recent && stats.recent.length > 0 ? (
                stats.recent.map((visit: any) => (
                  <tr key={visit.id} className="hover:bg-[#F2F0EF]/30 transition-colors text-sm">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-[#E9E6E4]/40 rounded-full flex items-center justify-center shrink-0">
                          {visit.isMobile ? (
                            <Smartphone className="h-4 w-4 text-[#FF2700]" />
                          ) : (
                            <Monitor className="h-4 w-4 text-[#6F6B69]" />
                          )}
                        </div>
                        <span className="font-semibold text-[#111010]">
                          {visit.isMobile ? "Mobil" : "Masaüstü"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#111010] font-medium">{visit.ip}</td>
                    <td className="px-6 py-4 text-[#6F6B69]">{visit.path}</td>
                    <td className="px-6 py-4 text-[#6F6B69] text-xs max-w-[200px] truncate" title={visit.userAgent}>
                      {visit.userAgent}
                    </td>
                    <td className="px-6 py-4 text-[#6F6B69] text-xs">
                      {new Date(visit.createdAt).toLocaleString("tr-TR")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-[#6F6B69]">
                    Henüz ziyaretçi kaydı bulunmuyor.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
