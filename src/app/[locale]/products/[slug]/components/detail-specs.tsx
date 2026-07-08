"use client";

import { FadeUp, FadeIn, StaggerContainer, StaggerItem, SlideLeft, SlideRight, ScaleIn } from "./animations";

type DetailSpecsProps = {
  title: string;
  description: string;
  specKeys: Record<string, string>;
  specValues: Record<string, string>;
  isRtl: boolean;
};

export default function DetailSpecs({
  title,
  description,
  specKeys,
  specValues,
  isRtl,
}: DetailSpecsProps) {
  const keys = Object.keys(specKeys);
  const half = Math.ceil(keys.length / 2);
  const col1 = keys.slice(0, half);
  const col2 = keys.slice(half);

  return (
    <section id="section-specs" className="relative py-24 mb-8">
      <FadeIn>
        <div className="flex items-center gap-4 mb-20">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/8 to-transparent" />
          <span className="text-[8px] font-mono tracking-[0.4em] text-slate-700 uppercase">Section 04</span>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/8 to-transparent" />
        </div>
      </FadeIn>

      <div className={`grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 lg:gap-16 mb-12 ${isRtl ? "direction-rtl" : ""}`}>
        <SlideLeft delay={0.1}>
          <div className={`${isRtl ? "text-right" : "text-left"}`}>
            <div className={`flex items-center gap-3 mb-4 ${isRtl ? "justify-end flex-row-reverse" : ""}`}>
              <ScaleIn delay={0.15}>
                <div className="w-6 h-6 rounded-lg bg-[color:var(--cta)]/10 border border-[color:var(--cta)]/20 flex items-center justify-center shrink-0">
                  <span className="text-[9px] font-mono text-[color:var(--cta)]">04</span>
                </div>
              </ScaleIn>
              <span className="text-[10px] font-mono tracking-[0.35em] text-[color:var(--cta)]/70 uppercase">Technical Data</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2 max-w-xs">{title}</h2>
            <div className={`h-[3px] w-10 bg-[color:var(--cta)] rounded-full mt-4 ${isRtl ? "ml-auto" : ""}`} />
          </div>
        </SlideLeft>
        <SlideRight delay={0.15}>
          <div className={`${isRtl ? "text-right" : "text-left"} flex items-end`}>
            <p className="text-slate-500 text-sm leading-relaxed max-w-lg">{description}</p>
          </div>
        </SlideRight>
      </div>

      <FadeUp delay={0.2}>
        <div className="rounded-3xl border border-white/[0.06] bg-[#0c1220]/80 backdrop-blur-sm overflow-hidden">
          {/* Panel title bar */}
          <div className="flex items-center justify-between px-6 py-3.5 bg-white/[0.02] border-b border-white/[0.05]">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
              </div>
              <span className="ml-3 text-[10px] font-mono text-slate-600 uppercase tracking-widest">technical_specifications.json</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] font-mono text-slate-700">LIVE</span>
            </div>
          </div>

          {/* Two-column spec grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/[0.04]">
            {[col1, col2].map((col, ci) => (
              <StaggerContainer key={ci} className="divide-y divide-white/[0.04]" staggerDelay={0.06}>
                {col.map((key, i) => (
                  <StaggerItem key={key}>
                    <div
                      className={`flex items-center gap-4 px-6 py-4 group hover:bg-white/[0.02] transition-colors duration-200 ${isRtl ? "flex-row-reverse" : ""}`}
                    >
                      <span className="shrink-0 text-[9px] font-mono text-slate-800 w-5">
                        {String((ci === 0 ? i : half + i) + 1).padStart(2, "0")}
                      </span>
                      <span className={`flex-1 text-[11px] md:text-xs text-blue-400/70 font-mono ${isRtl ? "text-right" : "text-left"}`}>
                        {specKeys[key]}
                      </span>
                      <span className={`shrink-0 text-[11px] md:text-xs font-bold text-white/80 group-hover:text-[color:var(--cta)] transition-colors duration-200 ${isRtl ? "text-left" : "text-right"} max-w-[45%]`}>
                        {specValues[key]}
                      </span>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            ))}
          </div>
        </div>
      </FadeUp>
    </section>
  );
}
