"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

interface UserProfile {
  id: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  accessToken: string | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  apiFetch: (path: string, options?: RequestInit) => Promise<unknown>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // 1. Clear Session
  const clearSession = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [pathname, router]);

  // 2. Refresh Session
  const refreshSession = useCallback(async (): Promise<string> => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include", // Essential for HttpOnly cookie
      });

      if (!res.ok) {
        throw new Error("Refresh failed");
      }

      const result = await res.json();
      const token = result.data.accessToken;
      setAccessToken(token);

      // Fetch user profile with the new access token
      const meRes = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (meRes.ok) {
        const meResult = await meRes.json();
        setUser(meResult.data);
      }

      return token;
    } catch (e) {
      clearSession();
      throw e;
    }
  }, [clearSession]);

  // 3. Helper for authenticated API calls
  const apiFetch = useCallback(
    async (path: string, options: RequestInit = {}) => {
      const headers = new Headers(options.headers || {});
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
      if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
      }

      const res = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
      });

      if (!res.ok) {
        if (res.status === 401 && path !== "/auth/refresh" && path !== "/auth/login") {
          // Access token might have expired, try to refresh
          try {
            const newAccessToken = await refreshSession();
            // Retry the original request with the new token
            headers.set("Authorization", `Bearer ${newAccessToken}`);
            const retryRes = await fetch(`${API_BASE_URL}${path}`, {
              ...options,
              headers,
            });
            if (!retryRes.ok) {
              throw new Error("API call failed after token refresh.");
            }
            return retryRes.json();
          } catch (e) {
            // Refresh failed, clear session and redirect to login
            clearSession();
            throw e;
          }
        }
        
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Bir API hatası oluştu.");
      }

      if (res.status === 204) {
        return null;
      }
      return res.json();
    },
    [accessToken, clearSession, refreshSession]
  );

  // Perform initial session restore from cookies on load
  useEffect(() => {
    const initAuth = async () => {
      if (pathname.startsWith("/admin")) {
        try {
          await refreshSession();
        } catch {
          // If refresh fails on load, redirect to login unless already on login page
          if (pathname !== "/admin/login") {
            router.push("/admin/login");
          }
        }
      }
      setIsLoading(false);
    };

    void initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
        credentials: "include",
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Giriş başarısız oldu.");
      }

      const result = await res.json();
      setAccessToken(result.data.accessToken);

      // Fetch user context
      const userRes = await apiFetch("/auth/me", {
        headers: { Authorization: `Bearer ${result.data.accessToken}` },
      });
      setUser(userRes.data);

      router.push("/admin");
    } catch (e) {
      throw e;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      }).catch(() => {});
    } finally {
      clearSession();
    }
  };

  const value = {
    isAuthenticated: !!accessToken,
    isLoading,
    user,
    accessToken,
    login,
    logout,
    apiFetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
