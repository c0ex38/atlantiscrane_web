"use client";

import { createContext, useContext, type ReactNode } from "react";
import { translations, type Locale } from "../lib/site-content";

const SiteContentContext = createContext<any>(null);

export function SiteContentProvider({ content, children }: { content: any; children: ReactNode }) {
  return <SiteContentContext.Provider value={content}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent(locale: Locale) {
  return (useContext(SiteContentContext) || translations[locale]) as (typeof translations)[Locale];
}
