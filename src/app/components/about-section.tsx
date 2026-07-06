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
      <div className="container-shell relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          
          {/* Eyebrow */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-lg md:text-xl text-[color:var(--cta)] font-medium mb-6 italic"
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
            className="text-4xl md:text-5xl lg:text-[4rem] leading-tight md:leading-tight lg:leading-[1.1] font-black text-slate-900 tracking-tight mb-10"
          >
            <h2 className="block mb-2">{title}</h2>
            <div className="block">
              <span className="text-[color:var(--cta)]">{subtitleHighlight}</span>{" "}
              {subtitle}
            </div>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto mb-14"
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
