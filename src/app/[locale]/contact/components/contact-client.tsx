"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Custom animation components
const FadeUp = ({ children, delay = 0, className = "" }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const SlideIn = ({ children, delay = 0, direction = "left", className = "" }: any) => (
  <motion.div
    initial={{ opacity: 0, x: direction === "left" ? -40 : 40 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

type ContactClientProps = {
  t: any;
  isRtl: boolean;
};

// Map configurations
const LOCATIONS = [
  {
    id: "istanbul",
    nameKey: "hqTitle",
    addressKey: "addressIstanbul",
    mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24147.28859942485!2d29.2801452!3d40.840742!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cad1ab8eb06cd1%3A0x7d6f555c4d0840!2sTuzla%20Tersaneler%20B%C3%B6lgesi!5e0!3m2!1str!2str!4v1710000000000!5m2!1str!2str"
  },
  {
    id: "dubai",
    nameKey: "branchTitle",
    addressKey: "addressDubai",
    mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28867.747167683935!2d55.2505503!3d25.2716386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f431604a8b79b%3A0xc665795328baabdc!2sDubai%20Maritime%20City!5e0!3m2!1str!2str!4v1710000000000!5m2!1str!2str"
  }
];

export default function ContactClient({ t, isRtl }: ContactClientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState(LOCATIONS[0].id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Message sent successfully!");
    }, 1500);
  };

  const activeLocation = LOCATIONS.find((loc) => loc.id === activeTab)!;

  return (
    <div className="relative pb-24 lg:pb-32 min-h-screen">
      {/* Premium Light Background with geometric touches */}
      <div className="absolute inset-0 pointer-events-none -z-10 bg-[#f8fafc]">
        {/* Soft grid */}
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        />
        
        {/* Gradients */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-100/40 to-transparent rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-amber-100/40 to-transparent rounded-full blur-[100px]" />
      </div>

      <div className="container-shell relative z-10 px-4 md:px-8 pt-12">
        {/* Header Section - Centered */}
        <div className="max-w-3xl mx-auto text-center mb-16 lg:mb-24">
          <FadeUp delay={0.1}>
            <div className="inline-flex items-center gap-3 mb-6 bg-white/60 px-4 py-2 rounded-full border border-slate-200/60 shadow-sm backdrop-blur-sm">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[color:var(--cta)] animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" style={{ animationDelay: "0.4s" }} />
              </div>
              <span className="text-[10px] font-mono tracking-[0.3em] text-slate-700 uppercase font-bold">
                {t.contact.eyebrow}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight text-slate-900 mb-6 leading-[1.1]">
              {t.contact.title}
            </h1>
            <p className="text-slate-600 text-lg md:text-xl leading-relaxed font-medium mx-auto">
              {t.contact.description}
            </p>
          </FadeUp>
        </div>

        {/* Main Content Layout */}
        <div className={`grid grid-cols-1 xl:grid-cols-[1fr_1.1fr] gap-8 xl:gap-16 ${isRtl ? "direction-rtl" : ""}`}>
          
          {/* Left Column: Form */}
          <SlideIn delay={0.3} direction={isRtl ? "right" : "left"}>
            <div className="relative p-8 md:p-12 rounded-[2rem] bg-white border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden h-full flex flex-col justify-center">
              {/* Decorative line */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-[color:var(--cta)] to-blue-600" />
              
              <div className={`mb-10 ${isRtl ? "text-right" : "text-left"}`}>
                <h2 className="text-3xl font-black text-slate-900 mb-3">{t.contact.formTitle}</h2>
                <p className="text-base text-slate-500 font-medium leading-relaxed">{t.contact.formDesc}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isRtl ? "direction-rtl" : ""}`}>
                  <div className="space-y-2 relative group">
                    <input
                      type="text"
                      required
                      placeholder={t.contact.namePlaceholder}
                      className={`w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4.5 text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all ${isRtl ? "text-right" : "text-left"}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <input
                      type="email"
                      required
                      placeholder={t.contact.emailPlaceholder}
                      className={`w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4.5 text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all ${isRtl ? "text-right" : "text-left"}`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    required
                    placeholder={t.contact.subjectPlaceholder}
                    className={`w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4.5 text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all ${isRtl ? "text-right" : "text-left"}`}
                  />
                </div>

                <div className="space-y-2">
                  <textarea
                    required
                    rows={5}
                    placeholder={t.contact.messagePlaceholder}
                    className={`w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4.5 text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all resize-none ${isRtl ? "text-right" : "text-left"}`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`group w-full relative flex items-center justify-center gap-3 px-8 py-5.5 bg-slate-900 text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-600 hover:shadow-[0_12px_30px_rgba(37,99,235,0.25)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed ${isRtl ? "flex-row-reverse" : ""}`}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{t.contact.sendBtn}</span>
                      <svg
                        className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        style={isRtl ? { transform: "rotate(180deg)" } : {}}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>
          </SlideIn>

          {/* Right Column: Maps & Info */}
          <SlideIn delay={0.4} direction={isRtl ? "left" : "right"}>
            <div className="flex flex-col h-full gap-6">
              
              {/* Direct Contact Cards */}
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${isRtl ? "direction-rtl" : ""}`}>
                <a href={`mailto:${t.contact.email}`} className="flex flex-col items-center justify-center gap-3 p-6 rounded-[2rem] bg-white border border-slate-200 shadow-lg shadow-slate-200/40 hover:border-blue-200 hover:shadow-blue-100 transition-all group">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="font-bold text-slate-700">{t.contact.email}</span>
                </a>
                <a href={`tel:${t.contact.phone.replace(/\s/g, "")}`} className="flex flex-col items-center justify-center gap-3 p-6 rounded-[2rem] bg-white border border-slate-200 shadow-lg shadow-slate-200/40 hover:border-[color:var(--cta)] hover:shadow-[color:var(--cta)]/20 transition-all group">
                  <div className="w-12 h-12 rounded-full bg-[color:var(--cta)]/10 text-yellow-600 flex items-center justify-center group-hover:bg-[color:var(--cta)] group-hover:text-slate-900 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className="font-bold text-slate-700">{t.contact.phone}</span>
                </a>
              </div>

              {/* Map & Locations Container */}
              <div className="flex-1 flex flex-col rounded-[2rem] bg-white border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden min-h-[500px]">
                
                {/* Tabs */}
                <div className="flex border-b border-slate-100 p-2">
                  {LOCATIONS.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => setActiveTab(loc.id)}
                      className={`flex-1 py-4 px-4 rounded-xl text-sm font-bold tracking-widest uppercase transition-all ${
                        activeTab === loc.id
                          ? "bg-slate-900 text-white shadow-md"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                      }`}
                    >
                      {t.contact[loc.nameKey as keyof typeof t.contact]}
                    </button>
                  ))}
                </div>

                {/* Active Location Info & Map */}
                <div className="flex-1 flex flex-col relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 flex flex-col"
                    >
                      {/* Address Bar */}
                      <div className={`p-6 bg-slate-50/50 flex items-start gap-4 ${isRtl ? "flex-row-reverse" : ""}`}>
                        <div className="mt-1 shrink-0 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-red-500">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <p className={`text-slate-700 font-semibold leading-relaxed whitespace-pre-wrap ${isRtl ? "text-right" : "text-left"}`}>
                          {t.contact[activeLocation.addressKey as keyof typeof t.contact]}
                        </p>
                      </div>

                      {/* Map Iframe */}
                      <div className="flex-1 w-full bg-slate-100 relative">
                        <iframe
                          src={activeLocation.mapSrc}
                          className="absolute inset-0 w-full h-full border-0"
                          allowFullScreen={false}
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title={`Map of ${t.contact[activeLocation.nameKey as keyof typeof t.contact]}`}
                        ></iframe>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

              </div>
            </div>
          </SlideIn>

        </div>
      </div>
    </div>
  );
}
