"use client";

import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AdminLoadingState } from "./components/AdminUI";
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

type AdminBranding = {
  siteTitle: string;
  companyLogo: string;
  companyLogoDark: string;
  favicon: string;
};

function AdminFontHead() {
  return (
    <head>
      <link rel="preconnect" href="https://use.typekit.net" />
      <link rel="preconnect" href="https://p.typekit.net" crossOrigin="anonymous" />
      <link rel="stylesheet" href="https://use.typekit.net/waa1nqn.css" />
    </head>
  );
}

function SidebarContent({ 
  user, 
  pathname, 
  onLinkClick, 
  onLogout,
  branding,
  resolvedTheme,
}: { 
  user: any; 
  pathname: string; 
  onLinkClick?: () => void; 
  onLogout: () => void;
  branding: AdminBranding;
  resolvedTheme: "light" | "dark";
}) {
  const activeLogo = resolvedTheme === "dark"
    ? branding.companyLogoDark || branding.companyLogo
    : branding.companyLogo;

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex h-[68px] shrink-0 items-center border-b border-sidebar-border-custom px-5">
        <div className="flex h-11 w-full max-w-[170px] items-center justify-start overflow-hidden rounded-lg bg-white px-2 dark:bg-white/5">
          <img
            src={activeLogo || "/atlantis-logo.svg"}
            alt={`${branding.siteTitle} logosu`}
            className="max-h-10 w-auto max-w-full object-contain object-left"
            onError={(event) => {
              event.currentTarget.src = "/atlantis-logo.svg";
            }}
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 custom-scrollbar">
        {menuGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1.5 text-[9px] font-black uppercase tracking-[0.15em] text-sidebar-text/35">{group.label}</p>
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
                        : "text-sidebar-text/60 hover:bg-sidebar-hover-bg hover:text-sidebar-text"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-r-full" />
                    )}
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : "text-sidebar-text/45 group-hover:text-sidebar-text/75"}`} />
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
      <div className="shrink-0 border-t border-sidebar-border-custom p-3">
        <div className="mb-2 flex items-center gap-2.5 rounded-lg bg-sidebar-hover-bg px-3 py-2.5">
          <div className="h-7 w-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-xs shrink-0">
            {user?.email?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-semibold text-sidebar-text">{user?.email || "Admin"}</p>
            <p className="text-[9px] text-sidebar-text/40">Yönetici</p>
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
  const { isAuthenticated, isLoading, logout, user, apiFetch } = useAuth();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const routeLoadingStartedAt = React.useRef(0);
  const routeLoadingFromPath = React.useRef<string | null>(null);
  const routeLoadingFallback = React.useRef<number | null>(null);

  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [branding, setBranding] = useState<AdminBranding>({
    siteTitle: "Atlantis Crane",
    companyLogo: "",
    companyLogoDark: "",
    favicon: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("admin-theme") as "light" | "dark" | "system";
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    void apiFetch("/settings")
      .then((response) => {
        const data = (response as { data?: Record<string, any> })?.data || {};
        setBranding({
          siteTitle: data.site_title?.title || "Atlantis Crane",
          companyLogo: data.company_logo?.logo || "",
          companyLogoDark: data.company_logo?.darkLogo || "",
          favicon: data.site_favicon?.icon || "",
        });
      })
      .catch(() => {
        // Keep the safe default branding when settings are temporarily unavailable.
      });
  }, [apiFetch, isLoading]);

  useEffect(() => {
    const handleBrandingUpdate = (event: Event) => {
      const detail = (event as CustomEvent<AdminBranding>).detail;
      if (detail) setBranding(detail);
    };

    window.addEventListener("admin-branding-updated", handleBrandingUpdate);
    return () => window.removeEventListener("admin-branding-updated", handleBrandingUpdate);
  }, []);

  useEffect(() => {
    if (!branding.favicon) return;

    let faviconLink = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!faviconLink) {
      faviconLink = document.createElement("link");
      faviconLink.rel = "icon";
      document.head.appendChild(faviconLink);
    }
    faviconLink.href = branding.favicon;
  }, [branding.favicon]);

  useEffect(() => {
    localStorage.setItem(
      "admin-company-logo",
      branding.companyLogo || "/atlantis-logo.svg",
    );
    localStorage.setItem(
      "admin-company-logo-dark",
      branding.companyLogoDark || branding.companyLogo || "/atlantis-logo.svg",
    );
    window.dispatchEvent(new CustomEvent("admin-branding-updated", {
      detail: branding,
    }));
  }, [branding]);

  useEffect(() => {
    const handleAdminNavigation = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target as Element | null;
      const anchor = target?.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const destination = new URL(anchor.href, window.location.href);
      if (
        destination.origin !== window.location.origin ||
        !destination.pathname.startsWith("/admin") ||
        destination.pathname === pathname
      ) {
        return;
      }

      routeLoadingStartedAt.current = performance.now();
      routeLoadingFromPath.current = pathname;
      setIsRouteLoading(true);

      if (routeLoadingFallback.current) window.clearTimeout(routeLoadingFallback.current);
      routeLoadingFallback.current = window.setTimeout(() => {
        setIsRouteLoading(false);
        routeLoadingFromPath.current = null;
      }, 8000);
    };

    document.addEventListener("click", handleAdminNavigation, true);
    return () => document.removeEventListener("click", handleAdminNavigation, true);
  }, [pathname]);

  useEffect(() => {
    if (
      !isRouteLoading ||
      !routeLoadingFromPath.current ||
      routeLoadingFromPath.current === pathname
    ) {
      return;
    }

    const minimumVisibleMs = 650;
    const elapsed = performance.now() - routeLoadingStartedAt.current;
    const remaining = Math.max(0, minimumVisibleMs - elapsed);
    const timer = window.setTimeout(() => {
      setIsRouteLoading(false);
      routeLoadingFromPath.current = null;
      if (routeLoadingFallback.current) {
        window.clearTimeout(routeLoadingFallback.current);
        routeLoadingFallback.current = null;
      }
    }, remaining);

    return () => window.clearTimeout(timer);
  }, [isRouteLoading, pathname]);

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
    const applyTheme = () => setTheme(newTheme);
    const transitionDocument = document as Document & {
      startViewTransition?: (callback: () => void) => unknown;
    };

    if (transitionDocument.startViewTransition) {
      transitionDocument.startViewTransition(applyTheme);
    } else {
      applyTheme();
    }
    localStorage.setItem("admin-theme", newTheme);
  };

  if (isLoading) {
    return (
      <html lang="tr">
        <AdminFontHead />
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
        <AdminFontHead />
        <body className="antialiased min-h-screen bg-background admin-theme">
          {children}
        </body>
      </html>
    );
  }

  const currentTitle = pageTitle[pathname] || "";

  return (
    <html lang="tr" className="h-full">
      <AdminFontHead />
      <body className="antialiased min-h-full min-w-0 overflow-x-hidden bg-background text-foreground flex admin-theme">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-[220px] bg-sidebar-bg text-sidebar-text h-screen fixed left-0 top-0 z-20 border-r border-sidebar-border-custom">
          <SidebarContent
            user={user}
            pathname={pathname}
            onLogout={() => void logout()}
            branding={branding}
            resolvedTheme={resolvedTheme}
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
        <aside className={`lg:hidden flex flex-col w-[min(280px,86vw)] bg-sidebar-bg text-sidebar-text h-[100dvh] fixed left-0 top-0 z-40 transition-transform duration-300 ease-out border-r border-sidebar-border-custom ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
          <div className="absolute top-4 right-3">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="rounded-lg p-1.5 text-sidebar-text/45 transition-colors hover:bg-sidebar-hover-bg hover:text-sidebar-text"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <SidebarContent
            user={user}
            pathname={pathname}
            onLinkClick={() => setIsSidebarOpen(false)}
            onLogout={() => { setIsSidebarOpen(false); void logout(); }}
            branding={branding}
            resolvedTheme={resolvedTheme}
          />
        </aside>

        {/* Main Content */}
        <div className="flex min-h-screen min-w-0 flex-1 flex-col lg:pl-[220px]">
          {/* Topbar */}
          <header className="h-[56px] sm:h-[60px] bg-card/90 backdrop-blur-xl border-b border-border/60 flex items-center justify-between px-3 sm:px-6 sticky top-0 z-10">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
              {currentTitle && (
                <div className="flex items-center gap-2">
                  <div className="hidden sm:block w-0.5 h-4 bg-primary/60 rounded-full" />
                  <span className="truncate text-xs font-semibold text-foreground sm:text-sm">{currentTitle}</span>
                </div>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
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
          <main className="min-w-0 flex-1 p-3 sm:p-6 lg:p-8">
            <div className="mx-auto min-w-0 max-w-5xl animate-in fade-in slide-in-from-bottom-3 duration-400 ease-out fill-mode-both">
              {isRouteLoading ? (
                <AdminLoadingState label="Sayfa yükleniyor..." />
              ) : (
                children
              )}
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
