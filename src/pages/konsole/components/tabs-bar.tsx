import { useTranslation } from "react-i18next";
import type { KonsoleTab } from "../useKonsoleLogic";

const TABS: { key: KonsoleTab; labelKey: string }[] = [
  { key: "aufgaben", labelKey: "tabs.aufgaben" },
  { key: "einkauf", labelKey: "tabs.einkauf" },
  { key: "routine", labelKey: "tabs.routine" },
  { key: "status", labelKey: "tabs.status" },
];

export function TabsBar({ tab, setTab }: { tab: KonsoleTab; setTab: (t: KonsoleTab) => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap gap-2">
      {TABS.map((tb) => {
        const active = tab === tb.key;
        return (
          <button
            type="button"
            key={tb.key}
            data-testid={`tab-${tb.key}`}
            onClick={() => setTab(tb.key)}
            className="min-h-[44px] cursor-pointer rounded-pill px-[18px] text-[15px] font-semibold"
            style={{
              background: active ? "var(--accent)" : "transparent",
              color: active ? "var(--background)" : "var(--muted-2)",
              border: `1px solid ${active ? "var(--accent)" : "rgba(255,255,255,0.14)"}`,
            }}
          >
            {t(tb.labelKey)}
          </button>
        );
      })}
    </div>
  );
}
