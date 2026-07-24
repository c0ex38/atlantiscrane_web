const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

// Used by admin pages to merge saved settings with form state
export function deepMerge<T>(fallback: T, override: unknown): T {
  if (!override || typeof override !== "object" || Array.isArray(override)) {
    return (override === undefined || override === null ? fallback : override) as T;
  }
  const result: Record<string, unknown> = {
    ...((fallback && typeof fallback === "object" && !Array.isArray(fallback)) ? fallback : {}),
  };
  for (const [key, value] of Object.entries(override as Record<string, unknown>)) {
    const base = result[key];
    result[key] = value && typeof value === "object" && !Array.isArray(value)
      ? deepMerge(base, value)
      : value;
  }
  return result as T;
}


export async function getProducts() {
  try {
    const res = await fetch(`${API_URL}/products`, { cache: "no-store" });
    if (!res.ok) throw new Error("API failed");
    const json = await res.json() as { data: any[] };
    return json.data || [];
  } catch {
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const res = await fetch(`${API_URL}/products/${slug}`, { cache: "no-store" });
    if (!res.ok) throw new Error("API failed");
    const json = await res.json() as { data: any };
    return json.data;
  } catch {
    throw new Error("Product not found");
  }
}

export async function getProjects() {
  try {
    const res = await fetch(`${API_URL}/projects`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("API failed");
    const json = await res.json() as { data: any[] };
    return json.data || [];
  } catch {
    return [];
  }
}

export async function getReferences() {
  try {
    const res = await fetch(`${API_URL}/references`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("API failed");
    const json = await res.json() as { data: any[] };
    return json.data || [];
  } catch {
    return [];
  }
}

export async function getSettings() {
  try {
    const res = await fetch(`${API_URL}/settings`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("API failed");
    const json = await res.json() as { data: any };
    return json.data || {};
  } catch {
    return {};
  }
}

export async function getSiteDictionary(locale: "tr" | "en" | "ar") {
  const settings = await getSettings();
  return settings?.site_content?.[locale] || {};
}
