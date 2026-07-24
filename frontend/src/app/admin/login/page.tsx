"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  // If already logged in, redirect straight to dashboard
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push("/admin");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Basic frontend checks
    if (!email) {
      setErrorMsg("E-posta alanı boş bırakılamaz.");
      return;
    }
    if (!password) {
      setErrorMsg("Şifre alanı boş bırakılamaz.");
      return;
    }
    if (password.length < 10) {
      setErrorMsg("Şifre en az 10 karakter olmalıdır.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <div className="w-full max-w-[440px] bg-card border border-border rounded-xl shadow-lg shadow-black/5 p-8">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl mb-4">
            AC
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-card-foreground">Giriş Yapın</h2>
          <p className="text-sm text-muted-foreground mt-1">Atlantis Crane Yönetim Paneli</p>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-lg bg-[#FCE7E7] border border-[#C62828]/20 flex items-start gap-3">
            <svg 
              className="h-5 w-5 text-[#C62828] shrink-0 mt-0.5" 
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <div className="text-xs font-semibold text-[#C62828]">{errorMsg}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-card-foreground" htmlFor="email">
              E-posta Adresi
            </label>
            <input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              className="min-h-[44px] px-4 py-2 border border-border rounded-lg text-sm bg-card placeholder-[#9B9795] focus:outline-none focus:border-primary focus:ring-4 focus:ring-[#FF2700]/10 disabled:opacity-60 transition-all duration-150"
            />
          </div>

          {/* Password field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-card-foreground" htmlFor="password">
              Şifre
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              className="min-h-[44px] px-4 py-2 border border-border rounded-lg text-sm bg-card placeholder-[#9B9795] focus:outline-none focus:border-primary focus:ring-4 focus:ring-[#FF2700]/10 disabled:opacity-60 transition-all duration-150"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-[44px] mt-2 flex items-center justify-center gap-2 rounded-lg bg-primary text-white font-bold text-sm shadow-md shadow-primary/15 hover:bg-[#DB2100] active:scale-[0.98] disabled:opacity-60 transition-all duration-150 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Giriş Yapılıyor...</span>
              </>
            ) : (
              <span>Giriş Yap</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
