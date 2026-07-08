import { notFound } from "next/navigation";
import { isLocale, translations, type Locale } from "../../lib/site-content";
import AboutHero from "./components/about-hero";
import AboutMarquee from "./components/about-marquee";
import AboutStory from "./components/about-story";
import AboutNumbers from "./components/about-numbers";
import AboutMilestones from "./components/about-milestones";
import AboutMission from "./components/about-mission";
import CtaSection from "../../components/cta-section";

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
  const t = translations[currentLocale];
  const { about, history, aboutPage } = t;

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
