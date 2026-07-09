"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, animate } from "framer-motion";

type Stat = {
  value: string;
  label: string;
  suffix: string;
};

type AboutStatsProps = {
  stats: readonly Stat[];
};

function Counter({ value, suffix }: { value: string; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-50px" });
  const isNumeric = /^\d+$/.test(value);
  const numericTarget = isNumeric ? parseInt(value, 10) : 0;
  const [displayed, setDisplayed] = useState(isNumeric ? 0 : value);

  useEffect(() => {
    if (!isNumeric) return;

    if (!isInView) {
      // Reset when scrolled out of view
      const timeout = setTimeout(() => setDisplayed(0), 50);
      return () => clearTimeout(timeout);
    }

    const controls = animate(0, numericTarget, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate(val) {
        setDisplayed(Math.floor(val));
      },
    });
    return () => controls.stop();
  }, [isInView, isNumeric, numericTarget]);

  return (
    <span ref={ref} className="tabular-nums">
      {displayed}{suffix}
    </span>
  );
}

export default function AboutStats({ stats }: AboutStatsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });

  return (
    <section ref={sectionRef} className="bg-white border-y border-slate-100 py-16 sm:py-20">
      <div className="container-shell">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{
                duration: 0.7,
                delay: index * 0.12,
                ease: [0.25, 1, 0.5, 1],
              }}
              className="flex flex-col items-center text-center px-8 py-10 sm:py-8 group"
            >
              <div className="text-5xl md:text-6xl font-black text-[color:var(--text)] tracking-tight mb-3 leading-none">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="h-px w-10 bg-cta mb-3 transition-all duration-500 group-hover:w-20" />
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
