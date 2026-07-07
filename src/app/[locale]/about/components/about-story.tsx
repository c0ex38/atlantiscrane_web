"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export default function AboutStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax effect: moves the image slightly as user scrolls
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section className="bg-white pt-24 sm:pt-32 pb-0 overflow-hidden">
      <div className="container-shell relative z-10 flex flex-col items-center text-center px-4 sm:px-6">
        
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.55 }}
          className="text-xs font-mono tracking-[0.3em] text-[color:var(--cta)] uppercase mb-8 flex items-center justify-center gap-4 w-full"
        >
          <span className="w-8 sm:w-12 h-px bg-[color:var(--cta)]/50" />
          Kim Olduğumuz
          <span className="w-8 sm:w-12 h-px bg-[color:var(--cta)]/50" />
        </motion.p>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-black tracking-tight leading-[0.95] text-[color:var(--text)] mb-10 max-w-4xl"
          style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
        >
          Tersanenin <span className="text-[color:var(--cta)]">kalbinden</span> gelen güç.
        </motion.h2>

        {/* Text columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 max-w-5xl mx-auto text-left mt-4 mb-20 sm:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-slate-600 text-base md:text-lg leading-relaxed font-medium">
              2001 yılında İstanbul Tuzla'da, Türk gemi inşa sanayisinin tam merkezinde kurulan Atlantis Crane, yirmi yılı aşkın süredir deniz vinçlerinin tasarımında ve üretiminde küresel standartların öncüsüdür.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
              Her projede mühendislik önce gelir: DNV, Lloyd's Register ve Bureau Veritas sertifikasyonuyla desteklenen ürünlerimiz, en zorlu deniz koşullarına karşı güvenle çalışır.
            </p>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
              İstanbul'dan Dubai'ye uzanan servis ağımızla kurulum sonrası desteği de aynı kararlılıkla sürdürüyoruz.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Full-bleed parallax image */}
      <div 
        ref={containerRef}
        className="relative w-full h-[50vh] sm:h-[70vh] lg:h-[85vh] overflow-hidden bg-[#0a0a14]"
      >
        <motion.div style={{ y }} className="absolute inset-[-20%] w-[140%] h-[140%]">
          <Image
            src="/about-facility.png"
            alt="Atlantis Crane Tuzla Üretim Tesisi"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
        </motion.div>
        
        {/* Gradients to blend image with sections above and below */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-white to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Floating badge inside image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="absolute bottom-8 sm:bottom-16 left-4 sm:left-1/2 sm:-translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 sm:px-8 py-4 sm:py-5 shadow-2xl"
        >
          <div className="flex items-center gap-4">
            <div className="relative flex h-3 w-3 sm:h-4 sm:w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[color:var(--cta)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 sm:h-4 sm:w-4 bg-[color:var(--cta)]"></span>
            </div>
            <div>
              <p className="text-white font-black tracking-wide text-sm sm:text-base uppercase">Tuzla, İstanbul</p>
              <p className="text-white/60 text-xs sm:text-sm mt-0.5 tracking-wider">Ana Üretim Tesisi</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
