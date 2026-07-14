"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { translations, type Locale, sectionIds } from "../lib/site-content";
import { useSiteContent } from "./site-content-provider";

type ReferencesSectionProps = {
  locale: Locale;
};

export default function ReferencesSection({ locale }: ReferencesSectionProps) {
  const t = useSiteContent(locale);
  const { eyebrow, title, description, note, items } = t.projects;

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

        {/* Grid Items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 flex flex-col h-full hover:shadow-[0_20px_50px_rgba(27,27,54,0.04)] hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image Section */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                  <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-cta text-slate-900 rounded">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 sm:p-8 flex flex-col flex-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                  {item.client}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 group-hover:text-cta transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed flex-1">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
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
