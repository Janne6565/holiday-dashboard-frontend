import { MiniBars } from "@/components/ui/mini-bars";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useTranslation } from "react-i18next";
import type { TvLogic } from "../useTvDashboardLogic";

type PersonVm = TvLogic["persons"][number];

/** One person's Claude token widget: 5h-limit, weekly %, cost, and 7-day sparkline. */
export function PersonCard({ p }: { p: PersonVm }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3 rounded-card border border-white/[0.07] bg-panel px-[18px] py-4">
      <div className="flex items-center gap-[9px]">
        <span className="h-[10px] w-[10px] rounded-pill" style={{ background: p.color }} />
        <span className="text-lg font-bold tracking-[0.02em]">{p.name}</span>
        <span className="ml-auto font-mono text-[13px] text-muted">{p.cost}</span>
      </div>

      <div className="flex flex-col gap-[3px]">
        <div className="font-mono text-[10px] tracking-[0.1em] text-muted">{t("tv.worksOn")}</div>
        <div
          className="overflow-hidden text-ellipsis whitespace-nowrap text-[15px] font-medium"
          style={{ color: p.color }}
        >
          {p.working}
        </div>
      </div>

      <Meter
        label={t("tv.fiveH")}
        right={`${p.fiveHPct} % · ${t("tv.resetIn", { time: p.resetStr })}`}
        pct={p.fiveHPct}
        color={p.fiveHColor}
      />
      <Meter label={t("tv.week")} right={`${p.weekPct} %`} pct={p.weekPct} color={p.weekColor} />

      <div className="flex flex-col gap-[5px]">
        <MiniBars values={p.history} color={p.color} />
        <div className="font-mono text-[10px] tracking-[0.08em] text-faint">{t("tv.tokens7d")}</div>
      </div>
    </div>
  );
}

function Meter({
  label,
  right,
  pct,
  color,
}: {
  label: string;
  right: string;
  pct: number;
  color: string;
}) {
  return (
    <div className="flex flex-col gap-[5px]">
      <div className="flex justify-between font-mono text-[11px] text-muted">
        <span>{label}</span>
        <span style={{ color }}>{right}</span>
      </div>
      <ProgressBar pct={pct} color={color} />
    </div>
  );
}
