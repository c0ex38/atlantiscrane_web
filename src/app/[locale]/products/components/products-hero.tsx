"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export type ProductsHeroProps = {
  title: string;
  description: string;
};

export default function ProductsHero({ title, description }: ProductsHeroProps) {
  return (
    <section className="relative -mt-24 overflow-hidden bg-white pt-44 pb-20 md:pb-32">
      {/* Background image — very faint */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/about-facility.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-[0.06]"
          priority
          aria-hidden
        />
        {/* Light overlay so image stays barely visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white/95" />
      </div>

      <div className="container-shell relative z-10">
        <motion.p
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-3 text-[10px] font-mono tracking-[0.35em] text-cta uppercase mb-6"
        >
          <span className="w-8 h-px bg-cta" />
          Atlantis Crane — Ürün Portföyü
        </motion.p>

        {/* Big headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.85, 0, 0.15, 1] }}
          className="font-black tracking-tight leading-[0.95] text-[color:var(--text)] mb-8"
          style={{ fontSize: "clamp(3.2rem, 9vw, 8rem)" }}
        >
          {title}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2 }}
          className="text-slate-600 text-base md:text-lg leading-relaxed max-w-xl"
        >
          {description}
        </motion.p>
      </div>
    </section>
  );
}
