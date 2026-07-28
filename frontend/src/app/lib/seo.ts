import type { Metadata } from "next";
import { getSettings, getSiteDictionary } from "./api";
import type { Locale } from "./site-content";

export type SeoPageKey =
  | "home"
  | "about"
  | "products"
  | "projects"
  | "references"
  | "contact";

type PageSeoSettings = {
  title?: string;
  description?: string;
  keywords?: string;
  index?: boolean;
};

type LocalizedSeoSettings = {
  title?: string;
  titleTemplate?: string;
  description?: string;
  keywords?: string;
  author?: string;
  publisher?: string;
  pages?: Partial<Record<SeoPageKey, PageSeoSettings>>;
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
  };
  twitter?: {
    title?: string;
    description?: string;
    image?: string;
    card?: "summary" | "summary_large_image";
  };
};

type GlobalSeoSettings = {
  siteUrl?: string;
  defaultLocale?: Locale;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
  sitemapEnabled?: boolean;
  googleVerification?: string;
  yandexVerification?: string;
  bingVerification?: string;
};

type MetadataOverrides = {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  index?: boolean;
};

const fallbackSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.atlantiscrane.com";

export function normalizeSiteUrl(value?: string) {
  const candidate = value?.trim() || fallbackSiteUrl;
  try {
    return new URL(candidate).toString().replace(/\/$/, "");
  } catch {
    return fallbackSiteUrl.replace(/\/$/, "");
  }
}

export function absoluteSeoUrl(siteUrl: string, value?: string) {
  if (!value) return undefined;
  try {
    return new URL(value, `${siteUrl}/`).toString();
  } catch {
    return undefined;
  }
}

export function parseSeoKeywords(value?: string) {
  return value
    ?.split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

async function loadSeoContext(locale: Locale) {
  const [dictionary, settings] = await Promise.all([
    getSiteDictionary(locale),
    getSettings(),
  ]);
  const seo = (dictionary?.seo || {}) as LocalizedSeoSettings;
  const global = (settings?.seo_global || {}) as GlobalSeoSettings;
  const siteName =
    settings?.site_title?.title || seo.title || "Atlantis Crane";
  const siteUrl = normalizeSiteUrl(global.siteUrl);
  const favicon = absoluteSeoUrl(siteUrl, settings?.site_favicon?.icon);

  return { seo, global, siteName, siteUrl, favicon };
}

function localizedAlternates(siteUrl: string, path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return {
    tr: `${siteUrl}/tr${normalizedPath}`,
    en: `${siteUrl}/en${normalizedPath}`,
    ar: `${siteUrl}/ar${normalizedPath}`,
    "x-default": `${siteUrl}/tr${normalizedPath}`,
  };
}

export async function buildBaseSeoMetadata(locale: Locale): Promise<Metadata> {
  const { seo, global, siteName, siteUrl, favicon } = await loadSeoContext(locale);
  const title = seo.title || siteName;
  const description = seo.description || "";
  const openGraphImage = absoluteSeoUrl(siteUrl, seo.openGraph?.image);
  const twitterImage = absoluteSeoUrl(
    siteUrl,
    seo.twitter?.image || seo.openGraph?.image,
  );

  return {
    metadataBase: new URL(siteUrl),
    applicationName: siteName,
    icons: favicon
      ? {
          icon: [{ url: favicon }],
          shortcut: [{ url: favicon }],
        }
      : undefined,
    title: {
      default: title,
      template: seo.titleTemplate?.includes("%s")
        ? seo.titleTemplate
        : `%s | ${siteName}`,
    },
    description,
    keywords: parseSeoKeywords(seo.keywords),
    authors: seo.author ? [{ name: seo.author }] : undefined,
    creator: seo.author || undefined,
    publisher: seo.publisher || siteName,
    referrer: "origin-when-cross-origin",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    robots: {
      index: global.robotsIndex !== false,
      follow: global.robotsFollow !== false,
      googleBot: {
        index: global.robotsIndex !== false,
        follow: global.robotsFollow !== false,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: seo.openGraph?.title || title,
      description: seo.openGraph?.description || description,
      url: `${siteUrl}/${locale}`,
      siteName,
      locale: locale === "tr" ? "tr_TR" : locale === "ar" ? "ar_AE" : "en_US",
      alternateLocale: locale === "tr" ? ["en_US", "ar_AE"] : ["tr_TR"],
      type: "website",
      images: openGraphImage ? [{ url: openGraphImage }] : undefined,
    },
    twitter: {
      card: seo.twitter?.card || "summary_large_image",
      title: seo.twitter?.title || seo.openGraph?.title || title,
      description:
        seo.twitter?.description || seo.openGraph?.description || description,
      images: twitterImage ? [twitterImage] : undefined,
    },
    verification: {
      google: global.googleVerification || undefined,
      yandex: global.yandexVerification || undefined,
      other: global.bingVerification
        ? { "msvalidate.01": [global.bingVerification] }
        : undefined,
    },
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: localizedAlternates(siteUrl, ""),
    },
  };
}

export async function buildPageSeoMetadata({
  locale,
  page,
  path,
  overrides = {},
}: {
  locale: Locale;
  page?: SeoPageKey;
  path: string;
  overrides?: MetadataOverrides;
}): Promise<Metadata> {
  const { seo, global, siteName, siteUrl } = await loadSeoContext(locale);
  const pageSeo = page ? seo.pages?.[page] || {} : {};
  const pageTitle = overrides.title || pageSeo.title || "";
  const title = pageTitle || seo.title || siteName;
  const description =
    overrides.description || pageSeo.description || seo.description || "";
  const keywords =
    overrides.keywords || pageSeo.keywords || seo.keywords || "";
  const shouldIndex =
    overrides.index ?? pageSeo.index ?? global.robotsIndex ?? true;
  const shouldFollow = global.robotsFollow !== false;
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  const canonical = `${siteUrl}/${locale}${canonicalPath}`;
  const openGraphImage = absoluteSeoUrl(
    siteUrl,
    overrides.image || seo.openGraph?.image,
  );
  const twitterImage = absoluteSeoUrl(
    siteUrl,
    overrides.image || seo.twitter?.image || seo.openGraph?.image,
  );
  const openGraphTitle =
    overrides.title || pageSeo.title || seo.openGraph?.title || title;
  const openGraphDescription =
    overrides.description ||
    pageSeo.description ||
    seo.openGraph?.description ||
    description;
  const twitterTitle =
    overrides.title || pageSeo.title || seo.twitter?.title || openGraphTitle;
  const twitterDescription =
    overrides.description ||
    pageSeo.description ||
    seo.twitter?.description ||
    openGraphDescription;

  return {
    title: pageTitle ? pageTitle : { absolute: title },
    description,
    keywords: parseSeoKeywords(keywords),
    robots: {
      index: shouldIndex,
      follow: shouldFollow,
      googleBot: {
        index: shouldIndex,
        follow: shouldFollow,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: openGraphTitle,
      description: openGraphDescription,
      url: canonical,
      siteName,
      locale: locale === "tr" ? "tr_TR" : locale === "ar" ? "ar_AE" : "en_US",
      type: "website",
      images: openGraphImage ? [{ url: openGraphImage }] : undefined,
    },
    twitter: {
      card: seo.twitter?.card || "summary_large_image",
      title: twitterTitle,
      description: twitterDescription,
      images: twitterImage ? [twitterImage] : undefined,
    },
    alternates: {
      canonical,
      languages: localizedAlternates(siteUrl, canonicalPath),
    },
  };
}
