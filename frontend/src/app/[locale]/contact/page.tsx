import { notFound } from "next/navigation";
import { isLocale, translations, localeDirections, type Locale } from "../../lib/site-content";
import ContactClient from "./components/contact-client";
import { getSettings, getSiteDictionary } from "../../lib/api";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const t = await getSiteDictionary(locale);

  return {
    title: `${t?.nav?.contact ?? "Contact"} | Atlantis Crane`,
    description: t?.contact?.description,
  };
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const settings = await getSettings();
  const baseT = await getSiteDictionary(locale);
  
  // Contact coordinates remain separate settings; all page copy comes from site_content.
  const t = {
    ...baseT,
    contact: {
      ...baseT.contact,
      email: settings?.contact_email?.email || baseT.contact.email,
      phone: settings?.contact_phone?.phone || baseT.contact.phone,
      addressIstanbul: settings?.address_istanbul?.[locale] || baseT.contact.addressIstanbul,
      addressDubai: settings?.address_dubai?.[locale] || baseT.contact.addressDubai,
    }
  };

  const isRtl = localeDirections[locale] === "rtl";

  return (
    <main className="min-h-screen bg-[#f0f3f8] text-[#0f172a] -mt-24 pt-44 pb-0 overflow-hidden relative">
      {/* Subtle top gradient to blend with header */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-[#070b14]/5 to-transparent pointer-events-none" />
      <ContactClient t={t} isRtl={isRtl} />
    </main>
  );
}
