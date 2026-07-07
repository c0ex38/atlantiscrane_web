"use client";

import { motion } from "framer-motion";

const brands = [
  "DNV GL", "Lloyd's Register", "Bureau Veritas", "ABS", "C5-M Deniz Boyası",
  "FEM Analizi", "Tuzla Tersanesi", "DNV GL", "Lloyd's Register", "Bureau Veritas",
  "ABS", "C5-M Deniz Boyası", "FEM Analizi", "Tuzla Tersanesi",
];

export default function AboutMarquee() {
  return (
    <div className="overflow-hidden bg-[color:var(--cta)] py-4 border-y-0">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        className="flex items-center gap-0 w-max"
      >
        {[...brands, ...brands].map((brand, i) => (
          <div key={i} className="flex items-center gap-0 shrink-0">
            <span className="px-6 text-slate-900 font-black text-xs tracking-[0.2em] uppercase whitespace-nowrap">
              {brand}
            </span>
            <span className="text-slate-900/40 font-bold text-lg select-none">·</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
