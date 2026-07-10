"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { translations, type Locale } from "../lib/site-content";

type HistoryTimelineProps = {
  locale: Locale;
};

export default function HistoryTimeline({ locale }: HistoryTimelineProps) {
  const t = translations[locale];
  const { items, eyebrow, title } = t.history;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollRange, setScrollRange] = useState(0);

  // Measure the width of the scroll container to determine horizontal translation range
  useEffect(() => {
    const calculateRange = () => {
      if (scrollRef.current) {
        const range = scrollRef.current.scrollWidth - window.innerWidth;
        setScrollRange(range > 0 ? range : 0);
      }
    };

    // Calculate after rendering
    const timer = setTimeout(calculateRange, 100);

    window.addEventListener("resize", calculateRange);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", calculateRange);
    };
  }, [items]);

  // Track the vertical scroll of the section container
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });

  // Smooth out the scroll progress using spring for premium feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.001
  });

  // Map scroll progress to horizontal translation (translateX)
  const x = useTransform(smoothProgress, [0, 1], ["0px", `-${scrollRange}px`]);

  return (
    <section 
      ref={containerRef} 
      className="relative bg-[color:var(--bg)] min-h-[110vh] md:h-[220vh] overflow-visible border-t border-slate-100"
    >
      {/* Pinned Sticky container for desktop - offset top to prevent overlapping with floating navbar */}
      <div className="md:sticky md:top-[96px] md:h-[calc(100vh-96px)] md:overflow-hidden flex flex-col justify-center py-20 md:py-0 z-10">
        
        {/* Header container */}
        <div className="container-shell mb-8 md:mb-12">
          <div className="max-w-3xl mx-auto text-center">
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-lg md:text-xl font-medium italic text-cta mb-3"
              style={{ fontFamily: "var(--font-serif), serif" }}
            >
              {eyebrow}
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[color:var(--text)] tracking-tight"
            >
              {title}
            </motion.h2>
          </div>
        </div>

        {/* Desktop Horizontal Pinned Scroll View */}
        <div className="hidden md:block relative w-full overflow-hidden">
          {/* Main Horizontal Timeline Line */}
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-slate-200 -translate-y-1/2 z-0" />
          
          {/* Animated Main Horizontal Line (Scroll progress) */}
          <motion.div 
            className="absolute top-1/2 left-0 h-[3px] bg-gradient-to-r from-cta/40 via-cta to-cta -translate-y-1/2 origin-left z-10 shadow-[0_0_12px_#fdc520]"
            style={{ scaleX: smoothProgress }}
          />

          {/* Scrolling content container */}
          <motion.div 
            ref={scrollRef}
            style={{ x }} 
            className="flex items-center gap-16 px-[15vw] py-10 w-max relative z-20"
          >
            {items.map((item, index) => {
              const isEven = index % 2 === 0;

              return (
                <div 
                  key={item.year} 
                  className="w-[360px] h-[480px] relative shrink-0 flex items-center justify-center"
                >
                  {/* Connection Dot Radar Pulse */}
                  <motion.div 
                    animate={{ scale: [0.8, 1.7, 0.8], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-cta/40 z-20 pointer-events-none"
                  />

                  {/* Main Connection Dot */}
                  <motion.div 
                    initial={{ scale: 0.4, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: false, amount: 0.8 }}
                    transition={{ type: "spring", stiffness: 120, damping: 12 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-4 border-cta z-30 shadow-md"
                  />

                  {isEven ? (
                    /* Card below the line - Compact dynamic container centered horizontally */
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 flex flex-col items-center justify-start pt-2 w-[320px]">
                      {/* Self-drawing vertical connector line */}
                      <motion.div 
                        initial={{ height: 0 }}
                        whileInView={{ height: 32 }}
                        viewport={{ once: false, amount: 0.8 }}
                        transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
                        className="w-[1.5px] bg-gradient-to-b from-cta to-slate-200 shrink-0" 
                      />
                      
                      {/* Card */}
                      <motion.div 
                        initial={{ opacity: 0, y: 35, scale: 0.94 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{ type: "spring", stiffness: 70, damping: 14 }}
                        className="bg-white border border-slate-200 rounded-xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_15px_40px_rgb(0,0,0,0.04)] transition-all duration-300 w-full"
                      >
                        <div className="space-y-2">
                          <span className="block text-xl font-black text-cta">
                            {item.year}
                          </span>
                          <h3 className="text-base font-bold text-slate-900 leading-snug">
                            {item.title}
                          </h3>
                          <p className="text-slate-600 text-xs leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  ) : (
                    /* Card above the line - Compact dynamic container centered horizontally */
                    <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 flex flex-col-reverse items-center justify-start pb-2 w-[320px]">
                      {/* Self-drawing vertical connector line */}
                      <motion.div 
                        initial={{ height: 0 }}
                        whileInView={{ height: 32 }}
                        viewport={{ once: false, amount: 0.8 }}
                        transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
                        className="w-[1.5px] bg-gradient-to-t from-cta to-slate-200 shrink-0" 
                      />

                      {/* Card */}
                      <motion.div 
                        initial={{ opacity: 0, y: -35, scale: 0.94 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{ type: "spring", stiffness: 70, damping: 14 }}
                        className="bg-white border border-slate-200 rounded-xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_15px_40px_rgb(0,0,0,0.04)] transition-all duration-300 w-full"
                      >
                        <div className="space-y-2">
                          <span className="block text-xl font-black text-cta">
                            {item.year}
                          </span>
                          <h3 className="text-base font-bold text-slate-900 leading-snug">
                            {item.title}
                          </h3>
                          <p className="text-slate-600 text-xs leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Mobile Horizontal Touch-swipe Carousel */}
        <div className="md:hidden w-full overflow-x-auto snap-x snap-mandatory scrollbar-none py-6 px-6 flex gap-6 scroll-smooth">
          {items.map((item) => {
            return (
              <div 
                key={item.year} 
                className="snap-center shrink-0 w-[85vw] max-w-[320px] bg-white border border-slate-200 rounded-xl p-6 shadow-[0_8px_20px_rgba(0,0,0,0.02)] relative overflow-hidden"
              >
                <div className="space-y-3">
                  <span className="block text-xl font-black text-cta">
                    {item.year}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
