import { ProgressBar } from "@/components/ui/progress-bar";
import { CAT_META, PRIO_META } from "@/lib/board-meta";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { LolPanel } from "./components/lol-panel";
import { PersonCard } from "./components/person-card";
import { useTvDashboardLogic } from "./useTvDashboardLogic";

export function TvDashboardPage() {
  const { t } = useTranslation();
  const logic = useTvDashboardLogic();

  return (
    <div className="no-scrollbar relative h-screen w-screen overflow-hidden">
      <div
        className="absolute box-border flex flex-col gap-[18px] px-8 py-[26px]"
        style={{
          left: logic.stageLeft,
          top: logic.stageTop,
          width: 1920,
          height: 1080,
          transform: `scale(${logic.stageScale})`,
          transformOrigin: "top left",
        }}
      >
        {/* Header */}
        <div className="flex flex-none items-center gap-8">
          <div className="flex flex-col gap-[2px]">
            <div className="text-[26px] font-bold tracking-[0.02em]">{t("app.hq")}</div>
            <div className="font-mono text-xs tracking-[0.08em] text-muted">{t("tv.subtitle")}</div>
          </div>
          <div className="ml-auto flex min-w-[220px] flex-col gap-[6px]">
            <div className="flex justify-between font-mono text-xs text-muted">
              <span>{t("tv.progress")}</span>
              <span className="text-foreground">
                {t("tv.doneOf", { done: logic.doneCount, total: logic.totalCount })}
              </span>
            </div>
            <ProgressBar pct={logic.donePct} color="var(--success)" className="h-[6px]" />
          </div>
          <div className="flex flex-col items-end gap-[2px]">
            <div className="font-mono text-[30px] font-semibold leading-none">{logic.clock}</div>
            <div className="text-[13px] text-muted">
              {logic.dateStr} · <Link to="/">{t("app.konsole")}</Link>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid min-h-0 flex-1 grid-cols-[1.05fr_0.95fr] gap-[18px]">
          {/* Tasks */}
          <div className="flex min-h-0 flex-col gap-[14px] rounded-card border border-white/[0.07] bg-panel px-5 py-[18px]">
            <div className="font-mono text-xs tracking-[0.1em] text-muted">{t("tv.tasks")}</div>
            <div className="grid min-h-0 flex-1 grid-cols-3 gap-[14px]">
              {logic.cols.map((col) => (
                <div key={col.status} className="flex min-h-0 flex-col gap-[10px]">
                  <div className="flex items-baseline justify-between border-b border-white/[0.08] pb-2">
                    <span
                      className="text-sm font-semibold"
                      style={{
                        color:
                          col.status === "doing"
                            ? "var(--tech)"
                            : col.status === "done"
                              ? "var(--success)"
                              : "var(--foreground)",
                      }}
                    >
                      {t(`cols.${col.status}`)}
                    </span>
                    <span className="font-mono text-xs text-muted">{col.items.length}</span>
                  </div>
                  <div className="flex flex-col gap-2 overflow-hidden">
                    {col.items.map((it) => {
                      const cat = CAT_META[it.cat ?? "tech"];
                      const prio = PRIO_META[it.prio ?? "mittel"];
                      return (
                        <div
                          key={it.id}
                          className="flex flex-col gap-[7px] rounded-item border border-white/[0.05] bg-panel-2 px-3 py-[10px]"
                          style={{ opacity: it.status === "done" ? 0.5 : 1 }}
                        >
                          <div
                            className="text-[15px] font-medium leading-[1.25]"
                            style={{
                              textDecoration: it.status === "done" ? "line-through" : "none",
                            }}
                          >
                            {it.title}
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className="rounded-[5px] px-[7px] py-[2px] font-mono text-[10px] tracking-[0.08em]"
                              style={{ background: cat.bg, color: cat.color }}
                            >
                              {t(`cat.${it.cat}`)}
                            </span>
                            <span
                              className="h-2 w-2 rounded-pill"
                              style={{ background: prio.color }}
                            />
                            <span className="font-mono text-[10px] tracking-[0.06em] text-muted">
                              {t(`prio.${it.prio}`)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="flex min-h-0 flex-col gap-[18px]">
            <div className="grid flex-none grid-cols-2 gap-[18px]">
              {logic.persons.map((p) => (
                <PersonCard key={p.name} p={p} />
              ))}
            </div>

            <div className="grid flex-none grid-cols-2 gap-[18px]">
              {/* Routine */}
              <div
                className="flex flex-col gap-[10px] rounded-card px-[18px] py-4"
                style={{
                  background: "var(--panel)",
                  border: `1px solid ${logic.anyOverdue ? "rgba(241,106,95,0.6)" : "rgba(255,255,255,0.07)"}`,
                  animation: logic.anyOverdue ? "pulseRed 2s ease-in-out infinite" : "none",
                }}
              >
                <div className="font-mono text-xs tracking-[0.1em] text-muted">
                  {t("tv.routine")}
                </div>
                <div className="flex flex-col gap-[9px] overflow-hidden">
                  {logic.chores.map((c) => (
                    <div key={c.title} className="flex flex-col gap-[2px]">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 flex-none rounded-pill"
                          style={{ background: c.color }}
                        />
                        <span className="text-base font-semibold">{c.title}</span>
                        <span
                          className="ml-auto font-mono text-[11px] font-semibold"
                          style={{ color: c.color }}
                        >
                          {c.status}
                        </span>
                      </div>
                      <div className="pl-4 text-[12.5px] text-muted">{c.line}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shopping */}
              <div className="flex flex-col gap-[9px] rounded-card border border-white/[0.07] bg-panel px-[18px] py-4">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-xs tracking-[0.1em] text-muted">
                    {t("tv.shopping")}
                  </span>
                  <span className="font-mono text-xs text-warn">
                    {t("tv.open", { count: logic.einkaufCount })}
                  </span>
                </div>
                <div className="flex flex-col gap-[6px] overflow-hidden">
                  {logic.einkaufItems.map((e) => (
                    <div key={e.id} className="flex items-center gap-[9px] text-[15px]">
                      <span className="h-[6px] w-[6px] flex-none rounded-pill bg-warn" />
                      <span>{e.text}</span>
                    </div>
                  ))}
                  {logic.einkaufMore > 0 && (
                    <div className="font-mono text-[11px] text-muted">
                      {t("tv.more", { count: logic.einkaufMore })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <LolPanel logic={logic} />
          </div>
        </div>
      </div>
    </div>
  );
}
