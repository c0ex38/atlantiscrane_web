"use client";

import { useState, useRef, ReactNode, UIEvent, useEffect } from "react";

type ProductsSliderWrapperProps = {
  slides: ReactNode[];
};

export default function ProductsSliderWrapper({ slides }: ProductsSliderWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSnapped, setIsSnapped] = useState(false);

  // Enable global scroll snapping for this page so the wrapper snaps perfectly to the top
  useEffect(() => {
    document.documentElement.style.scrollSnapType = "y proximity";
    return () => {
      document.documentElement.style.scrollSnapType = "";
    };
  }, []);

  // Track window scroll to enable/disable inner scrolling
  useEffect(() => {
    const handleWindowScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      
      // If the slider is perfectly at the top of the viewport
      if (Math.abs(rect.top) <= 10) {
        setIsSnapped(true);
      } else {
        setIsSnapped(false);
      }
    };

    window.addEventListener("scroll", handleWindowScroll, { passive: true });
    // Initial check
    handleWindowScroll();

    return () => {
      window.removeEventListener("scroll", handleWindowScroll);
    };
  }, []);

  // Update active index based on inner scroll position
  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const slideHeight = e.currentTarget.clientHeight;
    const index = Math.round(scrollTop / slideHeight);
    
    if (index !== activeIndex && index >= 0 && index < slides.length) {
      setActiveIndex(index);
    }
  };

  const scrollToSlide = (idx: number) => {
    if (!containerRef.current) return;
    const slideHeight = containerRef.current.clientHeight;
    containerRef.current.scrollTo({
      top: slideHeight * idx,
      behavior: "smooth"
    });
  };

  return (
    <div className="relative w-full h-[100svh] snap-start">
      {/* Scrollable container with CSS Scroll Snapping */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className={`w-full h-full snap-y snap-mandatory hide-scrollbar ${
          isSnapped ? "overflow-y-auto" : "overflow-y-hidden"
        }`}
      >
        {slides.map((slide, index) => (
          // snap-always ensures that fast scrolling stops at every single slide
          <div 
            key={index} 
            className="w-full h-[100svh] relative shrink-0 snap-start snap-always"
          >
            {slide}
          </div>
        ))}
      </div>

      {/* Slide Indicators */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50 pointer-events-none">
        {slides.map((_, idx) => (
          <div
            key={idx}
            onClick={() => scrollToSlide(idx)}
            className={`w-1.5 transition-all duration-300 rounded-full cursor-pointer pointer-events-auto hover:bg-[color:var(--cta)] ${
              idx === activeIndex
                ? "h-8 bg-[color:var(--cta)]"
                : "h-2 bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
