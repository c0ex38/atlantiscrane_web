"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FadeUp, SlideLeft, SlideRight, ScaleIn } from "./animations";

type DetailHeroProps = {
  modelNumber: string;
  title: string;
  shortIntro: string;
  capacity: string;
  outreach: string;
  capLabel: string;
  outLabel: string;
  quoteBtnText: string;
  backToListText: string;
  productImage: string;
  locale: string;
  isRtl: boolean;
};

export default function DetailHero({
  modelNumber,
  title,
  shortIntro,
  capacity,
  outreach,
  capLabel,
  outLabel,
  quoteBtnText,
  backToListText,
  productImage,
  locale,
  isRtl,
}: DetailHeroProps) {
  return (
    <section id="section-hero" className="relative min-h-[90vh] flex items-center mb-0">
      {/* Blueprint grid background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.015)_1px,transparent_1px)] bg-[size:12px_12px]" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#070b14] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#070b14] to-transparent" />
      </div>

      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-blue-600/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-[color:var(--cta)]/6 rounded-full blur-[100px] pointer-events-none" />

      {/* Back link */}
      <motion.div
        className="absolute top-0 left-0 z-20"
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Link
          href={`/${locale}/products`}
          className="inline-flex items-center gap-2.5 group py-2"
        >
          <span className={`w-8 h-8 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center text-slate-500 group-hover:border-[color:var(--cta)]/50 group-hover:text-[color:var(--cta)] transition-all duration-300 ${isRtl ? "rotate-180" : ""}`}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </span>
          <span className="text-[10px] font-mono tracking-[0.25em] text-slate-500 group-hover:text-[color:var(--cta)] transition-colors duration-300 uppercase">
            {backToListText}
          </span>
        </Link>
      </motion.div>

      <div className={`relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0 items-center w-full pt-8 ${isRtl ? "direction-rtl" : ""}`}>

        {/* LEFT: Text */}
        <div className={`${isRtl ? "order-1 lg:order-2 text-right" : "text-left"} flex flex-col pr-0 lg:pr-16 py-16`}>
          <motion.div
            className={`flex items-center gap-3 mb-6 ${isRtl ? "justify-end" : ""}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--cta)] animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" style={{animationDelay: "0.3s"}} />
            </div>
            <span className="text-[10px] font-mono tracking-[0.3em] text-[color:var(--cta)]/80 uppercase">
              Atlantis Crane — {modelNumber}
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl xl:text-[64px] font-black tracking-tight leading-[1.0] mb-7 text-white"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {title}
          </motion.h1>

          <motion.div
            className={`flex items-center gap-3 mb-7 ${isRtl ? "justify-end" : ""}`}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
            style={{ originX: isRtl ? 1 : 0 }}
          >
            <div className="h-[3px] w-12 bg-[color:var(--cta)] rounded-full" />
            <div className="h-[1px] w-20 bg-white/15 rounded-full" />
          </motion.div>

          <motion.p
            className="text-slate-400 text-base md:text-[17px] leading-[1.85] mb-10 max-w-[500px]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            {shortIntro}
          </motion.p>

          {/* Stat cards — staggered */}
          <div className={`grid grid-cols-2 gap-3 mb-10 max-w-[380px] ${isRtl ? "ml-auto" : ""}`}>
            {[
              { label: capLabel, value: capacity, color: "cta" },
              { label: outLabel, value: outreach, color: "blue" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className={`relative overflow-hidden rounded-2xl border ${
                  stat.color === "cta"
                    ? "border-[color:var(--cta)]/20 bg-[color:var(--cta)]/[0.04]"
                    : "border-blue-500/20 bg-blue-500/[0.04]"
                } p-5`}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.75 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className={`absolute top-0 right-0 w-16 h-16 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl ${
                  stat.color === "cta" ? "bg-[color:var(--cta)]/10" : "bg-blue-500/10"
                }`} />
                <span className={`text-[9px] font-bold uppercase tracking-[0.25em] block mb-1.5 ${
                  stat.color === "cta" ? "text-[color:var(--cta)]/70" : "text-blue-400/70"
                }`}>{stat.label}</span>
                <p className="text-2xl md:text-3xl font-black text-white leading-none">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            className={`flex flex-wrap gap-4 ${isRtl ? "justify-end" : ""}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <Link
              href={`/${locale}/#contact`}
              className="inline-flex items-center gap-3 px-8 py-4 bg-[color:var(--cta)] text-[#070b14] font-black text-[11px] uppercase tracking-[0.2em] rounded-full hover:scale-105 hover:shadow-[0_0_30px_rgba(212,175,55,0.35)] transition-all duration-300"
            >
              {quoteBtnText}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </Link>
            <div className="flex items-center gap-2">
              {["DNV", "ABS", "BV"].map((cert, i) => (
                <motion.span
                  key={cert}
                  className="px-3 py-1.5 rounded-full border border-white/10 text-[9px] font-bold tracking-wider text-slate-500 uppercase"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 1.1 + i * 0.08 }}
                >
                  {cert}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* RIGHT: Product Image */}
        <motion.div
          className={`relative ${isRtl ? "order-2 lg:order-1" : ""}`}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.0, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative aspect-[4/3] lg:aspect-[3/2.5] w-full">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-[color:var(--cta)]/10 rounded-3xl" />
            <div className="absolute inset-1/4 bg-[color:var(--cta)]/8 rounded-full blur-3xl" />

            <motion.div
              className="relative w-full h-full rounded-[2rem] bg-white shadow-[0_20px_80px_rgba(0,0,0,0.4)] overflow-hidden border border-slate-200"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-200" />
              <Image
                src={productImage}
                alt={title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-6 md:p-12 relative z-10 mix-blend-multiply"
                priority
              />
            </motion.div>

            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-slate-200" />
              <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-slate-200" />
              <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-slate-300 rounded-tl-xl" />
              <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-slate-300 rounded-tr-xl" />
              <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-slate-300 rounded-bl-xl" />
              <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-slate-300 rounded-br-xl" />
              <motion.div
                className="absolute top-6 right-6 px-3 py-1.5 rounded-lg bg-white/90 shadow-sm border border-slate-200 backdrop-blur-md"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.4 }}
              >
                <span className="text-[9px] font-mono text-slate-800 font-bold uppercase tracking-widest">Marine Grade</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
