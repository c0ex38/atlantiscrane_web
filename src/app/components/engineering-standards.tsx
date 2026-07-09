"use client";

import { motion } from "framer-motion";
import { translations, type Locale } from "../lib/site-content";

type EngineeringStandardsProps = {
  locale: Locale;
};

// Premium custom SVGs (Slate/Navy outline with gold accents representing each technical standard)
const icons = [
  // Standard 1: Global Certification (Award/Certificate)
  <svg key="award" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 transition-transform duration-500 group-hover:scale-110">
    <circle cx="12" cy="8" r="6" fill="none" stroke="#1b1b36" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" fill="none" stroke="var(--cta)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  // Standard 2: C5-M Marine Paint (Paintbrush/Coating)
  <svg key="paintbrush" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 transition-transform duration-500 group-hover:scale-110">
    <path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" fill="none" stroke="#1b1b36" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" fill="none" stroke="var(--cta)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  // Standard 3: Finite Element Analysis (Drafting Compass/Design)
  <svg key="compass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 transition-transform duration-500 group-hover:scale-110">
    <circle cx="12" cy="5" r="2" fill="none" stroke="#1b1b36" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="m3 21 8.02-14.26M21 21l-8.02-14.26" fill="none" stroke="#1b1b36" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 14h8" fill="none" stroke="var(--cta)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-transparent group-hover:bg-cta transition-all duration-500" />

                {/* Top Row: Number & Icon */}
                <div className="flex items-center justify-between mb-8">
                  <span className="text-4xl font-extralight text-slate-200 group-hover:text-cta/50 transition-colors duration-500 font-sans select-none">
                    0{index + 1}
                  </span>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 transition-all duration-500 group-hover:bg-cta/5 group-hover:border-cta/20">
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
