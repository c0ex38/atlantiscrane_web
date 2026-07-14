import React from "react";
import Link from "next/link";
import { Compass, Home, Search, ArrowRight } from "lucide-react";
import { Outfit } from "next/font/google";
import "./globals.css"; // ADD THIS!

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export default function NotFoundPage() {
  return (
    <html lang="en" className={`${outfit.variable}`}>
      <body className="min-h-screen m-0 p-0 font-sans">
        <div className="min-h-screen bg-[#070b14] text-white flex items-center justify-center relative overflow-hidden">
          {/* Background glow effects */}
      <div className="absolute top-1/4 -right-64 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute -bottom-64 -left-64 w-[800px] h-[800px] bg-[#FF2700]/5 rounded-full blur-[200px] pointer-events-none" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none mask-image-gradient" style={{ WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)' }} />

      <div className="relative z-10 container mx-auto px-6 max-w-4xl flex flex-col items-center text-center">
        {/* 404 Visual */}
        <div className="relative mb-8 group">
          <h1 className="text-[12rem] md:text-[18rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 leading-none select-none tracking-tighter">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 md:w-48 md:h-48 bg-[#070b14] rounded-full border border-white/10 flex items-center justify-center shadow-[0_0_100px_rgba(255,39,0,0.2)]">
              <Compass className="w-16 h-16 md:w-24 md:h-24 text-[#FF2700] animate-[spin_10s_linear_infinite]" />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight text-white drop-shadow-lg">
          Kayıp mı Oldunuz?
        </h2>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
          Aradığınız sayfa derin sulara gömülmüş veya rotası değişmiş olabilir. 
          <br className="hidden md:block" /> Güvenli limana dönmek için aşağıdaki bağlantıları kullanabilirsiniz.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
          <Link 
            href="/"
            className="group flex items-center gap-3 bg-white text-[#070b14] px-8 py-4 rounded-full font-bold hover:bg-slate-200 transition-all duration-300 w-full sm:w-auto justify-center hover:scale-105 active:scale-95 shadow-lg shadow-white/10"
          >
            <Home className="w-5 h-5" />
            <span>Ana Sayfaya Dön</span>
          </Link>
          
          <Link 
            href="/tr/products"
            className="group flex items-center gap-3 bg-white/5 border border-white/10 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all duration-300 w-full sm:w-auto justify-center hover:border-white/20"
          >
            <Search className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
            <span>Ürünlerimizi İnceleyin</span>
            <ArrowRight className="w-5 h-5 ml-2 -mr-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Footer/Brand mark */}
        <div className="mt-24 pt-8 border-t border-white/10 flex items-center gap-4 text-sm text-slate-500 font-semibold tracking-widest uppercase">
          <span className="w-12 h-px bg-white/10"></span>
          Atlantis Crane Co.
          <span className="w-12 h-px bg-white/10"></span>
        </div>
        </div>
      </div>
    </body>
  </html>
  );
}
