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
  Mail,
  ChevronRight,
  MessageSquare,
  Phone,
  Layers
} from "lucide-react";

import "../globals.css";

const menuGroups = [
  {
    label: "Genel",
    items: [
      { name: "Genel Bakış", path: "/admin", icon: LayoutDashboard },
      { name: "Gelen Talepler", path: "/admin/enquiries", icon: MessageSquare },
      { name: "Ziyaretçiler", path: "/admin/analytics", icon: Globe },
    ]
  },
  {
    label: "İçerikler",
    items: [
      { name: "Ürünler", path: "/admin/products", icon: HardHat },
      { name: "Projeler", path: "/admin/projects", icon: FolderKanban },
      { name: "Referanslar", path: "/admin/references", icon: FileText },
    ]
  },
  {
    label: "Sayfa Metinleri",
    items: [
      { name: "Anasayfa", path: "/admin/home", icon: Home },
      { name: "Hakkımızda", path: "/admin/about", icon: Info },
      { name: "İletişim", path: "/admin/contact", icon: Phone },
      { name: "Ürün Metinleri", path: "/admin/product-texts", icon: Layers },
      { name: "Ortak Metinler", path: "/admin/common", icon: Type },
    ]
  },
  {
    label: "Sistem",
    items: [
      { name: "SEO Ayarları", path: "/admin/seo", icon: Search },
      { name: "Ayarlar", path: "/admin/settings", icon: Settings },
    ]
  }
];

const pageTitle: Record<string, string> = {
  "/admin": "Genel Bakış",
  "/admin/enquiries": "Gelen Talepler",
  "/admin/products": "Ürün Yönetimi",
  "/admin/product-texts": "Ürün Detay Metinleri",
  "/admin/projects": "Proje Yönetimi",
  "/admin/references": "Referans Yönetimi",
  "/admin/home": "Anasayfa İçerikleri",
  "/admin/about": "Hakkımızda İçerikleri",
  "/admin/contact": "İletişim İçerikleri",
  "/admin/seo": "SEO ve Meta Ayarları",
  "/admin/common": "Ortak Metinler",
  "/admin/settings": "Sistem Ayarları",
  "/admin/analytics": "Ziyaretçi İstatistikleri",
};

function SidebarContent({ 
  user, 
  pathname, 
  onLinkClick, 
  onLogout 
}: { 
  user: any; 
  pathname: string; 
  onLinkClick?: () => void; 
  onLogout: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-[68px] border-b border-white/8 shrink-0">
        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white font-black text-xs shadow-lg shadow-primary/40 shrink-0">
          AC
        </div>
        <div className="min-w-0">
          <p className="text-white font-bold text-[13px] leading-tight truncate">Atlantis Crane</p>
          <p className="text-white/40 text-[10px] font-medium">Yönetim Paneli</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 custom-scrollbar">
        {menuGroups.map((group) => (
          <div key={group.label}>
            <p className="text-[9px] font-black text-white/25 uppercase tracking-[0.15em] px-3 mb-1.5">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={onLinkClick}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 group relative ${
                      isActive
                        ? "bg-primary/15 text-primary border border-primary/20"
                        : "text-white/50 hover:text-white/90 hover:bg-white/5"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-r-full" />
                    )}
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : "text-white/40 group-hover:text-white/70"}`} />
                    <span className="truncate">{item.name}</span>
                    {isActive && <ChevronRight className="h-3 w-3 ml-auto text-primary/60 shrink-0" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="shrink-0 p-3 border-t border-white/8">
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-white/5 mb-2">
          <div className="h-7 w-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-xs shrink-0">
            {user?.email?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-[11px] font-semibold truncate">{user?.email || "Admin"}</p>
            <p className="text-white/35 text-[9px]">Yönetici</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/8 transition-all duration-150 group"
        >
          <LogOut className="h-3.5 w-3.5 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
          <span>Çıkış Yap</span>
        </button>
      </div>
    </div>
  );
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, logout, user } = useAuth();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      const listener = (e: MediaQueryListEvent) => setResolvedTheme(e.matches ? "dark" : "light");
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
      if (resolvedTheme === "dark") body.classList.add("dark");
      else body.classList.remove("dark");
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
            <div className="flex flex-col items-center gap-3">
              <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-primary border-t-transparent"></div>
              <p className="text-xs font-semibold text-muted-foreground">Yükleniyor...</p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  const isLoginPage = pathname === "/admin/login";

  if (!isAuthenticated && !isLoginPage) return null;

  if (isLoginPage) {
    return (
      <html lang="tr">
        <body className="antialiased min-h-screen bg-background admin-theme">
          {children}
        </body>
      </html>
    );
  }

  const currentTitle = pageTitle[pathname] || "";

  return (
    <html lang="tr" className="h-full">
      <body className="antialiased min-h-full bg-background text-foreground flex admin-theme">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-[220px] bg-sidebar-bg text-sidebar-text h-screen fixed left-0 top-0 z-20 border-r border-sidebar-border-custom">
          <SidebarContent
            user={user}
            pathname={pathname}
            onLogout={() => void logout()}
          />
        </aside>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-30"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <aside className={`lg:hidden flex flex-col w-[240px] bg-sidebar-bg text-sidebar-text h-screen fixed left-0 top-0 z-40 transition-transform duration-300 ease-out border-r border-sidebar-border-custom ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
          <div className="absolute top-4 right-3">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <SidebarContent
            user={user}
            pathname={pathname}
            onLinkClick={() => setIsSidebarOpen(false)}
            onLogout={() => { setIsSidebarOpen(false); void logout(); }}
          />
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen lg:pl-[220px]">
          {/* Topbar */}
          <header className="h-[60px] bg-card/70 backdrop-blur-xl border-b border-border/60 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
              {currentTitle && (
                <div className="flex items-center gap-2">
                  <div className="hidden sm:block w-0.5 h-4 bg-primary/60 rounded-full" />
                  <span className="text-sm font-semibold text-foreground">{currentTitle}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <div className="flex items-center bg-muted/50 p-0.5 rounded-lg border border-border/50">
                {(["light", "dark", "system"] as const).map((t) => {
                  const Icon = t === "light" ? Sun : t === "dark" ? Moon : Laptop;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleThemeChange(t)}
                      title={t === "light" ? "Açık" : t === "dark" ? "Koyu" : "Sistem"}
                      className={`p-1.5 rounded-md transition-all duration-150 ${
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
                className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border hover:bg-muted/50 rounded-lg text-xs font-semibold text-foreground transition-all duration-150 group"
              >
                <Globe className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="hidden sm:inline">Siteyi Gör</span>
              </a>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-3 duration-400 ease-out fill-mode-both">
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
