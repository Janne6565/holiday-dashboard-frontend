import type { ChoreDto } from "@/api/generated/model";
import { fmtAgo, fmtDuration } from "@/lib/format";
import { useTranslation } from "react-i18next";

interface Props {
  chores: ChoreDto[];
  onDone: (id: string) => void;
}

/** Red banner(s) for overdue chores, shown above the tabs — as in the design. */
export function OverdueBanner({ chores, onDone }: Props) {
  const { t } = useTranslation();
  return (
    <>
      {chores.map((c) => (
        <div
          key={c.id}
          className="flex flex-wrap items-center gap-3 rounded-[12px] px-[14px] py-3"
          style={{ background: "rgba(241,106,95,0.12)", border: "1px solid rgba(241,106,95,0.5)" }}
        >
          <span className="text-sm font-semibold text-danger">
            {c.title} {t("routine.overdueBanner")}
          </span>
          <span className="text-[13px] text-muted-2">
            {t("routine.lastPrefix")} {fmtAgo(c.hoursSinceLastDone ?? 0, t)} ·{" "}
            {t("routine.duePrefix")} {fmtDuration(c.intervalHours ?? 0, t)}
          </span>
          <button
            type="button"
            onClick={() => c.id && onDone(c.id)}
            className="ml-auto min-h-[44px] flex-none cursor-pointer rounded-[10px] px-4 text-sm font-semibold"
            style={{ background: "var(--success)", color: "var(--background)", border: "none" }}
          >
            {t("routine.doneShort")}
          </button>
        </div>
      ))}
    </>
  );
}
