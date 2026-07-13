import type { TokenUsageDto } from "@/api/generated/model";
import { useDataLoading } from "@/hooks/useDataLoading";
import { STATUS_ORDER } from "@/lib/board-meta";
import { fmtAgo, fmtCost, fmtDuration, fmtReset } from "@/lib/format";
import { useAppSelector } from "@/store/hooks";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const POLL_MS = 3000;

const pctColor = (p: number) =>
  p >= 85 ? "var(--danger)" : p >= 65 ? "var(--warn)" : "var(--success)";

export function useTvDashboardLogic() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "en" ? "en-US" : "de-DE";
  const board = useAppSelector((s) => s.board.data);
  const { loadBoard } = useDataLoading();

  const [now, setNow] = useState(() => Date.now());
  const [vw, setVw] = useState(() => window.innerWidth);
  const [vh, setVh] = useState(() => window.innerHeight);

  useEffect(() => {
    void loadBoard();
    const tick = setInterval(() => setNow(Date.now()), 1000);
    const poll = setInterval(() => void loadBoard(), POLL_MS);
    const onResize = () => {
      setVw(window.innerWidth);
      setVh(window.innerHeight);
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearInterval(tick);
      clearInterval(poll);
      window.removeEventListener("resize", onResize);
    };
  }, [loadBoard]);

  return useMemo(() => {
    const nowDate = new Date(now);
    const clock = nowDate.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
    const dateStr = nowDate.toLocaleDateString(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

    const todos = board?.todos ?? [];
    const cols = STATUS_ORDER.map((status) => ({
      status,
      items: todos.filter((t2) => t2.status === status),
    }));
    const doneCount = cols[2].items.length;
    const totalCount = todos.length;

    const person = (name: string, color: string, tk: TokenUsageDto | undefined) => {
      const hist = tk?.history ?? [];
      return {
        name,
        color,
        cost: tk ? fmtCost(tk.costEur ?? 0) : "",
        fiveHPct: tk?.fiveHPct ?? 0,
        fiveHColor: pctColor(tk?.fiveHPct ?? 0),
        resetStr: tk ? fmtReset(tk.fiveHResetMin ?? 0) : "",
        weekPct: tk?.weekPct ?? 0,
        weekColor: pctColor(tk?.weekPct ?? 0),
        history: hist,
      };
    };
    const persons = [
      {
        ...person("JANNE", "var(--janne)", board?.tokens?.janne),
        working: board?.working?.janne || t("tv.empty"),
      },
      {
        ...person("SIMON", "var(--simon)", board?.tokens?.simon),
        working: board?.working?.simon || t("tv.empty"),
      },
    ];

    const chores = (board?.chores ?? []).map((c) => ({
      title: c.title,
      overdue: !!c.overdue,
      color: c.overdue ? "var(--danger)" : "var(--success)",
      status: c.overdue ? t("routine.status.overdue") : t("routine.status.ok"),
      line: `${fmtAgo(c.hoursSinceLastDone ?? 0, t)} · ${t("routine.duePrefix")} ${fmtDuration(c.intervalHours ?? 0, t)}`,
    }));
    const anyOverdue = chores.some((c) => c.overdue);

    const einkaufOpen = (board?.shopping ?? []).filter((e) => !e.done);
    const einkaufItems = einkaufOpen.slice(0, 6);
    const einkaufMore = Math.max(0, einkaufOpen.length - 6);

    const lol = board?.lol ?? { todayWins: 0, todayLosses: 0, matches: [] };
    const allMatches = lol.matches ?? [];
    const whoColor = (who: string | undefined) =>
      who === "Janne" ? "var(--janne)" : "var(--simon)";
    // A match both residents played arrives with two players → render it as one game together,
    // with a combined KDA. Exactly the design's lol.matches[] mapping. Up to 15 recent games are
    // rendered; the panel scrolls when they overflow.
    const lolMatches = allMatches.slice(0, 15).map((m, i) => {
      const players = m.players ?? [];
      const duo = players.length > 1;
      const agoH = m.playedAt
        ? Math.max(0, Math.floor((now - Date.parse(m.playedAt)) / 3600e3))
        : 0;
      const combined = players.reduce(
        (acc, p) => {
          const [k = 0, d = 0, a = 0] = (p.kda ?? "").split("/").map(Number);
          return [acc[0] + k, acc[1] + d, acc[2] + a];
        },
        [0, 0, 0],
      );
      return {
        key: `${m.playedAt}-${i}`,
        win: !!m.win,
        today: m.today !== false,
        duo,
        title: players.map((p) => p.champ).join(" + "),
        who: players.map((p) => p.who).join(" & "),
        mode: m.mode ?? "",
        ago: m.playedAt ? fmtAgo(agoH, t) : "",
        kda: duo ? combined.join("/") : (players[0]?.kda ?? ""),
        avatars: players.map((p, idx) => ({
          init: (p.champ ?? "").slice(0, 2).toUpperCase(),
          ring: whoColor(p.who),
          overlap: idx > 0,
        })),
      };
    });
    // Recent five results as oldest→newest dots, exactly as the design's header strip.
    const lolDots = allMatches
      .slice(0, 5)
      .map((m) => !!m.win)
      .reverse();
    const lolGames = (lol.todayWins ?? 0) + (lol.todayLosses ?? 0);
    const lolWr = lolGames ? Math.round(((lol.todayWins ?? 0) / lolGames) * 100) : 0;

    const stageScale = Math.min(vw / 1920, vh / 1080);
    return {
      clock,
      dateStr,
      cols,
      persons,
      chores,
      anyOverdue,
      einkaufItems,
      einkaufCount: einkaufOpen.length,
      einkaufMore,
      lolMatches,
      lolDots,
      lolWr,
      lolWrColor: lolWr >= 50 ? "var(--success)" : "var(--danger)",
      doneCount,
      totalCount,
      donePct: totalCount ? Math.round((doneCount / totalCount) * 100) : 0,
      stageScale,
      stageLeft: Math.max(0, (vw - 1920 * stageScale) / 2),
      stageTop: Math.max(0, (vh - 1080 * stageScale) / 2),
    };
  }, [board, now, vw, vh, locale, t]);
}

export type TvLogic = ReturnType<typeof useTvDashboardLogic>;
