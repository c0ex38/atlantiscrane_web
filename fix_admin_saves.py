import re

# Files to fix
files = [
    "frontend/src/app/admin/home/page.tsx",
    "frontend/src/app/admin/common/page.tsx",
    "frontend/src/app/admin/contact/page.tsx",
    "frontend/src/app/admin/product-texts/page.tsx",
    "frontend/src/app/admin/seo/page.tsx",
    "frontend/src/app/admin/about/page.tsx",
]

# The old handleSave pattern (saves just siteContent)
old_payload = '''    const payload = {
      settings: {
        site_content: siteContent,
      }
    };

    try {
      await apiFetch("/settings", {
        method: "POST",
        body: JSON.stringify(payload),
      });'''

# New handleSave that first fetches current content, merges, then saves
new_payload = '''    // Fetch current backend state and merge to avoid wiping other admin pages' data
    let mergedContent = structuredClone(siteContent);
    try {
      const currentRes = await apiFetch("/settings") as { data: Record<string, any> };
      const currentSiteContent = currentRes?.data?.site_content;
      if (currentSiteContent && typeof currentSiteContent === "object") {
        // Merge: backend is base, our edits override
        mergedContent = {
          tr: { ...currentSiteContent.tr, ...siteContent.tr },
          en: { ...currentSiteContent.en, ...siteContent.en },
          ar: { ...currentSiteContent.ar, ...siteContent.ar },
        };
      }
    } catch { /* continue with local state */ }

    const payload = {
      settings: {
        site_content: mergedContent,
      }
    };

    try {
      await apiFetch("/settings", {
        method: "POST",
        body: JSON.stringify(payload),
      });'''

for filepath in files:
    try:
        with open(filepath, "r") as f:
            content = f.read()
        if old_payload in content:
            content = content.replace(old_payload, new_payload)
            with open(filepath, "w") as f:
                f.write(content)
            print(f"Fixed: {filepath}")
        else:
            print(f"Pattern not found in: {filepath}")
    except FileNotFoundError:
        print(f"File not found: {filepath}")
