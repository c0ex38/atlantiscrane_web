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
    <section className="relative overflow-hidden border-b border-white/10 bg-[linear-gradient(180deg,#20203e_0%,#1b1b36_100%)] py-24 sm:py-32">
      {/* Alt sınır CTA ile footer arasında net bir ayrım oluşturur. */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#141429]/45 pointer-events-none" />
      
      <div className="container-shell relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-lg md:text-xl text-[color:var(--cta)] font-medium mb-6"
            style={{ fontFamily: "var(--font-serif), serif" }}
          >
            {eyebrow}
          </motion.p>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-8"
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
            className="text-slate-300 leading-relaxed max-w-3xl mx-auto mb-12"
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
              className="w-full sm:w-auto px-10 py-4 bg-[color:var(--cta)] text-slate-950 font-black text-sm tracking-wider hover:bg-yellow-400 transition-colors uppercase"
            >
              {primaryBtn}
            </Link>
            <Link 
              href={`/${locale}#${sectionIds.contact}`}
              className="w-full sm:w-auto px-10 py-4 bg-transparent border border-slate-600 text-white font-black text-sm tracking-wider hover:border-white hover:bg-white/5 transition-colors uppercase"
            >
              {secondaryBtn}
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
