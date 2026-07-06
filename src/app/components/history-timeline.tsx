"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { translations, type Locale } from "../lib/site-content";

type HistoryTimelineProps = {
  locale: Locale;
};

export default function HistoryTimeline({ locale }: HistoryTimelineProps) {
  const t = translations[locale];
  const { items, eyebrow, title } = t.history;
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  // We can animate the vertical line drawing down as you scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end end"]
  });
  
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="bg-[color:var(--bg)] py-24 sm:py-32 overflow-hidden">
      <div className="container-shell">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          className="text-center mb-20 space-y-4"
        >
          <p className="text-sm font-semibold text-[color:var(--cta)] tracking-wider">
            {eyebrow}
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[color:var(--text)] tracking-tight">
            {title}
          </h2>
        </motion.div>

        {/* Timeline Container */}
        <div ref={containerRef} className="relative max-w-4xl mx-auto">
          {/* Central Line Background */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 transform -translate-x-1/2 md:block hidden" />
          
          {/* Animated Central Line */}
          <motion.div 
            className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-[color:var(--cta)] transform -translate-x-1/2 origin-top md:block hidden"
            style={{ scaleY }}
          />

          <div className="space-y-12 md:space-y-0">
            {items.map((item, index) => {
              const isEven = index % 2 === 0; // 0, 2 are left. 1, 3 are right.
              
              return (
                <div key={item.year} className="relative flex items-center justify-between md:justify-normal md:even:flex-row-reverse group">
                  
                  {/* Mobile Line (hidden on desktop) */}
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-200 md:hidden" />
                  
                  {/* Icon/Dot */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-[color:var(--cta)] border-4 border-[color:var(--bg)] transform -translate-x-1/2 md:shadow-[0_0_0_4px_rgba(253,197,32,0.2)] z-10 transition-transform duration-500 group-hover:scale-150" />
                  
                  {/* Content Box */}
                  <motion.div 
                    initial={{ 
                      opacity: 0, 
                      x: isEven ? -50 : 50,
                      y: 30
                    }}
                    whileInView={{ 
                      opacity: 1, 
                      x: 0,
                      y: 0
                    }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ 
                      duration: 0.8, 
                      delay: 0.1,
                      ease: [0.25, 1, 0.5, 1] 
                    }}
                    className={`w-full pl-12 md:pl-0 md:w-1/2 ${
                      isEven ? "md:pr-16 lg:pr-24" : "md:pl-16 lg:pl-24"
                    }`}
                  >
                    <div className="bg-white border border-slate-100 p-8 sm:p-10 shadow-[0_20px_50px_rgba(27,27,54,0.04)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(27,27,54,0.08)] hover:-translate-y-1">
                      <div className="text-center space-y-3">
                        <span className="block text-[color:var(--cta)] font-black text-2xl tracking-wider">
                          {item.year}
                        </span>
                        <h3 className="text-xl font-bold text-slate-900 leading-tight">
                          {item.title}
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed max-w-sm mx-auto">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
