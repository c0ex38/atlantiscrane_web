"use client";

import { useState, useEffect, useRef } from "react";

type NavItem = {
  id: string;
  label: string;
};

type StickyNavProps = {
  items: NavItem[];
  quoteBtnText: string;
  locale: string;
  isRtl: boolean;
};

export default function StickyNav({ items, quoteBtnText, locale, isRtl }: StickyNavProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
          setIsVisible(scrollTop > 300);

          // Find active section
          let currentId = items[0]?.id ?? "";
          for (const item of items) {
            const el = document.getElementById(item.id);
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= 120) currentId = item.id;
            }
          }
          setActiveId(currentId);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Progress bar */}
      <div className="h-[2px] bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-[color:var(--cta)] to-[color:var(--cta)]/60 transition-all duration-100"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Nav bar */}
      <div className="bg-[#070b14]/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="container-shell px-4 md:px-8">
          <div className={`flex items-center justify-between gap-4 h-14 ${isRtl ? "flex-row-reverse" : ""}`}>
            
            {/* Section tabs */}
            <div className={`flex items-center gap-1 overflow-x-auto scrollbar-hide ${isRtl ? "flex-row-reverse" : ""}`}>
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-[0.15em] whitespace-nowrap transition-all duration-200 ${
                    activeId === item.id
                      ? "bg-[color:var(--cta)]/15 text-[color:var(--cta)] border border-[color:var(--cta)]/30"
                      : "text-slate-500 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Quick CTA */}
            <a
              href={`/${locale}/#contact`}
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2 bg-[color:var(--cta)] text-[#070b14] font-black text-[10px] uppercase tracking-[0.2em] rounded-full hover:scale-105 transition-transform duration-200"
            >
              {quoteBtnText}
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
