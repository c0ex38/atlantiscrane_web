import Link from "next/link";
import Image from "next/image";
import type { Locale } from "../../../lib/site-content";

export type ProductCardProps = {
  item: {
    title: string;
    description: string;
    capacity?: string;
    outreach?: string;
  };
  index: number;
  currentLocale: Locale;
  productImage: string;
  capLabel: string;
  outLabel: string;
  contactCta: string;
};

export default function ProductCard({
  item,
  index,
  currentLocale,
  productImage,
  capLabel,
  outLabel,
  contactCta,
}: ProductCardProps) {
  const isFirst = index === 0;

  return (
    <div className="group bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-[0_20px_50px_rgba(27,27,54,0.05)] hover:-translate-y-1.5 transition-all duration-500 flex flex-col h-full overflow-hidden">
      {/* Product Image Container */}
      <div className="relative h-56 w-full bg-slate-100 flex items-center justify-center overflow-hidden border-b border-slate-100">
        <Image
          src={productImage}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className={`object-cover transition-all duration-700 ease-in-out group-hover:scale-105 ${
            isFirst ? "p-4 object-contain bg-white" : ""
          }`}
        />
        {/* Absolute Index Badge */}
        <span className="absolute top-4 left-4 text-xs font-mono font-bold px-2 py-1 rounded bg-slate-900/90 text-white/95 backdrop-blur-md">
          0{index + 1}
        </span>
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-1 space-y-5 justify-between">
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-950 leading-snug group-hover:text-[color:var(--cta)] transition-colors duration-300">
            {item.title}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            {item.description}
          </p>
        </div>

        {/* Technical Datasheet Box */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {capLabel}
            </span>
            <p className="text-xs font-black text-slate-700">
              {item.capacity || "-"}
            </p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {outLabel}
            </span>
            <p className="text-xs font-black text-slate-700">
              {item.outreach || "-"}
            </p>
          </div>
        </div>

        {/* Quote Link Button */}
        <div className="pt-2">
          <Link
            href={`/${currentLocale}#iletisim`}
            className="inline-flex w-full items-center justify-between px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-[color:var(--cta)] hover:text-slate-950 hover:border-transparent transition-all duration-300 group/btn"
          >
            <span>{contactCta}</span>
            <span className="text-sm transition-transform duration-300 group-hover/btn:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
