"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type AboutHeroProps = {
  description: string;
  content: {
    title1: string;
    titleHighlight: string;
    title2: string;
  };
};



export default function AboutHero({ description, content }: AboutHeroProps) {
  return (
    <section className="relative -mt-24 overflow-hidden bg-white pt-44 pb-0">

      {/* Background crane image — very faint */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/about-facility.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-[0.07]"
          priority
          aria-hidden
        />
        {/* Light overlay so image stays barely visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white/90" />
      </div>

      <div className="container-shell relative z-10">

        {/* Big headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.85, 0, 0.15, 1] }}
          className="font-black tracking-tight leading-[1.05] text-[color:var(--text)] mb-6"
          style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)" }}
        >
          {content.title1}
          <br className="hidden sm:block" />
          <span className="text-cta">{content.titleHighlight}</span>
          {content.title2}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2 }}
          className="text-slate-600 text-base md:text-lg leading-relaxed max-w-xl mb-10"
        >
          {description}
        </motion.p>
      </div>
    </section>
  );
}
