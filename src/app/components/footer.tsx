"use client";

import Image from "next/image";
import Link from "next/link";
import {
  localeLabels,
  sectionIds,
  translations,
  type Locale,
} from "../lib/site-content";

type FooterProps = {
  locale: Locale;
};

export default function Footer({ locale }: FooterProps) {
  const t = translations[locale];

  const footerLinks = [
    { label: t.nav.about, href: `/${locale}#${sectionIds.about}` },
    { label: t.nav.products, href: `/${locale}#${sectionIds.products}` },
    { label: t.nav.projects, href: `/${locale}#${sectionIds.projects}` },
    { label: t.nav.contact, href: `/${locale}#${sectionIds.contact}` },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#141429] pt-24 pb-8 text-slate-300">
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#1b1b36]/55 to-transparent pointer-events-none" />
      <div className="container-shell relative z-10">
        <div className="grid gap-12 lg:grid-cols-[2fr_1fr_1fr] mb-20">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <Link
              href={`/${locale}#${sectionIds.hero}`}
              className="inline-flex flex-col items-start gap-2 group"
            >
              <Image
                src="/atlantis-logo.svg"
                alt="Atlantis Crane Logo"
                width={200}
                height={48}
                quality={100}
                unoptimized
                className="h-12 w-auto brightness-0 invert opacity-90 transition-opacity group-hover:opacity-100"
              />
              <span className="block text-sm text-[color:var(--cta)] font-bold tracking-wider pl-1 mt-1">
                {t.brandClaim}
              </span>
            </Link>

            <p className="max-w-md text-sm leading-7 text-slate-400 font-medium">
              {t.footer.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-[0.2em] mb-6 border-b border-slate-700 pb-4 inline-block">
              {t.footer.quickLinks}
            </h3>
            <ul className="space-y-4">
              {footerLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm font-medium text-slate-400 hover:text-[color:var(--cta)] transition-colors flex items-center gap-3 group"
                  >
                    <span className="w-0 h-[2px] bg-[color:var(--cta)] transition-all duration-300 group-hover:w-4"></span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-[0.2em] mb-6 border-b border-slate-700 pb-4 inline-block">
              {t.nav.contact}
            </h3>
            <div className="space-y-5 text-sm font-medium text-slate-400">
              {t.contact.locations.map((location) => (
                <p key={location} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[color:var(--cta)] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {location}
                </p>
              ))}
              <a href={`mailto:${t.contact.email}`} className="flex items-center gap-3 hover:text-[color:var(--cta)] transition-colors">
                <svg className="w-5 h-5 text-[color:var(--cta)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                {t.contact.email}
              </a>
              <a href={`tel:${t.contact.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 hover:text-[color:var(--cta)] transition-colors">
                <svg className="w-5 h-5 text-[color:var(--cta)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                {t.contact.phone}
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-800 gap-6">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            © {new Date().getFullYear()} Atlantis Crane. {t.footer.rights}
          </p>
          
            <button 
            onClick={scrollToTop}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white/8 text-[color:var(--cta)] hover:bg-[color:var(--cta)] hover:text-slate-900 transition-colors z-20"
            aria-label="Scroll to top"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" /></svg>
          </button>

          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[color:var(--cta)] animate-pulse"></span>
            {localeLabels[locale]}
          </p>
        </div>
      </div>
      
      {/* Huge Background Text */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden flex justify-center items-end pointer-events-none opacity-[0.03] select-none">
        <h1 className="text-[18vw] font-black leading-none text-white whitespace-nowrap mb-[-4%]">
          ATLANTIS
        </h1>
      </div>
    </footer>
  );
}
