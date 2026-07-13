import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { AufgabenTab } from "./components/aufgaben-tab";
import { EinkaufTab } from "./components/einkauf-tab";
import { OverdueBanner } from "./components/overdue-banner";
import { RoutineTab } from "./components/routine-tab";
import { StatusTab } from "./components/status-tab";
import { TabsBar } from "./components/tabs-bar";
import { useKonsoleLogic } from "./useKonsoleLogic";

export function KonsolePage() {
  const { t } = useTranslation();
  const logic = useKonsoleLogic();

  return (
    <div className="mx-auto flex max-w-[760px] flex-col gap-4 px-4 pb-[90px] pt-5">
      <div className="flex items-baseline gap-3">
        <div className="text-2xl font-bold">{t("app.title")}</div>
        <div className="font-mono text-[11px] tracking-[0.08em] text-muted">{t("app.hq")}</div>
        <Link to="/tv" className="ml-auto text-sm" data-testid="tv-link">
          {t("app.tvView")}
        </Link>
      </div>

      <OverdueBanner chores={logic.overdueChores} onDone={logic.markChoreDone} />

      <TabsBar tab={logic.tab} setTab={logic.setTab} />

      {logic.tab === "aufgaben" && <AufgabenTab logic={logic} />}
      {logic.tab === "einkauf" && <EinkaufTab logic={logic} />}
      {logic.tab === "routine" && <RoutineTab logic={logic} />}
      {logic.tab === "status" && <StatusTab logic={logic} />}
    </div>
  );
}
