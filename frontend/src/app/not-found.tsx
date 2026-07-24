import React from "react";
import Link from "next/link";
import { Compass, Home, Search, ArrowRight } from "lucide-react";
import { Outfit, Lora, Geist } from "next/font/google";
import "./globals.css";
import { getSiteDictionary, getSettings } from "./lib/api";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { SiteContentProvider } from "./components/site-content-provider";
import { cn } from "@/lib/utils";
import PremiumLoader from "./components/premium-loader";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });
const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"] });
const lora = Lora({ variable: "--font-lora", subsets: ["latin"], style: ["normal", "italic"] });

export default async function NotFoundPage() {
  const defaultLocale = "tr";
  const t = await getSiteDictionary(defaultLocale);
  const settings = await getSettings();

  const fontVariables = cn(
    outfit.variable,
    lora.variable,
    geist.variable
  );

  return (
    <html lang={defaultLocale} className={cn("h-full", "antialiased", fontVariables, "font-sans")}>
      <body className="min-h-full flex flex-col font-sans bg-white">
        <SiteContentProvider content={t}>
          <PremiumLoader />
          <Navbar locale={defaultLocale} />
          
          <main className="flex-1 flex flex-col">
            <div className="flex-1 bg-slate-50 text-slate-900 flex items-center justify-center relative overflow-hidden py-24">
              {/* Background glow effects */}
              <div className="absolute top-1/4 -right-64 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[150px] pointer-events-none" />
              <div className="absolute -bottom-64 -left-64 w-[800px] h-[800px] bg-[#FF2700]/5 rounded-full blur-[200px] pointer-events-none" />
              
              {/* Grid Pattern */}
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none mask-image-gradient" style={{ WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)' }} />

              <div className="relative z-10 container mx-auto px-6 max-w-4xl flex flex-col items-center text-center">
                {/* 404 Visual */}
                <div className="relative mb-8 group mt-16 md:mt-24">
                  <h1 className="text-[12rem] md:text-[18rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-200 to-slate-100/50 leading-none select-none tracking-tighter">
                    404
                  </h1>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 md:w-48 md:h-48 bg-white rounded-full border border-slate-100 flex items-center justify-center shadow-[0_20px_60px_rgba(255,39,0,0.1)]">
                      <Compass className="w-16 h-16 md:w-24 md:h-24 text-[#FF2700] animate-[spin_10s_linear_infinite]" />
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight text-slate-900 drop-shadow-sm">
                  {t?.notFound?.title}
                </h2>
                <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed whitespace-pre-line">
                  {t?.notFound?.description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
                  <Link 
                    href="/tr"
                    className="group flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition-all duration-300 w-full sm:w-auto justify-center hover:scale-105 active:scale-95 shadow-lg shadow-slate-900/20"
                  >
                    <Home className="w-5 h-5" />
                    <span>{t?.notFound?.goHome}</span>
                  </Link>
                  
                  <Link 
                    href="/tr/products"
                    className="group flex items-center gap-3 bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-full font-bold hover:bg-slate-50 transition-all duration-300 w-full sm:w-auto justify-center hover:border-slate-300 shadow-sm"
                  >
                    <Search className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                    <span>{t?.notFound?.viewProducts}</span>
                    <ArrowRight className="w-5 h-5 ml-2 -mr-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Footer/Brand mark */}
                <div className="mt-24 pt-8 border-t border-slate-200 flex items-center gap-4 text-sm text-slate-400 font-semibold tracking-widest uppercase">
                  <span className="w-12 h-px bg-slate-200"></span>
                  {t?.notFound?.brandTag}
                  <span className="w-12 h-px bg-slate-200"></span>
                </div>
              </div>
            </div>
          </main>
          
          <Footer locale={defaultLocale} settings={settings} />
        </SiteContentProvider>
      </body>
    </html>
  );
}
