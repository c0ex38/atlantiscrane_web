"use client";

import Image from "next/image";
import Link from "next/link";
import {
  localeLabels,
  sectionIds,
  translations,
  type Locale,
} from "../lib/site-content";
import { useSiteContent } from "./site-content-provider";

type FooterProps = {
  locale: Locale;
  settings?: any;
};

export default function Footer({ locale, settings }: FooterProps) {
  const t = useSiteContent(locale);

  const email = settings?.contact_email?.email || t?.contact?.email || "";
  const phone = settings?.contact_phone?.phone || t?.contact?.phone || "";
  const companyLogo = settings?.company_logo?.logo || "/atlantis-logo.svg";
  const hasConfiguredLocations = Array.isArray(settings?.office_addresses?.items);
  const configuredLocations = hasConfiguredLocations
    ? settings.office_addresses.items
        .map((office: any) => office.address?.[locale] || office.address?.tr || "")
        .filter(Boolean)
    : [];
  const locations = hasConfiguredLocations ? configuredLocations : (t?.contact?.locations || []);

  const footerLinks = [
    { label: t?.nav?.about, href: `/${locale}#${sectionIds.about}` },
    { label: t?.nav?.products, href: `/${locale}/products` },
    { label: t?.nav?.projects, href: `/${locale}/projects` },
    { label: t?.nav?.references, href: `/${locale}/references` },
    { label: t?.nav?.contact, href: `/${locale}/contact` },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerData = settings?.site_common?.[locale]?.footer || t.footer;

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#141429] pb-6 pt-12 text-slate-300 sm:pb-8 sm:pt-20 lg:pt-24">
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#1b1b36]/55 to-transparent pointer-events-none" />
      <div className="container-shell relative z-10">
        <div className="mb-10 grid gap-8 md:grid-cols-2 lg:mb-20 lg:grid-cols-[1.6fr_0.8fr_1.2fr] lg:gap-12">

          {/* Brand Info */}
          <div className="space-y-5 md:col-span-2 lg:col-span-1">
            <Link
              href={`/${locale}`}
              className="inline-flex flex-col items-start gap-2 group"
            >
              <Image
                src={companyLogo}
                alt="Atlantis Crane Logo"
                width={200}
                height={48}
                quality={100}
                unoptimized
                className="h-10 w-auto max-w-[190px] object-contain object-left brightness-0 invert opacity-90 transition-opacity group-hover:opacity-100 sm:h-12 sm:max-w-none"
              />
              <span className="mt-1 block pl-1 text-xs font-bold tracking-wider text-cta sm:text-sm">
                {t.brandClaim}
              </span>
            </Link>

            <p className="max-w-lg text-sm font-medium leading-6 text-slate-400 sm:leading-7">
              {footerData?.description || ""}
            </p>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 rounded-full border border-cta/30 bg-cta/10 px-4 py-2 text-xs font-bold text-cta transition-colors hover:bg-cta hover:text-slate-950"
            >
              {t?.nav?.contact}
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Quick Links */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-5 sm:p-6 lg:border-0 lg:bg-transparent lg:p-0">
            <h3 className="mb-5 inline-block border-b border-slate-700 pb-3 text-xs font-bold uppercase tracking-[0.18em] text-white sm:text-sm">
              {t?.footer?.quickLinks}
            </h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-3 lg:grid-cols-1 lg:space-y-1">
              {footerLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-cta"
                  >
                    <span className="w-0 h-[2px] bg-cta transition-all duration-300 group-hover:w-4"></span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-5 sm:p-6 lg:border-0 lg:bg-transparent lg:p-0">
            <h3 className="mb-5 inline-block border-b border-slate-700 pb-3 text-xs font-bold uppercase tracking-[0.18em] text-white sm:text-sm">
              {t?.nav?.contact}
            </h3>
            <div className="space-y-4 break-words text-sm font-medium text-slate-400">
              {locations.map((location: string) => (
                <p key={location} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-cta shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {location}
                </p>
              ))}
              <a href={`mailto:${email}`} className="flex items-center gap-3 hover:text-cta transition-colors">
                <svg className="w-5 h-5 text-cta shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                {email}
              </a>
              <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center gap-3 hover:text-cta transition-colors">
                <svg className="w-5 h-5 text-cta shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                {phone}
              </a>
            </div>
          </div>

        </div>

        {/* Spacer to make room for the Huge Background Text in the flow to prevent overlapping */}
        <div className="hidden h-[8vw] max-h-[110px] min-h-[60px] pointer-events-none sm:block" />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-5 border-t border-slate-800 pt-6 text-center md:flex-row md:text-left">
          <p className="text-xs leading-relaxed text-slate-400 sm:text-sm">
            {t?.footer?.allRightsReserved} | {t?.footer?.designedBy}{" "}
            <a
              href="https://kncdesign.com.tr"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              style={{ color: "#ff2700" }}
            >
              KNC CREATIVE
            </a>
          </p>

          <button
            onClick={scrollToTop}
            className="z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/8 text-cta transition-colors hover:bg-cta hover:text-slate-900 sm:h-12 sm:w-12"
            aria-label="Scroll to top"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" /></svg>
          </button>

          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 sm:text-xs">
            <span className="w-2 h-2 rounded-full bg-cta animate-pulse"></span>
            {localeLabels[locale]}
          </p>
        </div>
      </div>

      {/* Huge Background Text - Positioned above the bottom bar */}
      <div className="pointer-events-none absolute bottom-[110px] left-0 right-0 hidden select-none items-end justify-center overflow-hidden opacity-[0.03] sm:flex">
        <h1 className="text-[18vw] font-black leading-none text-white whitespace-nowrap mb-[-4%]">
          ATLANTIS
        </h1>
      </div>
    </footer>
  );
}
