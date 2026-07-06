"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  localeLabels,
  localeNames,
  sectionIds,
  translations,
  type Locale,
} from "../lib/site-content";

type NavbarProps = {
  locale: Locale;
};

const languageOrder: Locale[] = ["tr", "en", "ar"];

export default function Navbar({ locale }: NavbarProps) {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement | null>(null);
  const t = translations[locale];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageMenuRef.current &&
        !languageMenuRef.current.contains(event.target as Node)
      ) {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const languageHref = (targetLocale: Locale) => `/${targetLocale}`;

  const navigation = [
    { label: t.nav.home, href: `/${locale}#${sectionIds.hero}` },
    { label: t.nav.about, href: `/${locale}#${sectionIds.about}` },
    { label: t.nav.products, href: `/${locale}#${sectionIds.products}` },
    { label: t.nav.projects, href: `/${locale}#${sectionIds.projects}` },
    { label: t.nav.contact, href: `/${locale}#${sectionIds.contact}` },
  ];

  return (
    <header className="sticky top-4 z-50 px-4">
      <div className="container-shell">
        <div className="flex items-center justify-between gap-4 rounded-[1.75rem] border border-white/10 bg-[color:var(--surface)] px-4 py-3 shadow-[0_24px_90px_rgba(0,0,0,0.35)] backdrop-blur-2xl backdrop-saturate-150">
          <Link href={`/${locale}#${sectionIds.hero}`} className="group flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[color:var(--border)] bg-gradient-to-br from-white/20 to-white/5 text-sm font-semibold tracking-[0.24em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
              AC
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold uppercase tracking-[0.28em] text-white">
                Atlantis Crane
              </span>
              <span className="block text-xs text-slate-300/80">
                {t.brandClaim}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 lg:flex">
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-200/80 transition hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="relative" ref={languageMenuRef}>
              <button
                type="button"
                onClick={() => setIsLanguageOpen((value) => !value)}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold tracking-[0.2em] text-slate-100 transition hover:bg-white/10"
                aria-expanded={isLanguageOpen}
                aria-haspopup="menu"
              >
                {localeLabels[locale]}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="none"
                  className={`h-4 w-4 transition ${isLanguageOpen ? "rotate-180" : ""}`}
                >
                  <path
                    d="M5 7.5L10 12.5L15 7.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {isLanguageOpen ? (
                <div className="absolute right-0 top-full z-50 mt-3 w-40 overflow-hidden rounded-2xl border border-white/10 bg-[color:var(--surface-strong)] shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
                  {languageOrder.map((language) => (
                    <Link
                      key={language}
                      href={languageHref(language)}
                      onClick={() => setIsLanguageOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 text-sm transition hover:bg-white/10 hover:text-white ${
                        language === locale ? "text-white" : "text-slate-200"
                      }`}
                    >
                      <span>{localeLabels[language]}</span>
                      <span className="text-[11px] tracking-[0.2em] text-slate-400">
                        {localeNames[language]}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>

            <Link
              href={`/${locale}#${sectionIds.contact}`}
              className="inline-flex items-center justify-center rounded-full bg-[color:var(--cta)] px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:brightness-110"
            >
              {t.nav.contact}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
