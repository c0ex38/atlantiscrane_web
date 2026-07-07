"use client";

import { motion } from "framer-motion";
import { translations, type Locale } from "../lib/site-content";

type EngineeringStandardsProps = {
  locale: Locale;
};

// Premium custom SVGs (Slate/Navy outline with gold accents representing each technical standard)
const icons = [
  // Standard 1: Global Certification (Lloyd's Register, DNV, BV, ABS Shield)
  <svg key="shield" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 transition-transform duration-500 group-hover:scale-110">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="#1b1b36" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="m9 12 2 2 4-4" fill="none" stroke="var(--cta)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  // Standard 2: C5-M Marine Paint (Liquid droplet with inner coating protection layer)
  <svg key="droplet" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 transition-transform duration-500 group-hover:scale-110">
    <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" fill="none" stroke="#1b1b36" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 18.5a3.5 3.5 0 0 0 3.5-3.5c0-1-.5-2-1.5-2.8-.5-.4-1.2-1.2-1.5-2.2-.3 1-.8 1.8-1.5 2.2-1 .8-1.5 1.8-1.5 2.8a3.5 3.5 0 0 0 3.5 3.5z" fill="none" stroke="var(--cta)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  // Standard 3: Finite Element Analysis (3D structural mesh analysis node points)
  <svg key="cube" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 transition-transform duration-500 group-hover:scale-110">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" fill="none" stroke="#1b1b36" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" fill="none" stroke="#1b1b36" strokeWidth="1.2" />
    <line x1="12" y1="22.08" x2="12" y2="12" stroke="#1b1b36" strokeWidth="1.2" />
    <circle cx="12" cy="12" r="3" fill="none" stroke="var(--cta)" strokeWidth="1.5" />
    <circle cx="12" cy="2.5" r="1.2" fill="var(--cta)" />
    <circle cx="3" cy="7.5" r="1.2" fill="var(--cta)" />
    <circle cx="21" cy="7.5" r="1.2" fill="var(--cta)" />
    <circle cx="12" cy="21.5" r="1.2" fill="var(--cta)" />
  </svg>
];

const cardVariants = {
  hidden: {
    y: 150,
    x: 0,
    scale: 0.85,
    opacity: 0
  },
  visible: (index: number) => ({
    y: 0,
    x: 0,
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 70,
      damping: 15,
      mass: 1,
      delay: index * 0.15
    }
  })
};

export default function EngineeringStandards({ locale }: EngineeringStandardsProps) {
  const t = translations[locale];
  const { eyebrow, title, items } = t.standards;

  return (
    <section className="bg-gradient-to-b from-white to-slate-50/50 py-24 sm:py-32 overflow-hidden border-t border-slate-100">
      <div className="container-shell">
        {/* Header */}
        <div className="mb-16 md:mb-24 text-center max-w-3xl mx-auto">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-lg md:text-xl font-medium italic text-[color:var(--cta)] mb-4"
            style={{ fontFamily: "var(--font-serif), serif" }}
          >
            {eyebrow}
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[color:var(--text)] tracking-tight"
          >
            {title}
          </motion.h2>
        </div>

        {/* Grid Container with whileInView orchestration */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
        >
          {items.map((item, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              className="flex flex-col h-full"
            >
              {/* Inner card with hover accent line and clean shadow changes */}
              <div className="group bg-white border border-slate-200/80 rounded-2xl p-8 sm:p-12 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(27,27,54,0.04)] hover:-translate-y-2 flex flex-col h-full relative overflow-hidden">
                {/* Subtle top accent line on hover */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-transparent group-hover:bg-[color:var(--cta)] transition-all duration-500" />

                {/* Top Row: Number & Icon */}
                <div className="flex items-center justify-between mb-8">
                  <span className="text-4xl font-extralight text-slate-200 group-hover:text-[color:var(--cta)]/50 transition-colors duration-500 font-sans select-none">
                    0{index + 1}
                  </span>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 transition-all duration-500 group-hover:bg-[color:var(--cta)]/5 group-hover:border-[color:var(--cta)]/20">
                    {icons[index]}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-slate-900 mb-4 transition-colors duration-300 group-hover:text-[color:var(--accent-strong)]">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
