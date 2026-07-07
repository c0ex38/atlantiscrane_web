"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, animate } from "framer-motion";

type Stat = {
  value: string;
  label: string;
  suffix: string;
};

type AboutNumbersProps = {
  stats: readonly Stat[];
};

function Counter({ value, suffix }: { value: string; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-50px" });
  const isNumeric = /^\d+$/.test(value);
  const numericTarget = isNumeric ? parseInt(value, 10) : 0;
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    if (!isNumeric) return;
    if (!isInView) {
      const t = setTimeout(() => setDisplayed(0), 50);
      return () => clearTimeout(t);
    }
    const controls = animate(0, numericTarget, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (v) => setDisplayed(Math.floor(v)),
    });
    return () => controls.stop();
  }, [isInView, isNumeric, numericTarget]);

  if (!isNumeric) return <span className="tabular-nums">{value}{suffix}</span>;
  return <span ref={ref} className="tabular-nums">{displayed}{suffix}</span>;
}

export default function AboutNumbers({ stats }: AboutNumbersProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <section ref={ref} className="bg-[#0d0d1a] py-24 overflow-hidden relative">
      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="container-shell relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.7, delay: index * 0.14, ease: [0.25, 1, 0.5, 1] }}
              className="flex flex-col items-center text-center py-12 sm:py-16 px-6 border-b sm:border-b-0 sm:border-r border-white/5 last:border-0 group"
            >
              <div
                className="font-black leading-none text-white mb-4 tracking-tight"
                style={{ fontSize: "clamp(3.5rem, 7vw, 6rem)" }}
              >
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="w-8 h-px bg-[color:var(--cta)] mb-4 transition-all duration-500 group-hover:w-16" />
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-[0.2em]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
