"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const trackedPaths = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Avoid double tracking in React StrictMode
    if (trackedPaths.current.has(pathname)) return;
    
    // Determine the API URL depending on the environment
    // Normally it's relative if we are on the same domain, or we use NEXT_PUBLIC_API_URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

    fetch(`${apiUrl}/analytics/visit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path: pathname }),
    }).catch((err) => {
      // Silently fail if tracker is blocked
      console.error("Failed to record visit:", err);
    });

    trackedPaths.current.add(pathname);
  }, [pathname]);

  return null;
}
