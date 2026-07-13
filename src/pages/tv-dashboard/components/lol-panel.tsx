import { fmtAgo } from "@/lib/format";
import { useTranslation } from "react-i18next";
import type { TvLogic } from "../useTvDashboardLogic";

const whoColor = (who: string | undefined) => (who === "Janne" ? "var(--janne)" : "var(--simon)");

/** Live League of Legends panel: today's W/L and the recent-match grid. */
export function LolPanel({ logic }: { logic: TvLogic }) {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-[10px] rounded-card border border-white/[0.07] bg-panel px-[18px] py-4">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-xs tracking-[0.1em] text-muted">{t("tv.lol")}</span>
        <span className="font-mono text-[13px]">
          {t("tv.today")}{" "}
          <span className="text-success">
            {logic.lolWins} {t("tv.win")}
          </span>{" "}
          ·{" "}
          <span className="text-danger">
            {logic.lolLosses} {t("tv.loss")}
          </span>
        </span>
      </div>
      <div className="flex flex-col gap-[7px] overflow-hidden">
        {logic.lolMatches.map((m) => {
          const win = !!m.win;
          return (
            <div
              key={`${m.champ}-${m.playedAt}-${m.who}`}
              className="grid grid-cols-[30px_1.4fr_1fr_0.9fr_0.8fr] items-center gap-[10px] rounded-[8px] bg-panel-2 px-3 py-[7px]"
            >
              <span
                className="rounded-[5px] py-[2px] text-center font-mono text-xs font-semibold"
                style={{
                  background: win ? "rgba(63,207,142,0.15)" : "rgba(241,106,95,0.15)",
                  color: win ? "var(--success)" : "var(--danger)",
                }}
              >
                {win ? t("tv.win") : t("tv.loss")}
              </span>
              <span className="text-sm font-semibold">
                {m.champ}{" "}
                <span className="font-normal" style={{ color: whoColor(m.who) }}>
                  · {m.who}
                </span>
              </span>
              <span className="text-xs text-muted">{m.mode}</span>
              <span className="font-mono text-xs">{m.kda}</span>
              <span className="text-right text-xs text-muted">
                {m.playedAt ? fmtAgo(hoursAgo(m.playedAt), t) : ""}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function hoursAgo(iso: string): number {
  return Math.max(0, Math.floor((Date.now() - Date.parse(iso)) / 3600e3));
}
