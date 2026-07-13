import type { TodoDtoCat, TodoDtoPrio } from "@/api/generated/model";
import { CAT_META, PRIO_META, STATUS_META, STATUS_ORDER } from "@/lib/board-meta";
import { useTranslation } from "react-i18next";
import type { KonsoleLogic } from "../useKonsoleLogic";

const inputCls =
  "min-h-[44px] box-border rounded-[10px] border border-white/[0.12] bg-panel-2 px-[14px] text-foreground text-base w-full";
const selectCls =
  "min-h-[44px] flex-1 rounded-[10px] border border-white/[0.12] bg-panel-2 px-[10px] text-[15px] text-foreground";

export function AufgabenTab({ logic }: { logic: KonsoleLogic }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-[14px]">
      {/* New-task form */}
      <div className="flex flex-col gap-[10px] rounded-card border border-white/[0.07] bg-panel p-[14px]">
        <input
          data-testid="new-todo-title"
          value={logic.newTitle}
          onChange={(e) => logic.setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && logic.addTodo()}
          placeholder={t("aufgaben.newPlaceholder")}
          className={inputCls}
        />
        <div className="flex flex-wrap gap-2">
          <select
            value={logic.newCat}
            onChange={(e) => logic.setNewCat(e.target.value as TodoDtoCat)}
            className={selectCls}
          >
            <option value="tech">{t("aufgaben.catTech")}</option>
            <option value="freizeit">{t("aufgaben.catFreizeit")}</option>
          </select>
          <select
            value={logic.newPrio}
            onChange={(e) => logic.setNewPrio(e.target.value as TodoDtoPrio)}
            className={selectCls}
          >
            <option value="hoch">{t("aufgaben.prioHoch")}</option>
            <option value="mittel">{t("aufgaben.prioMittel")}</option>
            <option value="niedrig">{t("aufgaben.prioNiedrig")}</option>
          </select>
          <button
            type="button"
            data-testid="add-todo"
            onClick={logic.addTodo}
            className="min-h-[44px] cursor-pointer rounded-[10px] px-5 text-[15px] font-semibold"
            style={{ background: "var(--accent)", color: "var(--background)", border: "none" }}
          >
            {t("aufgaben.add")}
          </button>
        </div>
      </div>

      {/* Kanban columns */}
      <div className="grid grid-cols-[repeat(3,minmax(235px,1fr))] items-start gap-[10px] overflow-x-auto pb-1">
        {logic.groups.map((g) => (
          <div
            key={g.status}
            className="flex min-h-[140px] flex-col gap-2 rounded-[12px] border border-white/[0.06] bg-[#10151b] p-[10px]"
          >
            <div className="flex items-baseline gap-2 px-1 py-[2px]">
              <span className="text-sm font-bold" style={{ color: STATUS_META[g.status].color }}>
                {t(`cols.${g.status}`)}
              </span>
              <span className="font-mono text-xs text-muted">{g.items.length}</span>
            </div>
            {g.items.map((it) => {
              const editing = logic.editingId === it.id;
              const cat = CAT_META[it.cat ?? "tech"];
              const prio = PRIO_META[it.prio ?? "mittel"];
              const idx = STATUS_ORDER.indexOf(it.status ?? "todo");
              return (
                <div
                  key={it.id}
                  data-testid="todo-card"
                  className="flex flex-col gap-2 rounded-item border border-white/[0.06] bg-panel-2 px-3 py-[10px]"
                >
                  {editing ? (
                    <div className="flex flex-col gap-2">
                      <input
                        value={logic.editText}
                        onChange={(e) => logic.setEditText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && logic.saveEdit()}
                        className="min-h-[44px] w-full box-border rounded-[10px] border px-3 text-[15px] text-foreground"
                        style={{ background: "#10151b", borderColor: "rgba(91,200,245,0.5)" }}
                      />
                      <button
                        type="button"
                        onClick={logic.saveEdit}
                        className="min-h-[44px] cursor-pointer rounded-[10px] text-sm font-semibold"
                        style={{
                          background: "var(--success)",
                          color: "var(--background)",
                          border: "none",
                        }}
                      >
                        {t("aufgaben.save")}
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-[6px]">
                      <span
                        className="text-[15px] font-medium leading-[1.3]"
                        style={{
                          textDecoration: it.status === "done" ? "line-through" : "none",
                          opacity: it.status === "done" ? 0.55 : 1,
                        }}
                      >
                        {it.title}
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="rounded-[5px] px-[7px] py-[2px] font-mono text-[10px] tracking-[0.08em]"
                          style={{ background: cat.bg, color: cat.color }}
                        >
                          {t(`cat.${it.cat}`)}
                        </span>
                        <span
                          className="font-mono text-[10px] tracking-[0.06em]"
                          style={{ color: prio.color }}
                        >
                          {t("prio.prefix")} {t(`prio.${it.prio}`)}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-[6px]">
                    <IconBtn
                      onClick={() => logic.moveTodo(it, -1)}
                      title={t("aufgaben.back")}
                      color={idx > 0 ? "var(--foreground)" : "#3a4450"}
                    >
                      ←
                    </IconBtn>
                    <IconBtn
                      onClick={() => logic.moveTodo(it, 1)}
                      title={t("aufgaben.forward")}
                      color={idx < 2 ? "var(--foreground)" : "#3a4450"}
                    >
                      →
                    </IconBtn>
                    <IconBtn
                      onClick={() => logic.startEdit(it)}
                      title={t("aufgaben.rename")}
                      color="var(--muted-2)"
                      className="ml-auto"
                    >
                      ✎
                    </IconBtn>
                    <IconBtn
                      onClick={() => it.id && logic.delTodo(it.id)}
                      title={t("aufgaben.delete")}
                      color="var(--danger)"
                      borderColor="rgba(241,106,95,0.35)"
                    >
                      ✕
                    </IconBtn>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  title,
  color,
  className,
  borderColor = "rgba(255,255,255,0.12)",
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  color: string;
  className?: string;
  borderColor?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`min-h-[44px] min-w-[44px] cursor-pointer rounded-[10px] bg-transparent text-base ${className ?? ""}`}
      style={{ border: `1px solid ${borderColor}`, color }}
    >
      {children}
    </button>
  );
}
