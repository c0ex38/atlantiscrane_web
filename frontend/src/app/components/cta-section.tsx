"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { translations, type Locale, sectionIds } from "../lib/site-content";
import { useSiteContent } from "./site-content-provider";

type CtaSectionProps = {
  locale: Locale;
};

export default function CtaSection({ locale }: CtaSectionProps) {
  const t = useSiteContent(locale);
  const { eyebrow, title, description, primaryBtn, secondaryBtn } = t.ctaSection;

  return (
    <section className="bg-[#FFD700] py-24 sm:py-32 relative overflow-hidden">
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
            className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-8 [&_span]:text-white"
            dangerouslySetInnerHTML={{ __html: (title || "").replace(/\n/g, "<br/>") }}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-800 leading-relaxed max-w-3xl mx-auto mb-12 font-medium [&_span]:text-slate-900 [&_span]:font-bold"
            dangerouslySetInnerHTML={{ __html: (description || "").replace(/\n/g, "<br/>") }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
          >
            <Link
              href={`/${locale}/contact`}
              className="w-full sm:w-auto px-10 py-4 bg-slate-900 text-white font-black text-sm tracking-wider hover:bg-black transition-colors uppercase"
            >
              {primaryBtn}
            </Link>
            <Link
              href={`/${locale}/contact`}
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
