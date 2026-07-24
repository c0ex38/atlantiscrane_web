"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { translations, type Locale, sectionIds } from "../lib/site-content";
import { useSiteContent } from "./site-content-provider";

type ReferencesSectionProps = {
  locale: Locale;
  references?: any[]; // Passed from page.tsx
};

export default function ReferencesSection({ locale, references = [] }: ReferencesSectionProps) {
  const t = useSiteContent(locale);
  const { eyebrow, title, description, note } = t.projects;

  return (
    <section id={sectionIds.projects} className="bg-white py-24 sm:py-32 relative overflow-hidden border-t border-slate-100">
      <div className="container-shell relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-lg md:text-xl font-medium italic text-cta mb-4"
            style={{ fontFamily: "var(--font-serif), serif" }}
          >
            {eyebrow}
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-[color:var(--text)] tracking-tight mb-6"
          >
            {title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-600 leading-relaxed"
          >
            {description}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mb-12">
          {references.map((item, index) => {
            const itemTitle = item.title?.[locale] || item.title?.tr || item.title?.en || "";
            const itemImage = item.image || "/about-facility.png";

            return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-100 flex flex-col hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              {/* Image Section */}
              <div className="relative aspect-[4/3] w-full bg-slate-50 p-8 flex items-center justify-center">
                <Image
                  src={itemImage}
                  alt={itemTitle}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain p-12 group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Content Section */}
              <div className="p-6 flex items-center justify-center border-t border-slate-100 bg-white min-h-[80px]">
                <h3 className="text-base font-bold text-slate-800 text-center group-hover:text-cta transition-colors line-clamp-2">
                  {itemTitle}
                </h3>
              </div>
            </motion.div>
          )})}
        </div>

        {/* Footnote */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.7 }}
          viewport={{ once: true }}
          className="text-center text-xs text-slate-500 font-medium italic mt-8"
        >
          ℹ️ {note}
        </motion.p>

      </div>
    </section>
  );
}
