"use client";

import { useState, useRef, ReactNode, useEffect } from "react";

type ProductsSliderWrapperProps = {
  slides: ReactNode[];
};

export default function ProductsSliderWrapper({ slides }: ProductsSliderWrapperProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Track scroll position to update active index
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = slideRefs.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1) {
              setActiveIndex(index);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: "-45% 0px -45% 0px", // Trigger when slide is mostly in the middle
        threshold: 0
      }
    );

    slideRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observer.disconnect();
    };
  }, [slides]);

  const scrollToSlide = (idx: number) => {
    slideRefs.current[idx]?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative w-full">
      {/* Slide Indicators (Sticky) */}
      <div className="absolute inset-y-0 left-6 z-50 pointer-events-none hidden md:block">
        <div className="sticky top-1/2 -translate-y-1/2 flex flex-col gap-3 pointer-events-auto w-8">
          {slides.map((_, idx) => (
            <div
              key={idx}
              onClick={() => scrollToSlide(idx)}
              className={`w-1.5 transition-all duration-500 rounded-full cursor-pointer hover:bg-cta ${
                idx === activeIndex
                  ? "h-8 bg-cta"
                  : "h-2 bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Slides Container */}
      <div className="w-full flex flex-col">
        {slides.map((slide, index) => (
          <div 
            key={index} 
            ref={(el) => { slideRefs.current[index] = el; }}
            className="w-full min-h-[100svh] relative flex items-center justify-center border-b border-white/5 last:border-b-0"
          >
            {slide}
          </div>
        ))}
      </div>
    </div>
  );
}
