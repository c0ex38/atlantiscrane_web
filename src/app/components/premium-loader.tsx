"use client";

import { startTransition, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function PremiumLoader() {
  const pathname = usePathname();
  const isHomePage = pathname === '/' || pathname === '/tr' || pathname === '/en' || pathname === '/ar';
  const [isLoading, setIsLoading] = useState(isHomePage);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (!isHomePage) return;

    // Scroll to top immediately if no hash is present in the URL
    if (typeof window !== "undefined" && !window.location.hash) {
      window.scrollTo(0, 0);
    }

    startTransition(() => {
      setIsLoading(true);
      setCounter(0);
    });

    document.body.style.overflow = "hidden";

    let currentCount = 0;
    const interval = setInterval(() => {
      currentCount += Math.random() * 3 + 1.2;
      if (currentCount >= 100) {
        currentCount = 100;
        setCounter(currentCount);
        clearInterval(interval);
      } else {
        setCounter(currentCount);
      }
    }, 30);

    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = "";
      // Ensure page is scrolled to the top when the intro animation finishes (combating async browser scroll restoration)
      if (typeof window !== "undefined" && !window.location.hash) {
        window.scrollTo(0, 0);
      }
    }, 1800);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [pathname, isHomePage]);

  const columns = 5;

  return (
    <AnimatePresence>
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex pointer-events-none bg-black">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.05 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center overflow-hidden z-0 pointer-events-none"
          >
            <h1
              className="text-[30vw] font-black text-transparent uppercase leading-none"
              style={{ WebkitTextStroke: "2px #fdc520" }}
            >
              LIFT
            </h1>
          </motion.div>

          <div className="absolute inset-0 flex z-10">
            {Array.from({ length: columns }).map((_, i) => {
              const delay = Math.abs(2 - i) * 0.15;

              return (
                <motion.div
                  key={i}
                  initial={{ scaleY: 1 }}
                  exit={{
                    scaleY: 0,
                    transition: {
                      duration: 0.8,
                      ease: [0.85, 0, 0.15, 1],
                      delay,
                    },
                  }}
                  style={{ transformOrigin: "top" }}
                  className="h-full w-1/5 bg-[color:var(--text)] border-r border-white/5 last:border-r-0 pointer-events-auto"
                />
              );
            })}
          </div>

          <motion.div
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none"
          >
            <div className="relative flex items-center justify-center w-full">
              {/* Subtitle - Absolutely positioned behind (z-10) */}
              <div className="absolute inset-0 flex items-start justify-center pt-2 md:pt-6 z-10 pointer-events-none">
                <div className="overflow-hidden">
                  <motion.p
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                    className="text-cta text-[10px] md:text-xs tracking-[0.6em] uppercase font-bold"
                  >
                    Marine Lifting Engineering
                  </motion.p>
                </div>
              </div>

              {/* Main Title - On top (z-20) with padding to prevent clipping and allow overlap */}
              <div className="overflow-hidden relative z-20 flex items-end pt-8 md:pt-14">
                <motion.h1
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, delay: 0.1, ease: [0.85, 0, 0.15, 1] }}
                  className="text-5xl font-black uppercase leading-[0.9] tracking-tight text-white md:text-8xl lg:text-[8rem]"
                >
                  ATLANTİS
                </motion.h1>
                <motion.span
                  initial={{ opacity: 0, scale: 0.5, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6, ease: "backOut" }}
                  className="text-2xl md:text-4xl font-black text-cta ml-4 mb-1 md:mb-4"
                >
                  CRANE
                </motion.span>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, ease: "easeOut" }}
              className="absolute bottom-12 right-8 md:bottom-16 md:right-16 text-white font-black text-6xl md:text-8xl flex items-baseline gap-2"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {counter.toFixed(1)}
              <span className="text-cta text-3xl md:text-5xl mb-2">%</span>
            </motion.div>

            <motion.div
              className="absolute bottom-8 right-8 md:bottom-12 md:right-16 h-[2px] bg-white/10"
              style={{ width: "200px" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div
                className="absolute top-0 right-0 h-full bg-cta transition-all duration-[30ms] ease-linear"
                style={{ width: `${counter}%` }}
              />
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
