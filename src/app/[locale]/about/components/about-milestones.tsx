"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Milestone = {
  year: string;
  title: string;
  description: string;
};

type AboutMilestonesProps = {
  items: readonly Milestone[];
  eyebrow: string;
  content: {
    title1: string;
    titleHighlight: string;
    title2: string;
  };
};

export default function AboutMilestones({ items, eyebrow, content }: AboutMilestonesProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-slate-50 py-24 sm:py-32 border-t border-slate-100">
      <div className="container-shell">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 lg:gap-24 items-start">

          {/* Left: sticky header */}
          <div className="lg:sticky lg:top-28">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="text-xs font-mono tracking-[0.3em] text-cta uppercase mb-6 flex items-center gap-3"
            >
              <span className="w-6 h-px bg-cta" /> {eyebrow}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.08 }}
              className="text-5xl md:text-6xl font-black tracking-tight leading-[0.92] text-[color:var(--text)]"
            >
              {content.title1}
              <br className="hidden sm:block" />
              <span className="text-cta">{content.titleHighlight}</span>
              {content.title2}
            </motion.h2>
          </div>

          {/* Right: accordion milestones */}
          <div className="space-y-0 divide-y divide-slate-200">
            {items.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    onMouseEnter={() => setOpenIndex(index)}
                    className="w-full flex items-center gap-6 sm:gap-10 py-7 text-left group focus:outline-none"
                  >
                    {/* Year */}
                    <span
                      className="font-black tabular-nums shrink-0 transition-colors duration-300 leading-none"
                      style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
                    >
                      <span className={isOpen ? "text-cta" : "text-slate-200 group-hover:text-slate-300 transition-colors"}>
                        {item.year}
                      </span>
                    </span>

                    {/* Title */}
                    <span className="flex-1 text-lg md:text-xl font-bold text-slate-700 group-hover:text-slate-900 transition-colors duration-300">
                      {item.title}
                    </span>

                    {/* Toggle icon */}
                    <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 ${isOpen ? "bg-cta border-cta" : "border-slate-200 group-hover:border-slate-400"}`}>
                      <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180 text-slate-900" : "text-slate-400"}`}
                      >
                        <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </button>

                  {/* Expandable description */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pb-7 pl-[clamp(3.5rem,7vw,7rem)]">
                          <div className="flex gap-4 items-start">
                            <div className="w-0.5 self-stretch shrink-0 mt-0.5 bg-cta/30" />
                            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
