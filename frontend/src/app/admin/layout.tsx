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
  Search
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
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#FF2700] border-t-transparent"></div>
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
    { name: "Ürünler", path: "/admin/products", icon: HardHat },
    { name: "Projeler", path: "/admin/projects", icon: FolderKanban },
    { name: "Referanslar", path: "/admin/references", icon: FileText },
    { name: "Anasayfa İçerikleri", path: "/admin/home", icon: Home },
    { name: "Hakkımızda İçerikleri", path: "/admin/about", icon: Info },
    { name: "Ziyaretçiler", path: "/admin/analytics", icon: Globe },
    { name: "SEO Ayarları", path: "/admin/seo", icon: Search },
    { name: "Ayarlar", path: "/admin/settings", icon: Settings },
  ];

  return (
    <html lang="tr" className="h-full">
      <body className="antialiased min-h-full bg-background text-foreground flex admin-theme">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex flex-col w-[248px] bg-sidebar-bg text-sidebar-text h-screen fixed left-0 top-0 z-20 border-r border-sidebar-border-custom">
          {/* Sidebar Header */}
          <div className="h-[72px] flex items-center px-6 border-b border-sidebar-border-custom gap-3">
            <div className="h-9 w-9 bg-[#FF2700] rounded-md flex items-center justify-center text-white font-bold">
              AC
            </div>
          <div>
            <h1 className="font-bold text-white tracking-tight leading-none text-sm">Atlantis Crane</h1>
            <span className="text-[10px] text-[#6F6B69]">Yönetim Paneli</span>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? "bg-[#FF2700] text-white shadow-lg shadow-[#FF2700]/15"
                    : "text-sidebar-text/70 hover:text-white hover:bg-sidebar-hover-bg"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-sidebar-border-custom bg-sidebar-bg">
          <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-lg mb-2">
            <div className="h-9 w-9 bg-white/10 rounded-full flex items-center justify-center font-bold text-white">
              {user?.email?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user?.email || "Admin"}</p>
              <span className="text-[10px] text-sidebar-text/60">Yönetici</span>
            </div>
          </div>
          <button
            onClick={() => void logout()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* Sidebar - Mobile drawer overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 z-30 transition-opacity duration-200"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <aside className={`lg:hidden flex flex-col w-[248px] bg-sidebar-bg text-sidebar-text h-screen fixed left-0 top-0 z-40 transition-transform duration-200 ease-out border-r border-sidebar-border-custom ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="h-[72px] flex items-center justify-between px-6 border-b border-sidebar-border-custom">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-[#FF2700] rounded-md flex items-center justify-center text-white font-bold">
              AC
            </div>
            <div>
              <h1 className="font-bold text-white tracking-tight leading-none text-sm">Atlantis Crane</h1>
              <span className="text-[10px] text-sidebar-text/60">Yönetim Paneli</span>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="text-sidebar-text/70 hover:text-white">
            <X className="h-6 w-6" />
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
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? "bg-[#FF2700] text-white"
                    : "text-sidebar-text/70 hover:text-white hover:bg-sidebar-hover-bg"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border-custom bg-sidebar-bg">
          <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-lg mb-2">
            <div className="h-9 w-9 bg-white/10 rounded-full flex items-center justify-center font-bold text-white">
              {user?.email?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user?.email || "Admin"}</p>
              <span className="text-[10px] text-sidebar-text/60">Yönetici</span>
            </div>
          </div>
          <button
            onClick={() => {
              setIsSidebarOpen(false);
              void logout();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen lg:pl-[248px]">
        {/* Topbar */}
        <header className="h-[72px] bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-10 transition-colors duration-150">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-1 text-foreground hover:bg-muted rounded-md transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="text-sm font-bold text-foreground hidden sm:block">
              {pathname === "/admin" && "Genel Bakış"}
              {pathname === "/admin/products" && "Ürün Yönetimi"}
              {pathname === "/admin/projects" && "Proje Yönetimi"}
              {pathname === "/admin/references" && "Referans Yönetimi"}
              {pathname === "/admin/home" && "Anasayfa İçerikleri"}
              {pathname === "/admin/about" && "Hakkımızda İçerikleri"}
              {pathname === "/admin/seo" && "SEO ve Meta Ayarları"}
              {pathname === "/admin/settings" && "Sistem Ayarları"}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <div className="flex items-center bg-muted/60 p-0.5 rounded-lg border border-border">
              {(["light", "dark", "system"] as const).map((t) => {
                const Icon = t === "light" ? Sun : t === "dark" ? Moon : Laptop;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleThemeChange(t)}
                    title={t === "light" ? "Açık Tema" : t === "dark" ? "Koyu Tema" : "Sistem Teması"}
                    className={`p-1.5 rounded-md transition-all ${
                      theme === t
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </button>
                );
              })}
            </div>

            <a 
              href="/" 
              target="_blank" 
              className="flex items-center gap-2 px-3 py-1.5 border border-border hover:bg-muted rounded-lg text-xs font-semibold text-foreground transition-all duration-150"
            >
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span>Siteyi Görüntüle</span>
            </a>
          </div>
        </header>

        {/* Dynamic Page Container */}
        <main className="flex-1 p-6 sm:p-8 max-w-[1600px] w-full mx-auto">
          {children}
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
