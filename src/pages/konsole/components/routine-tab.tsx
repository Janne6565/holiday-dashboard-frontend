import { ADD_INTERVALS, EDIT_INTERVALS } from "@/lib/board-meta";
import { fmtAgo, fmtDuration } from "@/lib/format";
import { useTranslation } from "react-i18next";
import type { KonsoleLogic } from "../useKonsoleLogic";

const selectCls =
  "min-h-[44px] rounded-[10px] border border-white/[0.12] bg-panel-2 px-[10px] text-[15px] text-foreground";

export function RoutineTab({ logic }: { logic: KonsoleLogic }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-[14px]">
      {/* New chore form */}
      <div className="flex flex-col gap-[10px] rounded-card border border-white/[0.07] bg-panel p-[14px]">
        <div className="text-[15px] font-bold">{t("routine.newTitle")}</div>
        <input
          data-testid="new-chore"
          value={logic.newChore}
          onChange={(e) => logic.setNewChore(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && logic.addChore()}
          placeholder={t("routine.placeholder")}
          className="min-h-[44px] box-border rounded-[10px] border border-white/[0.12] bg-panel-2 px-[14px] text-base text-foreground"
        />
        <div className="flex flex-wrap gap-2">
          <select
            value={logic.newChoreInt}
            onChange={(e) => logic.setNewChoreInt(e.target.value)}
            className={`${selectCls} flex-1`}
          >
            {ADD_INTERVALS.map((h) => (
              <option key={h} value={String(h)}>
                {t(`intervals.${h}`)}
              </option>
            ))}
          </select>
          <button
            type="button"
            data-testid="add-chore"
            onClick={logic.addChore}
            className="min-h-[44px] cursor-pointer rounded-[10px] px-5 text-[15px] font-semibold"
            style={{ background: "var(--accent)", color: "var(--background)", border: "none" }}
          >
            {t("routine.add")}
          </button>
        </div>
      </div>

      {logic.chores.map((c) => {
        const color = c.overdue ? "var(--danger)" : "var(--success)";
        return (
          <div
            key={c.id}
            className="flex flex-col gap-[10px] rounded-card bg-panel p-4"
            style={{
              border: `1px solid ${c.overdue ? "rgba(241,106,95,0.5)" : "rgba(255,255,255,0.07)"}`,
            }}
          >
            <div className="flex items-center gap-[10px]">
              <span className="text-[17px] font-bold">{c.title}</span>
              <span className="ml-auto font-mono text-xs font-semibold" style={{ color }}>
                {c.overdue ? t("routine.status.overdue") : t("routine.status.ok")}
              </span>
            </div>
            <div className="text-sm text-muted-2">
              {t("routine.lastPrefix")} {fmtAgo(c.hoursSinceLastDone ?? 0, t)} ·{" "}
              {t("routine.duePrefix")} {fmtDuration(c.intervalHours ?? 0, t)}
            </div>
            <button
              type="button"
              data-testid="chore-done"
              onClick={() => c.id && logic.markChoreDone(c.id)}
              className="min-h-[52px] cursor-pointer rounded-[12px] text-base font-bold"
              style={{ background: "var(--success)", color: "var(--background)", border: "none" }}
            >
              {t("routine.doneNow")}
            </button>
            <div className="flex flex-wrap items-center gap-[10px]">
              <span className="text-sm text-muted-2">{t("routine.due")}</span>
              <select
                value={String(c.intervalHours)}
                onChange={(e) => c.id && logic.setChoreInterval(c.id, Number(e.target.value))}
                className={selectCls}
              >
                {EDIT_INTERVALS.map((h) => (
                  <option key={h} value={String(h)}>
                    {t(`intervals.${h}`)}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => c.id && logic.delChore(c.id)}
                className="ml-auto min-h-[44px] cursor-pointer rounded-[10px] bg-transparent px-[13px] text-[13px] text-danger"
                style={{ border: "1px solid rgba(241,106,95,0.35)" }}
              >
                {t("routine.delete")}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
