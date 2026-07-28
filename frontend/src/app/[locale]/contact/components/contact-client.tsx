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

const ScaleIn = ({ children, delay = 0, className = "" }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

type ContactClientProps = {
  t: any;
  isRtl: boolean;
  locations?: ContactLocation[];
};

type ContactLocation = {
  id: string;
  title: string;
  address: string;
  mapUrl: string;
  tag: string;
};

const DEFAULT_LOCATIONS: ContactLocation[] = [
  {
    id: "istanbul",
    title: "",
    address: "",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24147.28859942485!2d29.2801452!3d40.840742!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cad1ab8eb06cd1%3A0x7d6f555c4d0840!2sTuzla%20Tersaneler%20B%C3%B6lgesi!5e0!3m2!1str!2str!4v1710000000000!5m2!1str!2str",
    tag: "TR"
  },
  {
    id: "dubai",
    title: "",
    address: "",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28867.747167683935!2d55.2505503!3d25.2716386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f431604a8b79b%3A0xc665795328baabdc!2sDubai%20Maritime%20City!5e0!3m2!1str!2str!4v1710000000000!5m2!1str!2str",
    tag: "UAE"
  }
];

export default function ContactClient({ t, isRtl, locations }: ContactClientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fallbackLocations = DEFAULT_LOCATIONS.map((location, index) => ({
    ...location,
    title: index === 0 ? t.contact.hqTitle : t.contact.branchTitle,
    address: index === 0 ? t.contact.addressIstanbul : t.contact.addressDubai,
  }));
  const visibleLocations = Array.isArray(locations)
    ? locations.map((location, index) => ({
        ...location,
        mapUrl: location.mapUrl || DEFAULT_LOCATIONS[index]?.mapUrl || "",
      }))
    : fallbackLocations;
  const [activeTab, setActiveTab] = useState(visibleLocations[0]?.id || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
      const res = await fetch(`${apiUrl}/enquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Form submission failed');

      alert("Message sent successfully!");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      alert("Error sending message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeLoc = visibleLocations.find((loc) => loc.id === activeTab) || visibleLocations[0];

  return (
    <div className="relative pb-24 lg:pb-32 min-h-screen">
      {/* Structural Background */}
      <div className="absolute inset-0 pointer-events-none -z-10 bg-[#f8fafc]">
        {/* Soft engineering grid */}
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        />
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-blue-100/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-amber-100/30 rounded-full blur-[100px]" />
      </div>

      <div className="container-shell relative z-10 px-3 pt-8 sm:px-4 sm:pt-12 md:px-8">
        {/* Header Section */}
        <div className="mx-auto mb-8 max-w-4xl text-center sm:mb-12">
          <FadeUp delay={0.1}>
            <div className="inline-flex items-center gap-3 mb-6 bg-white/80 px-4 py-2 rounded-full border border-slate-200/80 shadow-sm backdrop-blur-md">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cta animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" style={{ animationDelay: "0.4s" }} />
              </div>
              <span className="text-[10px] font-mono tracking-[0.3em] text-slate-700 uppercase font-bold">
                {t.contact.eyebrow}
              </span>
            </div>
            <h1 className="mb-4 text-3xl font-black leading-[1.05] tracking-tight text-slate-900 sm:text-4xl md:mb-6 md:text-6xl lg:text-7xl">
              {t.contact.title}
            </h1>
            <p className="mx-auto max-w-2xl text-base font-medium leading-relaxed text-slate-600 sm:text-lg md:text-xl">
              {t.contact.description}
            </p>
          </FadeUp>
        </div>

        {/* BENTO GRID LAYOUT */}
        <div className="flex flex-col gap-6 max-w-7xl mx-auto">
          
          {/* TOP ROW: MAP + INFO */}
          <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 ${isRtl ? "direction-rtl" : ""}`}>
            
            {/* LARGE MAP CARD */}
            <ScaleIn delay={0.2} className="group relative h-[380px] overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 shadow-2xl shadow-slate-200/50 sm:h-[500px] sm:rounded-[2.5rem] md:h-[600px] lg:col-span-8">
              {activeLoc?.mapUrl ? <AnimatePresence mode="wait">
                <motion.iframe
                  key={activeTab}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  src={activeLoc.mapUrl}
                  className="absolute inset-0 w-full h-full border-0 filter grayscale-[20%] contrast-125 transition-all duration-700 group-hover:grayscale-0"
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map of ${activeLoc.title}`}
                />
              </AnimatePresence> : (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100 px-8 text-center text-sm font-semibold text-slate-500">
                  Bu adres için harita bağlantısı henüz eklenmedi.
                </div>
              )}

              {/* FLOATING LOCATION SWITCHER */}
              {visibleLocations.length > 0 && <div className={`absolute top-6 ${isRtl ? "right-6" : "left-6"} flex max-w-[calc(100%-3rem)] gap-2 overflow-x-auto bg-white/90 p-2 rounded-2xl backdrop-blur-md border border-white shadow-xl`}>
                {visibleLocations.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => setActiveTab(loc.id)}
                    className={`relative px-6 py-3 rounded-xl text-sm font-bold tracking-widest uppercase transition-all duration-300 overflow-hidden ${
                      activeTab === loc.id
                        ? "text-white shadow-md"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    {activeTab === loc.id && (
                      <motion.div
                        layoutId="activeMapTab"
                        className="absolute inset-0 bg-slate-900 rounded-xl -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${activeTab === loc.id ? "bg-cta" : "bg-transparent"}`} />
                      {loc.tag || loc.title}
                    </span>
                  </button>
                ))}
              </div>}

              {/* MAP OVERLAY GRADIENT */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900/40 to-transparent pointer-events-none" />
              
              {/* LOCATION PIN LABEL */}
              {activeLoc && <div className={`absolute bottom-6 ${isRtl ? "right-6" : "left-6"} bg-slate-900/90 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-4`}>
                <div className="w-10 h-10 rounded-full bg-cta text-slate-900 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className={`${isRtl ? "text-right" : "text-left"}`}>
                  <span className="block text-[10px] font-mono tracking-widest text-cta uppercase mb-0.5">{activeLoc?.title}</span>
                  <span className="block text-sm font-bold text-white uppercase tracking-wider">{activeLoc?.tag}</span>
                </div>
              </div>}
            </ScaleIn>

            {/* INFO & QUICK CONTACTS CARD */}
            <ScaleIn delay={0.3} className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 text-white shadow-2xl sm:rounded-[2.5rem] lg:col-span-4">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
              
              <div className="flex flex-1 flex-col justify-center p-6 sm:p-8 md:p-10">
                {visibleLocations.map((location) => (
                  <div className="mb-8 last:mb-4" key={location.id}>
                    <h2 className="text-xl font-black mb-5 pb-3 border-b border-white/10 text-white">
                      {location.title}
                    </h2>
                    <div className={`flex items-start gap-4 ${isRtl ? "flex-row-reverse" : ""}`}>
                    <div className="mt-1 opacity-50 shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <p className={`text-slate-300 font-medium leading-relaxed whitespace-pre-wrap ${isRtl ? "text-right" : "text-left"}`}>
                      {location.address}
                    </p>
                  </div>
                  </div>
                ))}
              </div>

              {/* Bottom Quick Contact Strip */}
              <div className="bg-white/5 border-t border-white/10 p-4 md:p-6 flex flex-col gap-3">
                <a href={`mailto:${t.contact.email}`} className={`w-full bg-white/5 hover:bg-cta hover:text-slate-900 border border-white/10 hover:border-transparent rounded-2xl p-4 flex items-center justify-center gap-3 transition-all duration-300 group ${isRtl ? "flex-row-reverse" : ""}`}>
                  <svg className="w-5 h-5 text-cta group-hover:text-slate-900 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <span className="font-bold text-sm sm:text-base truncate">{t.contact.email}</span>
                </a>
                <a href={`tel:${t.contact.phone.replace(/\s/g, "")}`} className={`w-full bg-white/5 hover:bg-blue-600 hover:text-white border border-white/10 hover:border-transparent rounded-2xl p-4 flex items-center justify-center gap-3 transition-all duration-300 group ${isRtl ? "flex-row-reverse" : ""}`}>
                  <svg className="w-5 h-5 text-blue-400 group-hover:text-white transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  <span className="font-bold text-sm sm:text-base truncate">{t.contact.phone}</span>
                </a>
              </div>
            </ScaleIn>

          </div>

          {/* BOTTOM ROW: FORM */}
          <ScaleIn delay={0.4} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/50 sm:rounded-[2.5rem]">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-cta to-blue-600" />
            
            <div className={`grid grid-cols-1 gap-8 p-5 sm:p-8 md:grid-cols-12 md:gap-12 md:p-12 lg:p-16 ${isRtl ? "direction-rtl" : ""}`}>
              
              {/* Form Intro */}
              <div className={`md:col-span-4 flex flex-col justify-center ${isRtl ? "text-right" : "text-left"}`}>
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                </div>
                <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4">{t.contact.formTitle}</h2>
                <p className="text-base text-slate-500 font-medium leading-relaxed">{t.contact.formDesc}</p>
              </div>

              {/* Form Fields */}
              <div className="md:col-span-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${isRtl ? "direction-rtl" : ""}`}>
                    <div className="space-y-2">
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder={t.contact.namePlaceholder}
                        className={`w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4.5 text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all ${isRtl ? "text-right" : "text-left"}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder={t.contact.emailPlaceholder}
                        className={`w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4.5 text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all ${isRtl ? "text-right" : "text-left"}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      name="subject"
                      required
                      placeholder={t.contact.subjectPlaceholder}
                      className={`w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4.5 text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all ${isRtl ? "text-right" : "text-left"}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <textarea
                      name="message"
                      required
                      rows={4}
                      placeholder={t.contact.messagePlaceholder}
                      className={`w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4.5 text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all resize-none ${isRtl ? "text-right" : "text-left"}`}
                    />
                  </div>

                  <div className={`flex ${isRtl ? "justify-start" : "justify-end"}`}>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`group relative flex items-center justify-center gap-3 px-10 py-5 bg-slate-900 text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-600 hover:shadow-[0_12px_30px_rgba(37,99,235,0.25)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed ${isRtl ? "flex-row-reverse" : ""}`}
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
                  </div>
                </form>
              </div>
            </div>
          </ScaleIn>

        </div>
      </div>
    </div>
  );
}
