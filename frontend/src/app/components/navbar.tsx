"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  localeLabels,
  localeNames,
  sectionIds,
  translations,
  type Locale,
} from "../lib/site-content";
import { useSiteContent } from "./site-content-provider";

type NavbarProps = {
  locale: Locale;
};

const languageOrder: Locale[] = ["tr", "en", "ar"];

export default function Navbar({ locale }: NavbarProps) {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const t = useSiteContent(locale);

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
    { label: t?.nav?.home, href: `/${locale}` },
    { label: t?.nav?.about, href: `/${locale}/about` },
    { label: t?.nav?.products, href: `/${locale}/products` },
    { label: t?.nav?.projects, href: `/${locale}/projects` },
    { label: t?.nav?.references, href: `/${locale}/references` }
  ];

  return (
    <header className="sticky top-4 z-50 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="w-full max-w-5xl">
        <div className="relative flex items-center justify-between rounded-full border border-white/40 bg-white/50 px-3 py-2.5 shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(15,23,42,0.12)] hover:bg-white/60">
          <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-b from-white/60 to-transparent" />

          <Link
            href={`/${locale}`}
            className="group flex shrink-0 items-center pl-4 py-2"
            aria-label="Atlantis Crane"
          >
            <Image
              src="/atlantis-logo.svg"
              alt="Atlantis Crane Logo"
              width={166}
              height={40}
              quality={100}
              unoptimized
              className="h-8 w-auto transition-transform duration-300 group-hover:scale-[1.02]"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-1 md:flex px-4">
            {navigation.map((item) => {
              const isHome = item.href === `/${locale}`;
              const hasHash = item.href.includes('#');
              
              let isActive = false;
              if (isHome) {
                isActive = pathname === item.href;
              } else if (!hasHash) {
                isActive = pathname.startsWith(item.href);
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`group relative px-4 py-2 text-sm font-semibold transition-colors duration-300 ${isActive ? "text-slate-900" : "text-slate-600"}`}
                >
                  <div className="relative z-10 overflow-hidden h-[20px]">
                    <span className={`block leading-[20px] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isActive ? "-translate-y-full" : "group-hover:-translate-y-full"}`}>
                      {item.label}
                    </span>
                    <span className={`absolute top-0 left-0 block leading-[20px] text-slate-900 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isActive ? "translate-y-0" : "translate-y-full group-hover:translate-y-0"}`} aria-hidden="true">
                      {item.label}
                    </span>
                  </div>
                  <span className={`absolute inset-0 z-0 rounded-full bg-cta/20 transition-all duration-300 ${isActive ? "scale-100 opacity-100" : "scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100"}`} />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 pr-1">
            <div className="relative" ref={languageMenuRef}>
              <button
                type="button"
                onClick={() => setIsLanguageOpen((value) => !value)}
                className="group flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold tracking-[0.15em] text-slate-700 transition duration-300 hover:bg-white/80 hover:text-[color:var(--accent-strong)]"
                aria-expanded={isLanguageOpen}
                aria-haspopup="menu"
              >
                {localeLabels[locale]}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="none"
                  className={`h-4 w-4 text-slate-400 transition-transform duration-300 group-hover:text-[color:var(--accent-strong)] ${isLanguageOpen ? "rotate-180" : ""}`}
                >
                  <path
                    d="M5 7.5L10 12.5L15 7.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div
                className={`absolute right-0 top-full mt-2 w-40 origin-top-right rounded-2xl border border-white/60 bg-white/90 p-1.5 shadow-[0_10px_40px_rgba(15,23,42,0.1)] backdrop-blur-xl transition-all duration-300 ${isLanguageOpen
                  ? "visible translate-y-0 opacity-100 scale-100"
                  : "invisible -translate-y-2 opacity-0 scale-95"
                  }`}
              >
                {languageOrder.map((language) => (
                  <Link
                    key={language}
                    href={languageHref(language)}
                    onClick={() => setIsLanguageOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-all duration-200 hover:bg-[color:var(--accent)]/10 ${language === locale ? "text-[color:var(--accent-strong)] font-semibold" : "text-slate-600 hover:text-[color:var(--accent-strong)]"
                      }`}
                  >
                    <span>{localeLabels[language]}</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] opacity-60">
                      {language}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href={`/${locale}/contact`}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-cta to-[#fdd14a] px-6 py-2.5 text-sm font-bold text-slate-900 shadow-[0_8px_20px_rgba(253,197,32,0.3)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_12px_25px_rgba(253,197,32,0.4)]"
            >
              <span className="absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative z-10 overflow-hidden h-[20px]">
                <span className="block leading-[20px] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
                  {t?.nav?.contact}
                </span>
                <span className="absolute top-0 left-0 block leading-[20px] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-full group-hover:translate-y-0" aria-hidden="true">
                  {t?.nav?.contact}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
