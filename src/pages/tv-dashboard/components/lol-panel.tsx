import { useTranslation } from "react-i18next";
import type { TvLogic } from "../useTvDashboardLogic";

/** Live League of Legends panel: recent-result dots, today's win-rate, and the match feed. */
export function LolPanel({ logic }: { logic: TvLogic }) {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-[11px] rounded-card border border-white/[0.07] bg-panel px-[18px] py-4">
      <div className="flex items-center gap-[14px]">
        <span className="font-mono text-xs tracking-[0.1em] text-muted">{t("tv.lol")}</span>
        <div className="ml-auto flex gap-1">
          {logic.lolDots.map((win, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed recent-results strip
              key={i}
              className="flex h-[14px] w-[14px] items-center justify-center rounded-[4px] font-mono text-[9px] font-bold"
              style={{
                background: win ? "rgba(63,207,142,0.2)" : "rgba(241,106,95,0.2)",
                color: win ? "var(--success)" : "var(--danger)",
              }}
            >
              {win ? t("tv.win") : t("tv.loss")}
            </span>
          ))}
        </div>
        <span className="font-mono text-[13px]" style={{ color: logic.lolWrColor }}>
          {t("tv.wr", { pct: logic.lolWr })}
        </span>
      </div>

      <div className="flex flex-col gap-2 overflow-hidden">
        {logic.lolMatches.map((m) => {
          const res = m.win ? "var(--success)" : "var(--danger)";
          return (
            <div
              key={m.key}
              className="flex items-center gap-3 rounded-[8px]"
              style={{
                background: m.win ? "rgba(63,207,142,0.06)" : "rgba(241,106,95,0.06)",
                borderLeft: `3px solid ${res}`,
                padding: "8px 12px 8px 11px",
              }}
            >
              <div className="flex flex-none">
                {m.avatars.map((a, i) => (
                  <span
                    // biome-ignore lint/suspicious/noArrayIndexKey: at most two overlapping avatars
                    key={i}
                    className="flex h-[34px] w-[34px] items-center justify-center rounded-pill font-mono text-xs font-bold"
                    style={{
                      background: "#10151b",
                      border: `2px solid ${a.ring}`,
                      color: a.ring,
                      marginLeft: a.overlap ? -10 : 0,
                    }}
                  >
                    {a.init}
                  </span>
                ))}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
                <div className="flex items-center gap-2">
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold">
                    {m.title}
                  </span>
                  {m.duo && (
                    <span
                      className="flex-none rounded-[5px] px-[6px] py-[2px] font-mono text-[9px] font-bold tracking-[0.08em]"
                      style={{ background: "rgba(232,196,104,0.16)", color: "var(--warn)" }}
                    >
                      {t("tv.duo")}
                    </span>
                  )}
                </div>
                <div className="text-[11.5px] text-muted">
                  {m.who} · {m.mode}
                  {m.ago ? ` · ${m.ago}` : ""}
                </div>
              </div>
              <div className="flex flex-none flex-col items-end gap-[2px]">
                <span className="font-mono text-[13px] font-semibold">{m.kda}</span>
                <span className="font-mono text-[11px] font-semibold" style={{ color: res }}>
                  {m.win ? t("tv.matchWin") : t("tv.matchLoss")}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
