"use client";

import React from "react";
import { FadeUp, FadeIn, StaggerContainer, StaggerItem, ScaleIn } from "./animations";

type DetailFeaturesProps = {
  featuresTitle: string;
  features: readonly string[];
  isRtl: boolean;
};

const ICONS = [
  <svg key="shield" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
  <svg key="bolt" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
  <svg key="cog" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" /></svg>,
  <svg key="expand" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>,
  <svg key="wave" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>,
  <svg key="wrench" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" /></svg>,
];

export default function DetailFeatures({
  featuresTitle,
  features,
  isRtl,
}: DetailFeaturesProps) {
  if (!features || features.length === 0) return null;

  return (
    <section id="section-features" className="relative py-24 mb-8">
      <FadeIn>
        <div className="flex items-center gap-4 mb-20">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
          <span className="text-[8px] font-mono tracking-[0.4em] text-slate-400 uppercase">Section 02</span>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
        </div>
      </FadeIn>

      <FadeUp delay={0.1}>
        <div className={`flex items-center gap-3 mb-12 ${isRtl ? "justify-end flex-row-reverse" : ""}`}>
          <ScaleIn delay={0.15}>
            <div className="w-6 h-6 rounded-lg bg-[color:var(--cta)]/10 border border-[color:var(--cta)]/20 flex items-center justify-center shrink-0">
              <span className="text-[9px] font-mono text-[color:var(--cta)]">02</span>
            </div>
          </ScaleIn>
          <span className="text-[10px] font-mono tracking-[0.35em] text-blue-600 uppercase">{featuresTitle}</span>
        </div>
      </FadeUp>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4" staggerDelay={0.09}>
        {features.map((feature, index) => {
          const icon = ICONS[index % ICONS.length];
          return (
            <StaggerItem key={index}>
              <div
                className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 md:p-7 hover:-translate-y-1 hover:border-[color:var(--cta)]/40 hover:bg-slate-50 hover:shadow-[0_12px_40px_rgba(0,0,0,0.05)] transition-all duration-400 flex gap-5 ${
                  isRtl ? "flex-row-reverse text-right" : "text-left"
                }`}
              >
                <div className={`absolute top-0 left-6 right-6 h-[1px] bg-[color:var(--cta)] opacity-0 group-hover:opacity-60 transition-opacity duration-400`} />
                <div className="shrink-0 w-11 h-11 rounded-2xl bg-[color:var(--cta)]/10 border border-[color:var(--cta)]/20 flex items-center justify-center text-[color:var(--cta)]/80 group-hover:bg-[color:var(--cta)]/15 group-hover:border-[color:var(--cta)]/40 group-hover:text-[color:var(--cta)] transition-all duration-400 mt-0.5">
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] font-mono text-slate-400 group-hover:text-[color:var(--cta)]/80 transition-colors duration-300">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="h-[1px] flex-1 bg-slate-200 group-hover:bg-[color:var(--cta)]/30 transition-colors duration-300" />
                  </div>
                  <p className="text-slate-600 text-sm md:text-[15px] leading-relaxed group-hover:text-slate-900 transition-colors duration-400">
                    {feature}
                  </p>
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </section>
  );
}
