import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Outfit, Lora, Noto_Sans_Arabic, Geist } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import PremiumLoader from "../components/premium-loader";
import WhatsAppButton from "../components/whatsapp-button";
import {
  isLocale,
  localeDirections,
  type Locale,
} from "../lib/site-content";
import { getSettings } from "../lib/api";
import { getSiteDictionary } from "../lib/api";
import { SiteContentProvider } from "../components/site-content-provider";
import { AnalyticsTracker } from "../components/AnalyticsTracker";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const notoArabic = Noto_Sans_Arabic({
  variable: "--font-noto-arabic",
  subsets: ["arabic"],
});

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return [{ locale: "tr" }, { locale: "en" }, { locale: "ar" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  
  const t = await getSiteDictionary(locale as Locale);
  return {
    title: t.seo?.title || "",
    description: t.seo?.description || "",
    keywords: t.seo?.keywords || "",
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const currentLocale = locale as Locale;
  const isArabic = currentLocale === "ar";
  const settings = await getSettings();
  const content = await getSiteDictionary(currentLocale);
  
  // Only apply arabic font variable if locale is 'ar'
  const fontVariables = cn(
    outfit.variable,
    lora.variable,
    geist.variable,
    isArabic && notoArabic.variable
  );

  return (
    <html
      lang={currentLocale}
      dir={localeDirections[currentLocale]}
      className={cn("h-full", "antialiased", fontVariables, "font-sans")}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AnalyticsTracker />
        <SiteContentProvider content={content}>
          <PremiumLoader />
          <Navbar locale={currentLocale} />
          <main className="flex-1">{children}</main>
          <Footer locale={currentLocale} settings={settings} />
          <WhatsAppButton locale={currentLocale} />
        </SiteContentProvider>
      </body>
    </html>
  );
}
