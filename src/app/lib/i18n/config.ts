export const locales = ["tr", "en", "ar"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "tr";

export const localeNames: Record<Locale, string> = {
  tr: "Türkçe",
  en: "English",
  ar: "العربية",
};

export const localeLabels: Record<Locale, string> = {
  tr: "TR",
  en: "EN",
  ar: "AR",
};

export const localeDirections: Record<Locale, "ltr" | "rtl"> = {
  tr: "ltr",
  en: "ltr",
  ar: "rtl",
};

export const sectionIds = {
  hero: "hero",
  about: "hakkimizda",
  products: "urunler",
  sectors: "sektorler",
  production: "uretim",
  projects: "projeler",
  export: "ihracat",
  news: "haberler",
  contact: "iletisim",
} as const;

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
