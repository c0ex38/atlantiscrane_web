"use client";

import { FadeUp, FadeIn, StaggerContainer, StaggerItem, SlideLeft, SlideRight, ScaleIn } from "./animations";

type DetailEquipmentsProps = {
  standardTitle: string;
  optionalTitle: string;
  standardItems: readonly string[];
  optionalItems: readonly string[];
};

export default function DetailEquipments({
  standardTitle,
  optionalTitle,
  standardItems,
  optionalItems,
}: DetailEquipmentsProps) {
  return (
    <section id="section-equipment" className="relative py-24 mb-8">
      <FadeIn>
        <div className="flex items-center gap-4 mb-20">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/8 to-transparent" />
          <span className="text-[8px] font-mono tracking-[0.4em] text-slate-700 uppercase">Section 05</span>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/8 to-transparent" />
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Standard */}
        <SlideLeft delay={0.15}>
          <div className="group relative overflow-hidden rounded-3xl bg-[#0c1220]/80 border border-emerald-500/12 hover:border-emerald-500/25 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
            <div className="h-1 bg-gradient-to-r from-emerald-600/80 via-emerald-400/60 to-transparent" />
            <div className="p-8 md:p-10">
              <div className="flex items-center gap-4 mb-8">
                <ScaleIn delay={0.2}>
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/15 group-hover:border-emerald-500/30 transition-all duration-500">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </ScaleIn>
                <div>
                  <span className="text-[9px] font-mono text-emerald-500/60 uppercase tracking-[0.25em] block mb-0.5">Standard</span>
                  <h3 className="text-xl font-black text-white">{standardTitle}</h3>
                </div>
              </div>
              <StaggerContainer className="space-y-3" staggerDelay={0.06}>
                {standardItems.map((item, i) => (
                  <StaggerItem key={i}>
                    <div className="flex items-start gap-3 group/item py-1">
                      <div className="shrink-0 w-5 h-5 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mt-0.5 group-hover/item:bg-emerald-500/15 transition-colors duration-200">
                        <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-slate-400 text-sm leading-relaxed group-hover/item:text-slate-200 transition-colors duration-200">
                        {item}
                      </span>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </div>
        </SlideLeft>

        {/* Optional */}
        <SlideRight delay={0.2}>
          <div className="group relative overflow-hidden rounded-3xl bg-[#0c1220]/80 border border-[color:var(--cta)]/12 hover:border-[color:var(--cta)]/25 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
            <div className="h-1 bg-gradient-to-r from-[color:var(--cta)] via-[color:var(--cta)]/60 to-transparent" />
            <div className="p-8 md:p-10">
              <div className="flex items-center gap-4 mb-8">
                <ScaleIn delay={0.25}>
                  <div className="w-11 h-11 rounded-2xl bg-[color:var(--cta)]/8 border border-[color:var(--cta)]/20 flex items-center justify-center shrink-0 group-hover:bg-[color:var(--cta)]/15 group-hover:border-[color:var(--cta)]/30 transition-all duration-500">
                    <svg className="w-5 h-5 text-[color:var(--cta)]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </ScaleIn>
                <div>
                  <span className="text-[9px] font-mono text-[color:var(--cta)]/50 uppercase tracking-[0.25em] block mb-0.5">Optional</span>
                  <h3 className="text-xl font-black text-white">{optionalTitle}</h3>
                </div>
              </div>
              <StaggerContainer className="space-y-3" staggerDelay={0.06}>
                {optionalItems.map((item, i) => (
                  <StaggerItem key={i}>
                    <div className="flex items-start gap-3 group/item py-1">
                      <div className="shrink-0 w-5 h-5 rounded-md bg-[color:var(--cta)]/8 border border-[color:var(--cta)]/20 flex items-center justify-center mt-0.5 group-hover/item:bg-[color:var(--cta)]/15 transition-colors duration-200">
                        <svg className="w-3 h-3 text-[color:var(--cta)]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </div>
                      <span className="text-slate-400 text-sm leading-relaxed group-hover/item:text-slate-200 transition-colors duration-200">
                        {item}
                      </span>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </div>
        </SlideRight>
      </div>

      {/* Certification strip */}
      <FadeUp delay={0.3}>
        <div className="mt-8 rounded-2xl border border-white/[0.05] bg-white/[0.015] px-8 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="text-[10px] font-mono text-slate-700 uppercase tracking-[0.3em]">Klas Sertifikaları / Class Certifications</span>
            <div className="flex flex-wrap gap-3">
              {["DNV GL", "Lloyd's Register", "Bureau Veritas", "ABS", "RINA"].map((cert, i) => (
                <ScaleIn key={cert} delay={0.4 + i * 0.07}>
                  <span className="px-4 py-1.5 rounded-full border border-white/8 bg-white/[0.02] text-[10px] font-bold tracking-wider text-slate-400 uppercase hover:border-[color:var(--cta)]/30 hover:text-[color:var(--cta)] transition-all duration-300 cursor-default">
                    {cert}
                  </span>
                </ScaleIn>
              ))}
            </div>
          </div>
        </div>
      </FadeUp>
    </section>
  );
}
