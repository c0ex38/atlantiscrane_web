"use client";

export type AdminSectionTab<T extends string> = {
  id: T;
  label: string;
  description?: string;
};

type AdminSectionTabsProps<T extends string> = {
  tabs: readonly AdminSectionTab<T>[];
  activeTab: T;
  onChange: (tab: T) => void;
};

export function AdminSectionTabs<T extends string>({
  tabs,
  activeTab,
  onChange,
}: AdminSectionTabsProps<T>) {
  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-2 shadow-sm">
      <div
        role="tablist"
        aria-label="İçerik bölümleri"
        className="flex gap-1 overflow-x-auto pb-1 sm:grid sm:pb-0"
        style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
      >
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={`min-w-max rounded-xl px-4 py-3 text-left transition-all sm:min-w-0 ${
                isActive
                  ? "bg-primary text-white shadow-md shadow-primary/15"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              }`}
            >
              <span className={`mr-2 text-[10px] font-black ${isActive ? "text-white/65" : "text-muted-foreground/50"}`}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-xs font-bold">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTabData?.description && (
        <p className="border-t border-border/50 px-3 pb-1 pt-3 text-xs text-muted-foreground">
          {activeTabData.description}
        </p>
      )}
    </div>
  );
}
