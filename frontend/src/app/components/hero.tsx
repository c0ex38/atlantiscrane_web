"use client";

import type { Locale } from "../lib/site-content";
import { useSiteContent } from "./site-content-provider";
import Link from "next/link";
import { motion } from "framer-motion";

type HeroProps = {
  locale: Locale;
};

export default function Hero({ locale }: HeroProps) {
  const t = useSiteContent(locale);
  const { eyebrow, title, description, primaryCta, secondaryCta, videoUrl } = t.hero;

  return (
    <section
      id="hero"
      className="relative -mt-24 min-h-[100svh] overflow-hidden pt-24 flex items-center justify-center"
    >
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          key={videoUrl || "/hero-loop.mp4"}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src={videoUrl || "/hero-loop.mp4"} type="video/mp4" />
        </video>
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center justify-center">
        {/* Eyebrow */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-cta bg-cta/10 border border-cta/25 mb-8 backdrop-blur-md"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cta animate-pulse" />
          {eyebrow}
        </motion.span>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight max-w-4xl leading-[1.05] mb-6"
        >
          {title}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg lg:text-xl text-slate-200 max-w-2xl mb-12 font-medium leading-relaxed"
        >
          {description}
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Link
            href={`/${locale}/contact`}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-sm font-bold text-slate-900 bg-gradient-to-r from-cta to-[#fdd14a] hover:from-[#e5b31c] hover:to-[#e8bf3a] rounded-full transition-all duration-300 shadow-[0_8px_25px_rgba(253,197,32,0.35)] hover:scale-[1.02]"
          >
            {primaryCta}
          </Link>
          <Link
            href={`/${locale}/products`}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/35 rounded-full transition-all duration-300 backdrop-blur-md hover:scale-[1.02]"
          >
            {secondaryCta}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
