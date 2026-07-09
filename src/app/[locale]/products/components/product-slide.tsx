"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export type ProductItem = {
  title: string;
  description: string;
  capacity?: string;
  outreach?: string;
};

type ProductSlideProps = {
  item: ProductItem;
  index: number;
  capLabel: string;
  outLabel: string;
  productImage: string;
  locale: string;
  detailLabel: string;
};

export default function ProductSlide({
  item,
  index,
  capLabel,
  outLabel,
  productImage,
  locale,
  detailLabel,
}: ProductSlideProps) {
  const isRight = index % 2 === 0;

  return (
    <section className="relative w-full h-[100svh] overflow-hidden flex flex-col justify-center pt-24 md:pt-32">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={productImage}
          alt={item.title}
          fill
          sizes="100vw"
          className="object-cover object-center scale-105"
          priority={index < 2}
        />
        {/* Dark Gradient Overlay for readability */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/80 lg:bg-gradient-to-r ${isRight ? 'lg:from-black/20 lg:to-black/90' : 'lg:from-black/90 lg:to-black/20'}`} />
      </div>

      {/* Content */}
      <div className="container-shell relative z-10 w-full px-4">
        <motion.div
          initial={{ opacity: 0, x: isRight ? 15 : -15, y: 15 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className={`flex flex-col max-w-3xl w-full ${
            isRight ? "ml-auto items-end text-right" : "mr-auto items-start text-left"
          }`}
        >
          <span className={`text-[10px] md:text-xs font-mono tracking-[0.3em] text-cta uppercase mb-6 flex items-center gap-4 ${isRight ? "flex-row-reverse" : "flex-row"}`}>
            <span className="w-8 sm:w-16 h-px bg-cta" />
            Model 0{index + 1}
          </span>

          <h2
            className="font-black tracking-tight leading-[1.05] text-white mb-8"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
          >
            {item.title}
          </h2>

          <p className="text-white/80 text-sm md:text-lg leading-relaxed max-w-2xl mb-12">
            {item.description}
          </p>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-8 md:gap-16 border-t border-white/20 pt-8 pb-10 w-full max-w-md">
            <div>
              <span className="text-[10px] md:text-xs font-bold text-white/50 uppercase tracking-widest block mb-1.5">
                {capLabel}
              </span>
              <p className="text-xl md:text-3xl font-black text-white">
                {item.capacity ?? "—"}
              </p>
            </div>
            <div>
              <span className="text-[10px] md:text-xs font-bold text-white/50 uppercase tracking-widest block mb-1.5">
                {outLabel}
              </span>
              <p className="text-xl md:text-3xl font-black text-white">
                {item.outreach ?? "—"}
              </p>
            </div>
          </div>

          {/* Detail Button */}
          <div className={`w-full max-w-md flex ${isRight ? 'justify-end' : 'justify-start'}`}>
            <Link
              href={`/${locale}/products/model-0${index + 1}`}
              className="inline-flex items-center justify-center px-8 py-4 bg-cta text-[#0a0a14] font-black text-xs md:text-sm uppercase tracking-widest hover:bg-white hover:scale-105 transition-all duration-300"
            >
              {detailLabel}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
