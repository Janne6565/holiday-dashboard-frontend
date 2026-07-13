import { useTranslation } from "react-i18next";
import type { KonsoleLogic } from "../useKonsoleLogic";

export function EinkaufTab({ logic }: { logic: KonsoleLogic }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-[10px]">
      <div className="flex gap-2">
        <input
          data-testid="new-shopping"
          value={logic.newItem}
          onChange={(e) => logic.setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && logic.addShopping()}
          placeholder={t("einkauf.placeholder")}
          className="min-h-[44px] box-border flex-1 rounded-[10px] border border-white/[0.12] bg-panel-2 px-[14px] text-base text-foreground"
        />
        <button
          type="button"
          data-testid="add-shopping"
          onClick={logic.addShopping}
          className="min-h-[44px] cursor-pointer rounded-[10px] px-[18px] text-[15px] font-semibold"
          style={{ background: "var(--warn)", color: "var(--background)", border: "none" }}
        >
          {t("einkauf.add")}
        </button>
      </div>

      {logic.shopping.map((e) => (
        <button
          type="button"
          key={e.id}
          data-testid="shopping-item"
          onClick={() => e.id && logic.toggleShopping(e.id)}
          className="flex min-h-[52px] items-center gap-3 rounded-[12px] border border-white/[0.07] bg-panel px-[14px] text-left"
        >
          <span
            className="flex h-6 w-6 flex-none items-center justify-center rounded-pill text-sm font-bold"
            style={{
              border: `2px solid ${e.done ? "var(--success)" : "rgba(255,255,255,0.3)"}`,
              background: e.done ? "var(--success)" : "transparent",
              color: "var(--background)",
            }}
          >
            {e.done ? "✓" : ""}
          </span>
          <span
            className="text-base"
            style={{
              textDecoration: e.done ? "line-through" : "none",
              opacity: e.done ? 0.5 : 1,
            }}
          >
            {e.text}
          </span>
        </button>
      ))}

      {logic.hasDoneShopping && (
        <button
          type="button"
          onClick={logic.clearDone}
          className="min-h-[44px] cursor-pointer rounded-[10px] border border-white/[0.12] bg-transparent text-sm text-muted-2"
        >
          {t("einkauf.clearDone")}
        </button>
      )}
    </div>
  );
}
