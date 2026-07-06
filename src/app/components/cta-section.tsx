"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { translations, type Locale, sectionIds } from "../lib/site-content";

type CtaSectionProps = {
  locale: Locale;
};

export default function CtaSection({ locale }: CtaSectionProps) {
  const t = translations[locale];
  const { eyebrow, title, description, primaryBtn, secondaryBtn } = t.ctaSection;

  return (
    <section className="bg-[#FFD700] py-24 sm:py-32 relative overflow-hidden">
      {/* Alt sınır CTA ile footer arasında net bir ayrım oluşturur. */}
      
      <div className="container-shell relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-lg md:text-xl text-slate-800 font-semibold mb-6 italic"
            style={{ fontFamily: "var(--font-serif), serif" }}
          >
            {eyebrow}
          </motion.p>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-8"
          >
            {title.split("\n").map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-800 leading-relaxed max-w-3xl mx-auto mb-12 font-medium"
          >
            {description}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
          >
            <Link 
              href={`/${locale}#${sectionIds.contact}`}
              className="w-full sm:w-auto px-10 py-4 bg-slate-900 text-white font-black text-sm tracking-wider hover:bg-black transition-colors uppercase"
            >
              {primaryBtn}
            </Link>
            <Link 
              href={`/${locale}#${sectionIds.contact}`}
              className="w-full sm:w-auto px-10 py-4 bg-transparent border-2 border-slate-900 text-slate-900 font-black text-sm tracking-wider hover:bg-slate-900 hover:text-white transition-colors uppercase"
            >
              {secondaryBtn}
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
