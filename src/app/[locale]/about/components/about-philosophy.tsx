"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type Value = {
  icon: string;
  title: string;
  description: string;
};

type AboutPhilosophyProps = {
  eyebrow: string;
  title: string;
  subtitleHighlight: string;
  subtitle: string;
  description: string;
  values: readonly Value[];
};

const valueIcons: Record<string, React.ReactNode> = {
  shield: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  gear: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  globe: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
};

export default function AboutPhilosophy({
  eyebrow,
  title,
  subtitleHighlight,
  subtitle,
  description,
  values,
}: AboutPhilosophyProps) {
  return (
    <section className="bg-[#0d0d1a] py-24 sm:py-32 overflow-hidden">
      <div className="container-shell">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left: Text content */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="text-lg font-medium italic text-[color:var(--cta)] mb-5"
              style={{ fontFamily: "var(--font-serif), serif" }}
            >
              {eyebrow}
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl md:text-5xl font-black tracking-tight leading-[1.0] text-white mb-6"
            >
              {title}
              <span className="block mt-1">
                <span className="text-[color:var(--cta)]">{subtitleHighlight}</span>{" "}
                <span className="text-white/60 font-light">{subtitle}</span>
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-400 text-sm md:text-base leading-relaxed mb-12"
            >
              {description}
            </motion.p>

            {/* Values list */}
            <div className="space-y-5">
              {values.map((val, index) => (
                <motion.div
                  key={val.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex gap-4 group"
                >
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-[color:var(--cta)]/10 border border-[color:var(--cta)]/20 flex items-center justify-center text-[color:var(--cta)] transition-colors duration-300 group-hover:bg-[color:var(--cta)]/20">
                    {valueIcons[val.icon]}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm mb-1">{val.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">{val.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Facility image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
            className="relative"
          >
            {/* Decorative gold border frame */}
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-[color:var(--cta)]/30 via-transparent to-[color:var(--cta)]/10" />
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
              <Image
                src="/about-facility.png"
                alt="Atlantis Crane Tuzla Production Facility"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              {/* Dark overlay bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d1a]/60 via-transparent to-transparent" />
              {/* Caption tag */}
              <div className="absolute bottom-5 left-5 flex items-center gap-2 px-3 py-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/10">
                <span className="w-2 h-2 rounded-full bg-[color:var(--cta)] animate-pulse" />
                <span className="text-white text-xs font-bold">Tuzla, İstanbul — Üretim Tesisi</span>
              </div>
            </div>
            {/* Floating stat badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute -top-5 -right-5 bg-[color:var(--cta)] rounded-2xl px-5 py-4 shadow-2xl"
            >
              <div className="text-2xl font-black text-slate-950 leading-none">25+</div>
              <div className="text-[10px] font-bold text-slate-800 uppercase tracking-wider mt-0.5">Yıllık Deneyim</div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
