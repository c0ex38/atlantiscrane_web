"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { translations, type Locale } from "../lib/site-content";
import { useSiteContent } from "./site-content-provider";

type ExportNetworkProps = {
  locale: Locale;
};

// We add the ISO country codes to map them to the SVG IDs
const countryCodes = {
  "Birleşik Arap Emirlikleri": "ae",
  "Türkiye": "tr",
  "Suudi Arabistan": "sa",
  "Amerika Birleşik Devletleri": "us",
  "Katar": "qa",
  "Norveç": "no",
  "Azerbaycan": "az",
  "United Arab Emirates": "ae",
  "Turkey": "tr",
  "Saudi Arabia": "sa",
  "United States of America": "us",
  "Qatar": "qa",
  "Norway": "no",
  "Azerbaijan": "az",
  "الإمارات العربية المتحدة": "ae",
  "تركيا": "tr",
  "المملكة العربية السعودية": "sa",
  "الولايات المتحدة الأمريكية": "us",
  "قطر": "qa",
  "النرويج": "no",
  "أذربيجان": "az",
} as const;

export default function ExportNetwork({ locale }: ExportNetworkProps) {
  const t = useSiteContent(locale);
  const { eyebrow, title, subtitle, listTitle, craneLabel, items } = t.exportNetwork;

  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [clickedCountry, setClickedCountry] = useState<string | null>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Fetch the SVG client-side to avoid bundle bloat, then inject it.
  useEffect(() => {
    fetch("/world.svg")
      .then((res) => res.text())
      .then((text) => {
        setSvgContent(text);
      });
  }, []);

  // Zoom-in effect on the clicked country
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const svg = mapContainerRef.current.querySelector("svg");
    if (!svg) return;

    // Apply high-performance CSS transition directly to the SVG
    svg.style.transition = "transform 1.2s cubic-bezier(0.25, 1, 0.5, 1), transform-origin 1.2s cubic-bezier(0.25, 1, 0.5, 1)";

    if (clickedCountry) {
      const path = svg.querySelector(`#${clickedCountry}`) as SVGGraphicsElement | null;
      if (path) {
        try {
          // Get the bounding box of the clicked country path in the SVG grid space
          const bbox = path.getBBox();
          const centerX = bbox.x + bbox.width / 2;
          const centerY = bbox.y + bbox.height / 2;
          
          // Set transform origin of SVG to the center of the country and scale up
          svg.style.transformOrigin = `${centerX}px ${centerY}px`;
          svg.style.transform = "scale(1.4)";
        } catch (e) {
          console.error("getBBox failed or unsupported", e);
          // Fallback zoom on center
          svg.style.transformOrigin = "center center";
          svg.style.transform = "scale(1.2)";
        }
      }
    } else {
      // Reset zoom state
      svg.style.transformOrigin = "center center";
      svg.style.transform = "scale(1)";
    }
  }, [clickedCountry, svgContent]);

  // Synchronize map states and event listeners
  useEffect(() => {
    if (!mapContainerRef.current || !svgContent) return;
    const svg = mapContainerRef.current.querySelector("svg");
    if (!svg) return;

    // 1. Style all inactive countries to look elegant and subtle
    const allPaths = svg.querySelectorAll("path");
    allPaths.forEach((path) => {
      const id = path.getAttribute("id");
      const isActiveCountry = items.some(
        (item) => countryCodes[item.country as keyof typeof countryCodes] === id
      );

      if (!isActiveCountry) {
        const element = path as SVGElement;
        element.style.fill = "#eaedf3"; 
        element.style.stroke = "#ffffff";
        element.style.strokeWidth = "0.5px";
        element.style.transition = "fill 0.4s ease";
        element.style.cursor = "default";
      }
    });

    // 2. Set up active countries styles and interaction event listeners
    items.forEach((item) => {
      const code = countryCodes[item.country as keyof typeof countryCodes];
      if (!code) return;
      const path = svg.querySelector(`#${code}`) as SVGGraphicsElement | null;
      if (!path) return;

      const isHovered = hoveredCountry === code;
      const isClicked = clickedCountry === code;

      // Premium highlight & glow states for active countries
      if (isClicked) {
        path.style.fill = "#1b1b36"; // corporate deep navy
        path.style.stroke = "#fdc520"; // gold border
        path.style.strokeWidth = "1.5px";
        path.style.filter = "drop-shadow(0 0 8px rgba(27,27,54,0.35))";
      } else if (isHovered) {
        path.style.fill = "#e0aa00"; // dark gold
        path.style.stroke = "#ffffff";
        path.style.strokeWidth = "1px";
        path.style.filter = "drop-shadow(0 0 10px rgba(253,197,32,0.6))";
      } else {
        path.style.fill = "#fdc520"; // default active brand gold
        path.style.stroke = "#ffffff";
        path.style.strokeWidth = "0.8px";
        path.style.filter = "none";
      }

      path.style.transition = "all 0.3s cubic-bezier(0.25, 1, 0.5, 1)";
      path.style.cursor = "pointer";

      // Attach event handlers
      const onMouseEnter = () => setHoveredCountry(code);
      const onMouseLeave = () => setHoveredCountry(null);
      const onClick = (e: Event) => {
        e.stopPropagation();
        setClickedCountry(prev => prev === code ? null : code);
      };

      path.addEventListener("mouseenter", onMouseEnter);
      path.addEventListener("mouseleave", onMouseLeave);
      path.addEventListener("click", onClick);

      // Keep references to handlers for clean teardown
      (path as any)._handlers = { onMouseEnter, onMouseLeave, onClick };
    });

    // Clear clicked state when clicking empty spots on the map
    const onMapClick = () => {
      setClickedCountry(null);
    };
    svg.addEventListener("click", onMapClick);

    return () => {
      svg.removeEventListener("click", onMapClick);
      items.forEach((item) => {
        const code = countryCodes[item.country as keyof typeof countryCodes];
        if (!code) return;
        const path = svg.querySelector(`#${code}`) as any;
        if (path && path._handlers) {
          path.removeEventListener("mouseenter", path._handlers.onMouseEnter);
          path.removeEventListener("mouseleave", path._handlers.onMouseLeave);
          path.removeEventListener("click", path._handlers.onClick);
        }
      });
    };
  }, [svgContent, hoveredCountry, clickedCountry, items]);

  // Find the selected item data
  const selectedItem = items.find(
    (item) => countryCodes[item.country as keyof typeof countryCodes] === clickedCountry
  );

  return (
    <section className="bg-[color:var(--bg)] py-14 sm:py-24">
      <div className="container-shell">
        {/* Header */}
        <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-12 md:mb-16">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-lg md:text-xl font-medium italic text-cta mb-4"
            style={{ fontFamily: "var(--font-serif), serif" }}
          >
            {eyebrow}
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-4 text-3xl font-black tracking-tight text-[color:var(--text)] sm:text-4xl md:mb-6 md:text-5xl lg:text-6xl"
          >
            {title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-600 leading-relaxed"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Content Box */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          className="relative rounded-2xl border border-slate-100 bg-white p-2 shadow-[0_30px_80px_rgba(27,27,54,0.05)] sm:p-5"
        >
            <div className="relative flex min-h-[260px] w-full items-center justify-center overflow-hidden rounded-xl border border-slate-100/70 bg-slate-50/50 sm:min-h-[400px] md:min-h-[520px]">
              
              {/* Clicked Country Info Popup */}
              <AnimatePresence>
                {selectedItem && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className="absolute bottom-3 left-3 right-3 z-20 rounded-xl border border-slate-200 bg-white p-4 shadow-xl sm:bottom-5 sm:left-auto sm:right-5 sm:min-w-[220px] sm:max-w-[260px] sm:rounded-2xl sm:p-5"
                  >
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setClickedCountry(null);
                      }}
                      className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors"
                      aria-label="Close details"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                    <span className="text-[10px] font-black text-cta uppercase tracking-wider mb-1.5 block">
                      {listTitle}
                    </span>
                    <h4 className="text-xl font-black text-slate-900 mb-1">
                      {selectedItem.country}
                    </h4>
                    <p className="text-xs font-semibold text-slate-600">
                      {t?.exportNetwork?.activeOperation} <strong className="text-[color:var(--text)]">{selectedItem.count} {craneLabel}</strong>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Interaction Hint Tooltip when nothing is selected */}
              {!selectedItem && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.75 }}
                  className="pointer-events-none absolute bottom-3 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full border border-slate-200/70 bg-white/85 px-3 py-1.5 text-[10px] font-semibold text-slate-500 shadow-sm backdrop-blur sm:bottom-5 sm:text-xs"
                >
                  💡 {t?.common?.mapInstruction}
                </motion.div>
              )}

              <div 
                ref={mapContainerRef}
                className="flex h-full w-full items-center justify-center px-1 transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-[1.01] sm:px-4 [&>svg]:h-auto [&>svg]:max-h-[500px] [&>svg]:w-full"
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            </div>
        </motion.div>
      </div>
    </section>
  );
}
