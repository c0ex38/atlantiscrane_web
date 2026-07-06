import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import PremiumLoader from "../components/premium-loader";
import {
  isLocale,
  localeDirections,
  type Locale,
} from "../lib/site-content";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return [{ locale: "tr" }, { locale: "en" }, { locale: "ar" }];
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const currentLocale = locale as Locale;

  return (
    <div
      lang={currentLocale}
      dir={localeDirections[currentLocale]}
      className="flex min-h-screen flex-col"
    >
      <PremiumLoader />
      <Navbar locale={currentLocale} />
      <main className="flex-1">{children}</main>
      <Footer locale={currentLocale} />
    </div>
  );
}
