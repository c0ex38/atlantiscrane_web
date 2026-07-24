import { notFound } from "next/navigation";
import { isLocale, translations, type Locale } from "../../lib/site-content";
import AboutHero from "./components/about-hero";
import AboutMarquee from "./components/about-marquee";
import AboutStory from "./components/about-story";
import AboutNumbers from "./components/about-numbers";
import AboutMilestones from "./components/about-milestones";
import AboutMission from "./components/about-mission";
import CtaSection from "../../components/cta-section";
import { getSettings, getSiteDictionary } from "../../lib/api";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return [{ locale: "tr" }, { locale: "en" }, { locale: "ar" }];
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const currentLocale = locale as Locale;
  const settings = await getSettings();
  const t = await getSiteDictionary(currentLocale);
  const { about, history } = t;
  
  // Combine all possible sources of about page content, prioritizing specific about_page setting
  const dbAboutPage = settings.about_page?.[currentLocale] || settings.site_content?.[currentLocale]?.aboutPage || {};
  
  // Deep merge with fallback to ensure no properties are missing (like title1, etc.)
  const deepMerge = (target: any, source: any): any => {
    if (!source || typeof source !== "object" || Array.isArray(source)) return source === undefined ? target : source;
    const result = { ...target };
    for (const key of Object.keys(source)) {
      result[key] = source[key] && typeof source[key] === "object" && !Array.isArray(source[key]) 
        ? deepMerge(target[key], source[key]) 
        : source[key];
    }
    return result;
  };
  
  const aboutPage = deepMerge(t.aboutPage, dbAboutPage);

  return (
    <main className="min-h-screen">
      {/* 1. Cinematic hero with diagonal split */}
      <AboutHero
        description={about.description}
        content={aboutPage.hero}
      />

      {/* 2. Gold marquee certifications strip */}
      <AboutMarquee items={aboutPage.marquee} />

      {/* 3. Split-screen story + facility image */}
      <AboutStory content={aboutPage.story} />

      {/* 4. Minimalist dark numbers */}
      <AboutNumbers stats={about.stats} />

      {/* 5. Accordion milestones */}
      <AboutMilestones 
        items={history.items} 
        eyebrow={history.eyebrow} 
        content={aboutPage.milestones}
      />

      {/* 6. Full-screen mission quote */}
      <AboutMission content={aboutPage.mission} />

      {/* 7. About-specific contact CTA card */}
      <CtaSection locale={currentLocale} />
    </main>
  );
}
