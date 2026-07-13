import { KonsoleAuthProvider, useKonsoleAuth } from "@/lib/konsole-auth-context";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { AufgabenTab } from "./components/aufgaben-tab";
import { EinkaufTab } from "./components/einkauf-tab";
import { KonsoleLock } from "./components/konsole-lock";
import { OverdueBanner } from "./components/overdue-banner";
import { RoutineTab } from "./components/routine-tab";
import { StatusTab } from "./components/status-tab";
import { TabsBar } from "./components/tabs-bar";
import { useKonsoleLogic } from "./useKonsoleLogic";

export function KonsolePage() {
  return (
    <KonsoleAuthProvider>
      <KonsoleContent />
    </KonsoleAuthProvider>
  );
}

function KonsoleContent() {
  const { t } = useTranslation();
  const { unlocked, lock } = useKonsoleAuth();
  const logic = useKonsoleLogic();

  if (!unlocked) {
    return <KonsoleLock />;
  }

  return (
    <div className="mx-auto flex max-w-[760px] flex-col gap-4 px-4 pb-[90px] pt-5">
      <div className="flex items-baseline gap-3">
        <div className="text-2xl font-bold">{t("app.title")}</div>
        <div className="font-mono text-[11px] tracking-[0.08em] text-muted">{t("app.hq")}</div>
        <button
          type="button"
          data-testid="lock-button"
          onClick={lock}
          className="ml-auto cursor-pointer text-sm text-muted"
        >
          🔒 {t("lock.lock")}
        </button>
        <Link to="/tv" className="text-sm" data-testid="tv-link">
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
