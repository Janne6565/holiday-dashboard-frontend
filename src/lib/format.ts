import type { TFunction } from "i18next";

/** "3 Tage" / "12 Std" — interval or elapsed duration. */
export function fmtDuration(hours: number, t: TFunction): string {
  return hours >= 48
    ? `${Math.round(hours / 24)} ${t("time.days")}`
    : `${hours} ${t("time.hours")}`;
}

/** "vor 2 Tagen" / "vor 12 Std". */
export function fmtAgo(hours: number, t: TFunction): string {
  return hours >= 48
    ? t("time.agoDays", { n: Math.floor(hours / 24) })
    : t("time.agoHours", { n: hours });
}

/** "1 h 24 min" / "37 min" — countdown to the next 5h-limit reset. */
export function fmtReset(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h} h ${m} min` : `${m} min`;
}

/** "18,40 €" — German-formatted euro amount. */
export function fmtCost(v: number): string {
  return `${v.toFixed(2).replace(".", ",")} €`;
}
