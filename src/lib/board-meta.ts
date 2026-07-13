import type { TodoDtoCat, TodoDtoPrio, TodoDtoStatus } from "@/api/generated/model";

// Colours + backgrounds taken 1:1 from the design's catMeta / prioMeta / statusDefs.
export const CAT_META: Record<TodoDtoCat, { color: string; bg: string }> = {
  tech: { color: "var(--tech)", bg: "rgba(122,162,247,0.14)" },
  freizeit: { color: "var(--success)", bg: "rgba(63,207,142,0.14)" },
};

export const PRIO_META: Record<TodoDtoPrio, { color: string }> = {
  hoch: { color: "var(--danger)" },
  mittel: { color: "var(--warn)" },
  niedrig: { color: "#6b7684" },
};

export const STATUS_ORDER: TodoDtoStatus[] = ["todo", "doing", "done"];

export const STATUS_META: Record<TodoDtoStatus, { color: string }> = {
  todo: { color: "var(--foreground)" },
  doing: { color: "var(--tech)" },
  done: { color: "var(--success)" },
};

/** Interval choices for creating vs. editing a chore (the design offers 36h only on edit). */
export const ADD_INTERVALS = [12, 24, 48, 72, 120, 168];
export const EDIT_INTERVALS = [12, 24, 36, 48, 72, 120, 168];

export const catLabelKey = (cat: TodoDtoCat) => `cat.${cat}` as const;
export const prioLabelKey = (prio: TodoDtoPrio) => `prio.${prio}` as const;
