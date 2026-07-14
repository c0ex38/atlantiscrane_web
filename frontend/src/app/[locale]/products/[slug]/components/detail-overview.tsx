"use client";

import React from "react";
import { FadeUp, SlideLeft, SlideRight, ScaleIn, FadeIn } from "./animations";
import { Badge } from "@/components/ui/badge";

type DetailOverviewProps = {
  descTitle: string;
  description: string;
  usageTitle: string;
  usage: string;
  tags: readonly string[];
  isRtl: boolean;
};

export default function DetailOverview({
  descTitle,
  description,
  usageTitle,
  usage,
  tags,
  isRtl,
}: DetailOverviewProps) {
  const sentences = description.split(/\.\s+/);
  const pullQuote = sentences[0] + ".";
  const restText = sentences.slice(1).join(". ");

  return (
    <section id="section-overview" className="relative py-24 mb-8">
      <FadeIn>
        <div className="flex items-center gap-4 mb-20">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
          <span className="text-[8px] font-mono tracking-[0.4em] text-slate-400 uppercase">Section 01</span>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
        </div>
      </FadeIn>

      <FadeUp delay={0.1}>
        <div className={`flex items-center gap-3 mb-12 ${isRtl ? "justify-end flex-row-reverse" : ""}`}>
          <ScaleIn delay={0.15}>
            <div className="w-6 h-6 rounded-lg bg-cta/10 border border-cta/20 flex items-center justify-center shrink-0">
              <span className="text-[9px] font-mono text-cta">01</span>
            </div>
          </ScaleIn>
          <span className="text-[10px] font-mono tracking-[0.35em] text-blue-600 uppercase">{descTitle}</span>
        </div>
      </FadeUp>

      <div className={`grid grid-cols-1 lg:grid-cols-[1fr_1px_1fr] gap-0 ${isRtl ? "direction-rtl" : ""}`}>
        {/* Left */}
        <SlideLeft delay={0.2} className={`${isRtl ? "text-right pl-0 lg:pl-16" : "text-left pr-0 lg:pr-16"} pb-12 lg:pb-0`}>
          <blockquote className={`relative mb-8 ${isRtl ? "pr-6 border-r-4 border-cta" : "pl-6 border-l-4 border-cta"}`}>
            <p className="text-xl md:text-2xl font-bold text-slate-900 leading-snug">{pullQuote}</p>
          </blockquote>
          {restText && (
            <p className="text-slate-600 text-base leading-[1.9] whitespace-pre-wrap">{restText}</p>
          )}
        </SlideLeft>

        {/* Vertical divider */}
        <div className="hidden lg:block w-[1px] bg-gradient-to-b from-transparent via-slate-300 to-transparent" />

        {/* Right */}
        <SlideRight delay={0.25} className={`${isRtl ? "text-right pr-0 lg:pr-16" : "text-left pl-0 lg:pl-16"} pt-12 lg:pt-0`}>
          <div className={`flex items-center gap-3 mb-7 ${isRtl ? "justify-end flex-row-reverse" : ""}`}>
            <ScaleIn delay={0.3}>
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5m0 15V21m0-3.75a7.5 7.5 0 110-15 7.5 7.5 0 010 15zm0 0v-3.75m0 3.75H8.25m3.75 0H15.75" />
                </svg>
              </div>
            </ScaleIn>
            <h3 className="text-lg font-black text-slate-900">{usageTitle}</h3>
          </div>

          <div className={`relative ${isRtl ? "pr-5 border-r border-blue-500/20" : "pl-5 border-l border-blue-500/20"}`}>
            <p className="text-slate-600 text-base leading-[1.9]">{usage}</p>
          </div>

          <div className={`flex flex-wrap gap-2 mt-8 ${isRtl ? "justify-end" : ""}`}>
            {tags.map((tag, i) => (
              <ScaleIn key={tag} delay={0.4 + i * 0.06}>
                <Badge variant="outline" className="border-slate-200 bg-white text-[10px] font-bold text-slate-500 uppercase tracking-wider hover:border-blue-500 hover:text-blue-600 transition-colors duration-300 rounded-full cursor-default px-3 py-1">
                  {tag}
                </Badge>
              </ScaleIn>
            ))}
          </div>
        </SlideRight>
      </div>
    </section>
  );
}
