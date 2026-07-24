"use client";

import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Globe, 
  HardHat,
  FolderKanban,
  FileText,
  Sun,
  Moon,
  Laptop,
  Home,
  Info,
  Search,
  Type,
  Mail
} from "lucide-react";

import "../globals.css";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, logout, user } = useAuth();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Theme states
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("admin-theme") as "light" | "dark" | "system";
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    if (theme === "system") {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      setResolvedTheme(media.matches ? "dark" : "light");
      
      const listener = (e: MediaQueryListEvent) => {
        setResolvedTheme(e.matches ? "dark" : "light");
      };
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    } else {
      setResolvedTheme(theme);
    }
  }, [theme]);

  useEffect(() => {
    const bodies = document.querySelectorAll(".admin-theme");
    bodies.forEach((body) => {
      body.setAttribute("data-theme", resolvedTheme);
      
      // Add or remove the Tailwind .dark class for mix-blend-mode and other tailwind dark utilities
      if (resolvedTheme === "dark") {
        body.classList.add("dark");
      } else {
        body.classList.remove("dark");
      }
    });
  }, [resolvedTheme]);

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    localStorage.setItem("admin-theme", newTheme);
  };

  if (isLoading) {
    return (
      <html lang="tr">
        <body className="antialiased admin-theme">
          <div className="flex h-screen w-screen items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-sm font-semibold text-muted-foreground">Yükleniyor...</p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  const isLoginPage = pathname === "/admin/login";

  if (!isAuthenticated && !isLoginPage) {
    return null;
  }

  if (isLoginPage) {
    return (
      <html lang="tr">
        <body className="antialiased min-h-screen bg-background admin-theme">
          {children}
        </body>
      </html>
    );
  }

  const menuItems = [
    { name: "Genel Bakış", path: "/admin", icon: LayoutDashboard },
    { name: "Gelen Talepler", path: "/admin/enquiries", icon: Mail },
    { name: "Ürünler", path: "/admin/products", icon: HardHat },
    { name: "Projeler", path: "/admin/projects", icon: FolderKanban },
    { name: "Referanslar", path: "/admin/references", icon: FileText },
    { name: "Anasayfa İçerikleri", path: "/admin/home", icon: Home },
    { name: "Hakkımızda İçerikleri", path: "/admin/about", icon: Info },
    { name: "Ortak Metinler", path: "/admin/common", icon: Type },
    { name: "Ziyaretçiler", path: "/admin/analytics", icon: Globe },
    { name: "SEO Ayarları", path: "/admin/seo", icon: Search },
    { name: "Ayarlar", path: "/admin/settings", icon: Settings },
  ];

  return (
    <html lang="tr" className="h-full">
      <body className="antialiased min-h-full bg-background text-foreground flex admin-theme selection:bg-primary/30">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex flex-col w-[248px] bg-sidebar-bg/95 backdrop-blur-xl text-sidebar-text h-screen fixed left-0 top-0 z-20 border-r border-sidebar-border-custom shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
          {/* Sidebar Header */}
          <div className="h-[72px] flex items-center px-6 border-b border-sidebar-border-custom gap-3">
            <div className="h-9 w-9 bg-primary shadow-sm shadow-primary/20 rounded-xl flex items-center justify-center text-primary-foreground font-bold">
              AC
            </div>
          <div>
            <h1 className="font-bold text-white tracking-tight leading-none text-sm">Atlantis Crane</h1>
            <span className="text-[10px] text-sidebar-text/50 font-medium">Yönetim Paneli</span>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "text-sidebar-text/70 hover:text-white hover:bg-sidebar-hover-bg"
                }`}
              >
                <Icon className={`h-[18px] w-[18px] shrink-0 transition-transform duration-200 ${!isActive && "group-hover:scale-110"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-sidebar-border-custom bg-sidebar-bg/50">
          <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-xl border border-white/5 mb-3 transition-colors hover:bg-white/10">
            <div className="h-9 w-9 bg-white/10 rounded-full flex items-center justify-center font-bold text-white shadow-inner">
              {user?.email?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{user?.email || "Admin"}</p>
              <span className="text-[10px] text-sidebar-text/60 font-medium">Yönetici</span>
            </div>
          </div>
          <button
            onClick={() => void logout()}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-destructive/90 hover:text-destructive hover:bg-destructive/10 transition-colors group"
          >
            <LogOut className="h-[18px] w-[18px] shrink-0 group-hover:-translate-x-1 transition-transform" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* Sidebar - Mobile drawer overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <aside className={`lg:hidden flex flex-col w-[260px] bg-sidebar-bg/95 backdrop-blur-xl text-sidebar-text h-screen fixed left-0 top-0 z-40 transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] border-r border-sidebar-border-custom shadow-2xl ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="h-[72px] flex items-center justify-between px-6 border-b border-sidebar-border-custom">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-primary shadow-sm shadow-primary/20 rounded-xl flex items-center justify-center text-primary-foreground font-bold">
              AC
            </div>
            <div>
              <h1 className="font-bold text-white tracking-tight leading-none text-sm">Atlantis Crane</h1>
              <span className="text-[10px] text-sidebar-text/50 font-medium">Yönetim Paneli</span>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="p-1.5 rounded-md text-sidebar-text/70 hover:text-white hover:bg-white/10 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "text-sidebar-text/70 hover:text-white hover:bg-sidebar-hover-bg"
                }`}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border-custom bg-sidebar-bg/50">
          <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-xl border border-white/5 mb-3">
            <div className="h-9 w-9 bg-white/10 rounded-full flex items-center justify-center font-bold text-white">
              {user?.email?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{user?.email || "Admin"}</p>
              <span className="text-[10px] text-sidebar-text/60">Yönetici</span>
            </div>
          </div>
          <button
            onClick={() => {
              setIsSidebarOpen(false);
              void logout();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-destructive/90 hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen lg:pl-[248px] bg-background">
        {/* Topbar */}
        <header className="h-[72px] bg-card/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 transition-colors duration-200">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
            >
              <Menu className="h-[22px] w-[22px]" />
            </button>
            <div className="text-[15px] font-bold text-foreground hidden sm:flex items-center gap-2">
              <div className="h-4 w-1 bg-primary rounded-full"></div>
              {pathname === "/admin" && "Genel Bakış"}
              {pathname === "/admin/enquiries" && "Gelen Talepler"}
              {pathname === "/admin/products" && "Ürün Yönetimi"}
              {pathname === "/admin/projects" && "Proje Yönetimi"}
              {pathname === "/admin/references" && "Referans Yönetimi"}
              {pathname === "/admin/home" && "Anasayfa İçerikleri"}
              {pathname === "/admin/about" && "Hakkımızda İçerikleri"}
              {pathname === "/admin/seo" && "SEO ve Meta Ayarları"}
              {pathname === "/admin/common" && "Ortak Metinler"}
              {pathname === "/admin/settings" && "Sistem Ayarları"}
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Theme Toggle */}
            <div className="flex items-center bg-muted/40 p-1 rounded-xl border border-border/50 shadow-sm">
              {(["light", "dark", "system"] as const).map((t) => {
                const Icon = t === "light" ? Sun : t === "dark" ? Moon : Laptop;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleThemeChange(t)}
                    title={t === "light" ? "Açık Tema" : t === "dark" ? "Koyu Tema" : "Sistem Teması"}
                    className={`p-1.5 rounded-lg transition-all duration-200 ${
                      theme === t
                        ? "bg-card text-foreground shadow-sm ring-1 ring-border"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                );
              })}
            </div>

            <a 
              href="/" 
              target="_blank" 
              className="flex items-center gap-2 px-3.5 py-2 bg-card border border-border hover:bg-muted/50 hover:border-border/80 rounded-xl text-xs font-semibold text-foreground shadow-sm transition-all duration-200 active:scale-95 group"
            >
              <Globe className="h-[14px] w-[14px] text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="hidden sm:inline">Siteyi Görüntüle</span>
            </a>
          </div>
        </header>

        {/* Dynamic Page Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-both">
            {children}
          </div>
        </main>
      </div>
    </body>
  </html>
);
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  );
}
