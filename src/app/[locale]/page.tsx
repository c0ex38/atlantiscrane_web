import { notFound } from "next/navigation";
import {
  isLocale,
  sectionIds,
  translations,
  type Locale,
} from "../lib/site-content";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return [{ locale: "tr" }, { locale: "en" }, { locale: "ar" }];
}

export default async function LocaleHome({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const currentLocale = locale as Locale;
  const t = translations[currentLocale];

  return (
    <div>
      <section id={sectionIds.hero} className="container-shell py-16 sm:py-20 lg:py-24">
        <div className="glass-panel overflow-hidden rounded-[2rem]">
          <div className="grid gap-10 px-6 py-10 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-12 lg:py-14">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-amber-200">
                {t.hero.eyebrow}
              </div>

              <div className="space-y-5">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {t.hero.title}
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                  {t.hero.description}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={`/${currentLocale}#${sectionIds.contact}`}
                  className="inline-flex items-center justify-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
                >
                  {t.hero.primaryCta}
                </a>
                <a
                  href={`/${currentLocale}#${sectionIds.products}`}
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  {t.hero.secondaryCta}
                </a>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {t.hero.stats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="text-2xl font-semibold text-white">
                      {item.value}
                    </div>
                    <div className="mt-1 text-sm text-slate-400">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200">
                  {t.hero.highlightsTitle}
                </p>
                <div className="mt-4 space-y-4">
                  {t.hero.highlights.map((item) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm font-medium text-white">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">
                  {t.hero.workingTitle}
                </p>
                <ul className="mt-4 space-y-3 text-sm text-slate-300">
                  {t.hero.working.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id={sectionIds.about} className="container-shell py-14 sm:py-16">
        <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-200">
              {t.about.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              {t.about.title}
            </h2>
          </div>
          <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
            <p className="max-w-4xl text-base leading-7 text-slate-300">
              {t.about.description}
            </p>
          </div>
        </div>
      </section>

      <section id={sectionIds.products} className="container-shell py-14 sm:py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-200">
              {t.products.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              {t.products.title}
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-slate-400">
            {t.products.description}
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {t.products.items.map((card) => (
            <article
              key={card.title}
              className="glass-panel rounded-[1.75rem] p-6 transition hover:-translate-y-1"
            >
              <h3 className="text-lg font-semibold text-white">{card.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                {card.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id={sectionIds.sectors} className="container-shell py-14 sm:py-16">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-200">
              {t.sectors.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              {t.sectors.title}
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {t.sectors.items.map((sector) => (
              <div
                key={sector}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-300"
              >
                {sector}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id={sectionIds.production} className="container-shell py-14 sm:py-16">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">
              {t.production.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              {t.production.title}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              {t.production.description}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {t.production.steps.map((step, index) => (
              <div
                key={step}
                className="rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-5"
              >
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200">
                  0{index + 1}
                </div>
                <div className="mt-3 text-base font-semibold text-white">{step}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id={sectionIds.projects} className="container-shell py-14 sm:py-16">
        <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-200">
            {t.projects.eyebrow}
          </p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                {t.projects.title}
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
                {t.projects.description}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
              {t.projects.note}
            </div>
          </div>
        </div>
      </section>

      <section id={sectionIds.export} className="container-shell py-14 sm:py-16">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">
              {t.export.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              {t.export.title}
            </h2>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 sm:p-8">
            <p className="text-sm leading-7 text-slate-300">
              {t.export.description}
            </p>
          </div>
        </div>
      </section>

      <section id={sectionIds.news} className="container-shell py-14 sm:py-16">
        <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-200">
            {t.news.eyebrow}
          </p>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                {t.news.title}
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                {t.news.description}
              </p>
            </div>
            <a
              href={`/${currentLocale}#${sectionIds.contact}`}
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {t.news.cta}
            </a>
          </div>
        </div>
      </section>

      <section id={sectionIds.contact} className="container-shell py-14 sm:py-16">
        <div className="rounded-[2rem] border border-amber-400/20 bg-amber-400/10 p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-100">
            {t.contact.eyebrow}
          </p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                {t.contact.title}
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-amber-50/80">
                {t.contact.description}
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-5 text-sm text-slate-300">
              {t.contact.locations.map((location) => (
                <p key={location}>{location}</p>
              ))}
              <p className="mt-2">{t.contact.email}</p>
              <p className="mt-2">{t.contact.phone}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
