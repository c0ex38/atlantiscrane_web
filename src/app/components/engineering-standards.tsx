"use client";

import { motion } from "framer-motion";
import { translations, type Locale } from "../lib/site-content";

type EngineeringStandardsProps = {
  locale: Locale;
};

// Simple outline SVGs corresponding to the 3 items: Shield, Droplet, Cube
const icons = [
  <svg key="shield" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-900"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>,
  <svg key="droplet" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-900"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>,
  <svg key="cube" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-900"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
];

export default function EngineeringStandards({ locale }: EngineeringStandardsProps) {
  const t = translations[locale];
  const { eyebrow, title, items } = t.standards;

  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="container-shell">
        {/* Header */}
        <div className="mb-16 md:mb-24">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-sm font-semibold text-[color:var(--cta)] tracking-wider mb-4"
          >
            {eyebrow}
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-[color:var(--text)] tracking-tight max-w-3xl"
          >
            {title}
          </motion.h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: index * 0.15, ease: [0.25, 1, 0.5, 1] }}
              className="group bg-white border border-slate-200 p-8 sm:p-12 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(27,27,54,0.06)] hover:-translate-y-2 flex flex-col"
            >
              {/* Top Row: Number & Icon */}
              <div className="flex items-center justify-between mb-8">
                <span className="text-4xl font-light text-[color:var(--cta)]">
                  0{index + 1}
                </span>
                <div className="p-3 rounded-xl bg-slate-50 transition-colors duration-500 group-hover:bg-[color:var(--cta)]/10">
                  {icons[index]}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-[color:var(--text)] mb-4">
                {item.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
