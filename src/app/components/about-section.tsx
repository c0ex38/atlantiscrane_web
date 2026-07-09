"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { translations, type Locale, sectionIds } from "../lib/site-content";

type AboutSectionProps = {
  locale: Locale;
};

export default function AboutSection({ locale }: AboutSectionProps) {
  const t = translations[locale];
  const { 
    eyebrow, 
    title, 
    subtitleHighlight, 
    subtitle, 
    description, 
    primaryBtn, 
    secondaryBtn 
  } = t.about;
  return (
    <section id={sectionIds.about} className="bg-white py-24 sm:py-32 relative overflow-hidden">
      <div className="relative z-10 mx-auto w-full max-w-none px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
        <div className="mx-auto max-w-[1600px] text-center">
          
          {/* Eyebrow */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-lg md:text-xl text-cta font-medium mb-6 italic"
            style={{ fontFamily: "var(--font-serif), serif" }}
          >
            {eyebrow}
          </motion.p>

          {/* Title & Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mb-10 w-full max-w-none text-4xl font-black leading-[0.96] tracking-tight text-slate-900 md:text-5xl lg:text-[4.1rem]"
          >
            <h2 className="w-full text-center">
              <span className="block">{title}</span>
              <span className="block">
                <span className="text-cta">{subtitleHighlight}</span>
                {subtitle}
              </span>
            </h2>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mb-14 max-w-6xl text-base leading-relaxed text-slate-600 md:text-lg"
          >
            {description}
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link 
              href={`/${locale}#${sectionIds.about}`}
              className="w-full sm:w-auto px-10 py-4 bg-[#1b1b36] text-white font-black text-sm tracking-wider hover:bg-black transition-colors uppercase"
            >
              {primaryBtn}
            </Link>
            <Link 
              href={`/${locale}#${sectionIds.production}`}
              className="w-full sm:w-auto px-10 py-4 bg-transparent border border-slate-300 text-[#1b1b36] font-black text-sm tracking-wider hover:border-[#1b1b36] transition-colors uppercase"
            >
              {secondaryBtn}
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
