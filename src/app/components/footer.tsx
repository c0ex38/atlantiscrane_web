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

  return (
    <footer className="border-t border-white/10 bg-[color:var(--surface-strong)]/95">
      <div className="container-shell py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <div className="space-y-5">
            <Link href={`/${locale}#${sectionIds.hero}`} className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-sm font-semibold tracking-[0.24em] text-white">
                AC
              </span>
              <span>
                <span className="block text-sm font-semibold uppercase tracking-[0.28em] text-white">
                  Atlantis Crane
                </span>
                <span className="block text-xs text-slate-300/80">
                  {t.brandClaim}
                </span>
              </span>
            </Link>

            <p className="max-w-xl text-sm leading-6 text-slate-300/80">
              {t.footer.description}
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-white">
              {t.footer.quickLinks}
            </h2>
            <ul className="mt-5 space-y-3">
              {footerLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-300/80 transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-white">
              {t.nav.contact}
            </h2>
            <div className="mt-5 space-y-3 text-sm text-slate-300/80">
              {t.contact.locations.map((location) => (
                <p key={location}>{location}</p>
              ))}
              <p>{t.contact.email}</p>
              <p>{t.contact.phone}</p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-slate-400/80 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Atlantis Crane. Tüm hakları saklıdır.</p>
          <p>{localeLabels[locale]} • TR / EN / AR çok dilli yapı</p>
        </div>
      </div>
    </footer>
  );
}
