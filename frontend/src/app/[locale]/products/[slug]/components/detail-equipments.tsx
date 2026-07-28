"use client";

import { FadeUp, FadeIn, StaggerContainer, StaggerItem, ScaleIn } from "./animations";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

type DetailEquipmentsProps = {
  standardTitle: string;
  optionalTitle: string;
  standardItems: readonly string[];
  optionalItems: readonly string[];
  standardLabel: string;
  optionalLabel: string;
  classCertLabel: string;
};

export default function DetailEquipments({
  standardTitle,
  optionalTitle,
  standardItems,
  optionalItems,
  standardLabel,
  optionalLabel,
  classCertLabel,
}: DetailEquipmentsProps) {
  return (
    <section id="section-equipment" className="relative py-10 sm:py-16 lg:py-24 lg:mb-8">
      <FadeIn>
        <div className="mb-8 flex items-center gap-4 sm:mb-12 lg:mb-20">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/8 to-transparent" />
          <span className="text-[8px] font-mono tracking-[0.4em] text-slate-700 uppercase">Section 05</span>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/8 to-transparent" />
        </div>
      </FadeIn>

      <FadeUp delay={0.15}>
        <Tabs defaultValue="standard" className="w-full">
          <div className="mb-5 flex justify-center sm:mb-8">
            <TabsList className="grid h-auto w-full grid-cols-2 border border-white/10 bg-[#0c1220]/80 p-1 sm:w-auto">
              <TabsTrigger value="standard" className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-wide data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 sm:px-8 sm:text-xs sm:tracking-wider">
                {standardLabel}
              </TabsTrigger>
              <TabsTrigger value="optional" className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-wide data-[state=active]:bg-cta/20 data-[state=active]:text-cta sm:px-8 sm:text-xs sm:tracking-wider">
                {optionalLabel}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="standard" className="mt-0 outline-none">
            <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/12 bg-[#0c1220]/80 transition-all duration-500 sm:rounded-3xl">
              <div className="h-1 bg-gradient-to-r from-emerald-600/80 via-emerald-400/60 to-transparent" />
              <div className="p-5 sm:p-8 md:p-10">
                <div className="mb-5 flex items-center gap-3 sm:mb-8 sm:gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
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
          </TabsContent>

          <TabsContent value="optional" className="mt-0 outline-none">
            <div className="group relative overflow-hidden rounded-2xl border border-cta/12 bg-[#0c1220]/80 transition-all duration-500 sm:rounded-3xl">
              <div className="h-1 bg-gradient-to-r from-cta via-cta/60 to-transparent" />
              <div className="p-5 sm:p-8 md:p-10">
                <div className="mb-5 flex items-center gap-3 sm:mb-8 sm:gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-cta/8 border border-cta/20 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-cta" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">{optionalTitle}</h3>
                  </div>
                </div>
                <StaggerContainer className="space-y-3" staggerDelay={0.06}>
                  {optionalItems.map((item, i) => (
                    <StaggerItem key={i}>
                      <div className="flex items-start gap-3 group/item py-1">
                        <div className="shrink-0 w-5 h-5 rounded-md bg-cta/8 border border-cta/20 flex items-center justify-center mt-0.5 group-hover/item:bg-cta/15 transition-colors duration-200">
                          <svg className="w-3 h-3 text-cta" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
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
          </TabsContent>
        </Tabs>
      </FadeUp>

      {/* Certification strip */}
      <FadeUp delay={0.3}>
        <div className="mt-5 rounded-2xl border border-white/[0.05] bg-white/[0.015] px-4 py-4 sm:mt-8 sm:px-8 sm:py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="text-[10px] font-mono text-slate-700 uppercase tracking-[0.3em]">{classCertLabel}</span>
            <div className="flex flex-wrap gap-3">
              {["DNV GL", "Lloyd's Register", "Bureau Veritas", "ABS", "RINA"].map((cert, i) => (
                <ScaleIn key={cert} delay={0.4 + i * 0.07}>
                  <Badge variant="outline" className="px-4 py-1.5 rounded-full border border-white/8 bg-white/[0.02] text-[10px] font-bold tracking-wider text-slate-400 uppercase hover:border-cta/30 hover:text-cta transition-all duration-300 cursor-default">
                    {cert}
                  </Badge>
                </ScaleIn>
              ))}
            </div>
          </div>
        </div>
      </FadeUp>
    </section>
  );
}
