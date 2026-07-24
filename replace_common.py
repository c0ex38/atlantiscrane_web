import sys

with open("frontend/src/app/admin/common/page.tsx", "r") as f:
    content = f.read()

content = content.replace(
    "const notFound = currentContent.notFound || {};",
    "const notFound = currentContent.notFound || {};\n  const footer = currentContent.footer || {};"
)

footer_html = """
        {/* Footer */}
        <div className="space-y-4 pt-6 border-t border-[#F2F0EF]">
          <h3 className="text-sm font-black text-card-foreground uppercase tracking-wider border-b border-[#F2F0EF] pb-2">3. Footer (Alt Bilgi)</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Şirket Açıklaması</label>
              <textarea
                value={footer.description || ""}
                onChange={(e) => updateField("footer", "description", e.target.value)}
                className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-sm text-card-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors min-h-[80px]"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Hızlı Bağlantılar Başlığı</label>
                <input type="text" value={footer.quickLinks || ""} onChange={(e) => updateField("footer", "quickLinks", e.target.value)} className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Tasarım Tarafından (Örn: Designed by)</label>
                <input type="text" value={footer.designedBy || ""} onChange={(e) => updateField("footer", "designedBy", e.target.value)} className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Tüm Hakları Saklıdır</label>
                <input type="text" value={footer.allRightsReserved || ""} onChange={(e) => updateField("footer", "allRightsReserved", e.target.value)} className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Haklar</label>
                <input type="text" value={footer.rights || ""} onChange={(e) => updateField("footer", "rights", e.target.value)} className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Çok Dilli (Multilingual)</label>
                <input type="text" value={footer.multilingual || ""} onChange={(e) => updateField("footer", "multilingual", e.target.value)} className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-sm" />
              </div>
            </div>
          </div>
        </div>
"""

content = content.replace(
    "        {/* Action Bar */}",
    footer_html + "\n        {/* Action Bar */}"
)

with open("frontend/src/app/admin/common/page.tsx", "w") as f:
    f.write(content)
