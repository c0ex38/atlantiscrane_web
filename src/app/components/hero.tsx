import type { Locale } from "../lib/site-content";
import { translations } from "../lib/site-content";

type HeroProps = {
  locale: Locale;
};

export default function Hero({ locale }: HeroProps) {
  const t = translations[locale];

  return (
    <section
      id="hero"
      className="relative -mt-24 min-h-[100svh] overflow-hidden pt-24"
    >
      <div className="absolute inset-0">
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/hero-loop.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),rgba(15,23,42,0.18)_55%,rgba(15,23,42,0.42))]" />

      <div className="relative flex min-h-[100svh] items-start justify-center px-4 pt-10 sm:pt-12">
      </div>
    </section>
  );
}
