"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { translations, type Locale } from "../lib/site-content";

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
  const t = translations[locale];
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

  // Sync hovered state with SVG elements
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const svg = mapContainerRef.current.querySelector("svg");
    if (!svg) return;

    // Reset all active countries styles
    items.forEach((item) => {
      const code = countryCodes[item.country as keyof typeof countryCodes];
      if (!code) return;
      const path = svg.querySelector(`#${code}`);
      if (path) {
        const isHovered = hoveredCountry === code;
        const isClicked = clickedCountry === code;
        
        if (isClicked) {
          (path as HTMLElement).style.fill = "#1b1b36"; // Selected country: Corporate deep navy
        } else if (isHovered) {
          (path as HTMLElement).style.fill = "#e0aa00"; // Hover: Dark gold
        } else {
          (path as HTMLElement).style.fill = "#fdc520"; // Default active: Brand gold
        }
        (path as HTMLElement).style.transition = "fill 0.3s ease";
        (path as HTMLElement).style.cursor = "pointer";
        
        // Add event listeners for map interactions
        path.addEventListener("mouseenter", () => setHoveredCountry(code));
        path.addEventListener("mouseleave", () => setHoveredCountry(null));
        path.addEventListener("click", () => setClickedCountry(isClicked ? null : code));
      }
    });

    return () => {
      items.forEach((item) => {
        const code = countryCodes[item.country as keyof typeof countryCodes];
        if (!code) return;
        const path = svg.querySelector(`#${code}`);
        if (path) {
          path.replaceWith(path.cloneNode(true)); // remove event listeners safely
        }
      });
    };
  }, [svgContent, hoveredCountry, clickedCountry, items]);

  // Find the selected item data
  const selectedItem = items.find(
    (item) => countryCodes[item.country as keyof typeof countryCodes] === clickedCountry
  );

  return (
    <section className="bg-[color:var(--bg)] py-24 sm:py-32">
      <div className="container-shell">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-lg md:text-xl font-medium italic text-[color:var(--cta)] mb-4"
            style={{ fontFamily: "var(--font-serif), serif" }}
          >
            {eyebrow}
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-[color:var(--text)] tracking-tight mb-6"
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
          className="bg-white border border-slate-100 shadow-[0_30px_80px_rgba(27,27,54,0.05)] p-8 sm:p-12 rounded-2xl relative"
        >
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            
            {/* Left Column: List */}
            <div className="w-full lg:w-1/3 z-10">
              <h3 className="text-sm font-black text-[color:var(--text)] uppercase tracking-widest mb-8 pb-4 border-b border-slate-200">
                {listTitle}
              </h3>
              
              <ul className="space-y-3">
                {items.map((item, index) => {
                  const code = countryCodes[item.country as keyof typeof countryCodes];
                  const isHovered = hoveredCountry === code;
                  const isClicked = clickedCountry === code;
                  const isActive = isHovered || isClicked;

                  return (
                    <motion.li 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, delay: 0.05 * index }}
                      key={index} 
                      onMouseEnter={() => setHoveredCountry(code)}
                      onMouseLeave={() => setHoveredCountry(null)}
                      onClick={() => setClickedCountry(isClicked ? null : code)}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                        isActive ? "bg-[color:var(--bg)] shadow-sm scale-[1.02] border border-[color:var(--cta)]" : "hover:bg-slate-50 border border-transparent"
                      }`}
                    >
                      <span className={`text-sm font-bold transition-colors duration-300 ${
                        isActive ? "text-[color:var(--text)]" : "text-slate-600"
                      }`}>
                        {item.country}
                      </span>
                      <span className={`inline-flex items-center justify-center px-3 py-1.5 text-xs font-black min-w-[80px] text-center rounded-md transition-colors duration-300 ${
                        isActive ? "bg-[#e0aa00] text-white" : "bg-[color:var(--cta)] text-slate-900"
                      }`}>
                        {item.count} {craneLabel}
                      </span>
                    </motion.li>
                  );
                })}
              </ul>
            </div>

            {/* Right Column: Interactive SVG Map */}
            <div className="w-full lg:w-2/3 relative flex items-center justify-center overflow-hidden min-h-[300px] md:min-h-[500px] rounded-2xl bg-slate-50/50 border border-slate-100/50">
              
              {/* Clicked Country Info Popup - Moved to Bottom Right & made highly responsive */}
              <AnimatePresence>
                {selectedItem && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className="absolute bottom-4 right-4 z-20 bg-white border border-slate-200 shadow-xl rounded-2xl p-6 min-w-[200px] max-w-[calc(100%-32px)] md:max-w-[240px]"
                  >
                    <button 
                      onClick={() => setClickedCountry(null)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors"
                      aria-label="Close details"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                    <span className="text-[10px] font-black text-[color:var(--cta)] uppercase tracking-wider mb-1.5 block">
                      {listTitle}
                    </span>
                    <h4 className="text-xl font-black text-slate-900 mb-1">
                      {selectedItem.country}
                    </h4>
                    <p className="text-xs font-semibold text-slate-600">
                      {t.exportNetwork.activeOperation} <strong className="text-[color:var(--text)]">{selectedItem.count} {craneLabel}</strong>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div 
                ref={mapContainerRef}
                className="w-full h-full transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-[1.01] [&>svg]:w-full [&>svg]:h-auto [&>svg]:max-h-[500px]"
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
