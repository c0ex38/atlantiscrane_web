"use client";

import { motion } from "framer-motion";

export default function AboutMission() {
  return (
    <section className="relative bg-[#0a0a14] py-32 overflow-hidden">
      {/* Background: huge quote mark */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 text-white/[0.02] font-black select-none pointer-events-none leading-none"
        style={{ fontSize: "clamp(20rem, 50vw, 60rem)" }}
        aria-hidden
      >
        &ldquo;
      </div>

      {/* Gold decorative top bar */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-[color:var(--cta)]" />

      <div className="container-shell relative z-10 flex flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-xs font-mono tracking-[0.3em] text-[color:var(--cta)] uppercase mb-12 flex items-center gap-3"
        >
          <span className="w-6 h-px bg-[color:var(--cta)]" />
          Misyonumuz
          <span className="w-6 h-px bg-[color:var(--cta)]" />
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.85, 0, 0.15, 1] }}
          className="font-black text-white leading-[0.92] tracking-tight max-w-5xl"
          style={{ fontSize: "clamp(2rem, 5.5vw, 5rem)" }}
        >
          Denizin en zorlu koşullarında bile{" "}
          <span className="text-[color:var(--cta)]">durmayan güç</span>{" "}
          üretmek.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 w-24 h-px bg-white/10"
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 text-slate-500 max-w-2xl text-sm md:text-base leading-relaxed"
        >
          Atlantis Crane, küresel tersanelerin en kritik yük kaldırma ihtiyaçlarını karşılamak için mühendislik ve üretim süreçlerini sürekli geliştirir. Her ürün bu misyonun somutlaşmış halidir.
        </motion.p>

        {/* Credential badges */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-3"
        >
          {["DNV GL", "Lloyd's Register", "Bureau Veritas", "ABS"].map((cert) => (
            <span
              key={cert}
              className="px-4 py-2 rounded-full border border-white/10 text-slate-400 text-xs font-semibold tracking-wider uppercase bg-white/5 backdrop-blur-sm"
            >
              {cert}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Gold decorative bottom bar */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-[color:var(--cta)]" />
    </section>
  );
}
