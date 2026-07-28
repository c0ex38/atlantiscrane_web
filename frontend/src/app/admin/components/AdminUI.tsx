"use client";

import { useEffect, useId, useState, type FormEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  AlertCircle,
  Check,
  Info,
  LayoutGrid,
  List,
  LoaderCircle,
  Save,
  X,
} from "lucide-react";

export type AdminLocale = "tr" | "en" | "ar";
export type AdminViewMode = "grid" | "table";

const localeNames: Record<AdminLocale, string> = {
  tr: "Türkçe",
  en: "ENGLISH",
  ar: "العربية",
};

export function AdminPageShell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto min-w-0 w-full max-w-6xl space-y-5 animate-in fade-in duration-300 ${className}`}>
      {children}
    </div>
  );
}

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex min-w-0 flex-col gap-4 border-b border-border/70 pb-4 sm:pb-5 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <h1 className="text-xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
      {actions && <div className="flex w-full flex-wrap items-center gap-2 [&>*]:max-w-full sm:[&>a]:w-auto sm:[&>button]:w-auto md:w-auto md:shrink-0">{actions}</div>}
    </header>
  );
}

export function AdminLanguageTabs({
  value,
  onChange,
}: {
  value: AdminLocale;
  onChange: (locale: AdminLocale) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="İçerik dili"
      className="flex max-w-full self-start overflow-x-auto rounded-lg border border-border/60 bg-muted/50 p-0.5 sm:self-auto"
    >
      {(Object.keys(localeNames) as AdminLocale[]).map((locale) => (
        <button
          key={locale}
          type="button"
          role="tab"
          aria-selected={value === locale}
          onClick={() => onChange(locale)}
          className={`rounded-md px-3 py-1 text-xs font-bold transition-all ${
            value === locale
              ? "bg-card text-card-foreground shadow-sm"
              : "text-muted-foreground hover:text-card-foreground"
          }`}
        >
          {localeNames[locale]}
        </button>
      ))}
    </div>
  );
}

const noticeStyles = {
  error: {
    icon: AlertCircle,
    className: "border-destructive/20 bg-destructive/10 text-destructive",
  },
  success: {
    icon: Check,
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  },
  info: {
    icon: Info,
    className: "border-primary/20 bg-primary/5 text-foreground",
  },
} as const;

export function AdminNotice({
  type,
  children,
}: {
  type: keyof typeof noticeStyles;
  children: ReactNode;
}) {
  const config = noticeStyles[type];
  const Icon = config.icon;

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={`flex items-start gap-3 rounded-xl border p-3.5 text-sm font-medium ${config.className}`}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="min-w-0 leading-relaxed">{children}</div>
    </div>
  );
}

export function AdminLoadingState({ label = "İçerik yükleniyor..." }: { label?: string }) {
  const [logo, setLogo] = useState("/atlantis-logo.svg");

  useEffect(() => {
    const savedLogo = localStorage.getItem("admin-company-logo");
    if (savedLogo) setLogo(savedLogo);

    const handleBrandingUpdate = (event: Event) => {
      const detail = (event as CustomEvent<{ companyLogo?: string }>).detail;
      setLogo(detail?.companyLogo || "/atlantis-logo.svg");
    };

    window.addEventListener("admin-branding-updated", handleBrandingUpdate);
    return () => window.removeEventListener("admin-branding-updated", handleBrandingUpdate);
  }, []);

  return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center gap-4">
      <div className="relative h-24 w-24">
        <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-primary/15 border-t-primary border-r-primary/45 motion-reduce:animate-none" />
        <div className="absolute inset-2 flex items-center justify-center overflow-hidden rounded-full border border-border/70 bg-card p-3 shadow-lg shadow-black/10">
          <img
            src={logo}
            alt="Atlantis Crane"
            className="max-h-full max-w-full object-contain"
            onError={(event) => {
              event.currentTarget.src = "/atlantis-logo.svg";
            }}
          />
        </div>
      </div>
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
    </div>
  );
}

export function AdminEmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
      <p className="text-sm font-bold text-card-foreground">{title}</p>
      {description && <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground">{description}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

export function AdminViewToggle({
  value,
  onChange,
}: {
  value: AdminViewMode;
  onChange: (mode: AdminViewMode) => void;
}) {
  return (
    <div className="flex items-center rounded-lg border border-border/60 bg-muted/50 p-0.5">
      <button
        type="button"
        onClick={() => onChange("grid")}
        aria-label="Kart görünümü"
        aria-pressed={value === "grid"}
        className={`rounded-md p-1.5 transition-all ${value === "grid" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
      >
        <LayoutGrid className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onChange("table")}
        aria-label="Tablo görünümü"
        aria-pressed={value === "table"}
        className={`rounded-md p-1.5 transition-all ${value === "table" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
      >
        <List className="h-4 w-4" />
      </button>
    </div>
  );
}

export function AdminSaveBar({
  isSaving,
  label = "Değişiklikleri Kaydet",
  savingLabel = "Kaydediliyor...",
}: {
  isSaving: boolean;
  label?: string;
  savingLabel?: string;
}) {
  return (
    <div className="flex items-center justify-end border-t border-border/70 bg-muted/20 px-6 py-4 sm:px-8">
      <button
        type="submit"
        disabled={isSaving}
        className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-[13px] font-bold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSaving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        <span>{isSaving ? savingLabel : label}</span>
      </button>
    </div>
  );
}

export function AdminEditorModal({
  open,
  title,
  description,
  onClose,
  onSubmit,
  children,
  saveLabel = "Kaydet",
}: {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  children: ReactNode;
  saveLabel?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-2 backdrop-blur-sm sm:p-4"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <form
        onSubmit={onSubmit}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className="flex max-h-[100dvh] w-full max-w-5xl flex-col overflow-hidden rounded-none border border-border/70 bg-background shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:rounded-2xl"
      >
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-border/70 bg-card px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
          <div className="min-w-0">
            <h2 id={titleId} className="text-lg font-bold tracking-tight text-card-foreground">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Pencereyi kapat"
            className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-muted/10 p-4 sm:p-6">
          {children}
        </div>

        <footer className="flex shrink-0 items-center justify-end gap-2 border-t border-border/70 bg-card px-4 py-3 sm:px-6 sm:py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border bg-background px-4 py-2 text-xs font-bold text-foreground shadow-sm transition-colors hover:bg-muted"
          >
            İptal
          </button>
          <button type="submit" className={adminPrimaryButtonClass}>
            <Save className="h-4 w-4" />
            <span>{saveLabel}</span>
          </button>
        </footer>
      </form>
    </div>,
    document.body,
  );
}

export const adminPrimaryButtonClass =
  "inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50";
