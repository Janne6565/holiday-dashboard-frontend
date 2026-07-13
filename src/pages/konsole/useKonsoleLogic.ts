import type {
  ChoreDto,
  ShoppingItemDto,
  TodoDto,
  TodoDtoCat,
  TodoDtoPrio,
  TodoDtoStatus,
} from "@/api/generated/model";
import { useDataInteractions } from "@/hooks/useDataInteractions";
import { useDataLoading } from "@/hooks/useDataLoading";
import { STATUS_ORDER } from "@/lib/board-meta";
import { useAppSelector } from "@/store/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";

export type KonsoleTab = "aufgaben" | "einkauf" | "routine" | "status";

const POLL_MS = 5000;

export function useKonsoleLogic() {
  const board = useAppSelector((s) => s.board.data);
  const { loadBoard } = useDataLoading();
  const actions = useDataInteractions();

  const [tab, setTab] = useState<KonsoleTab>("aufgaben");
  const [newTitle, setNewTitle] = useState("");
  const [newCat, setNewCat] = useState<TodoDtoCat>("tech");
  const [newPrio, setNewPrio] = useState<TodoDtoPrio>("mittel");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [newItem, setNewItem] = useState("");
  const [newChore, setNewChore] = useState("");
  const [newChoreInt, setNewChoreInt] = useState("24");

  // Reads via useDataLoading + a poll, so a phone edit shows on other devices.
  useEffect(() => {
    void loadBoard();
    const id = setInterval(() => void loadBoard(), POLL_MS);
    return () => clearInterval(id);
  }, [loadBoard]);

  const todos = useMemo(() => board?.todos ?? [], [board]);
  const chores = board?.chores ?? [];
  const shopping = board?.shopping ?? [];

  const groups = useMemo(
    () =>
      STATUS_ORDER.map((status) => ({
        status,
        items: todos.filter((t) => t.status === status),
      })),
    [todos],
  );

  const overdueChores = chores.filter((c) => c.overdue);
  const hasDoneShopping = shopping.some((i) => i.done);

  // --- task handlers ---
  const addTodo = useCallback(() => {
    const title = newTitle.trim();
    if (!title) return;
    void actions.addTodo({ title, cat: newCat, prio: newPrio });
    setNewTitle("");
  }, [actions, newTitle, newCat, newPrio]);

  const startEdit = useCallback((t: TodoDto) => {
    setEditingId(t.id ?? null);
    setEditText(t.title ?? "");
  }, []);

  const saveEdit = useCallback(() => {
    const txt = editText.trim();
    if (editingId && txt) void actions.updateTodo(editingId, { title: txt });
    setEditingId(null);
    setEditText("");
  }, [actions, editingId, editText]);

  const moveTodo = useCallback(
    (t: TodoDto, dir: -1 | 1) => {
      const i = STATUS_ORDER.indexOf(t.status as TodoDtoStatus);
      const next = i + dir;
      if (t.id && next >= 0 && next < STATUS_ORDER.length) {
        void actions.updateTodo(t.id, { status: STATUS_ORDER[next] });
      }
    },
    [actions],
  );

  // --- shopping handlers ---
  const addShopping = useCallback(() => {
    const txt = newItem.trim();
    if (!txt) return;
    void actions.addShoppingItem(txt);
    setNewItem("");
  }, [actions, newItem]);

  // --- chore handlers ---
  const addChore = useCallback(() => {
    const title = newChore.trim();
    if (!title) return;
    void actions.addChore(title, Number(newChoreInt));
    setNewChore("");
  }, [actions, newChore, newChoreInt]);

  return {
    board,
    tab,
    setTab,
    groups,
    chores,
    shopping,
    overdueChores,
    hasDoneShopping,
    // task form
    newTitle,
    setNewTitle,
    newCat,
    setNewCat,
    newPrio,
    setNewPrio,
    editingId,
    editText,
    setEditText,
    addTodo,
    startEdit,
    saveEdit,
    moveTodo,
    delTodo: (id: string) => void actions.deleteTodo(id),
    // shopping
    newItem,
    setNewItem,
    addShopping,
    toggleShopping: (id: string) => void actions.toggleShoppingItem(id),
    delShopping: (id: string) => void actions.deleteShoppingItem(id),
    clearDone: () => void actions.clearDoneShopping(),
    // chores
    newChore,
    setNewChore,
    newChoreInt,
    setNewChoreInt,
    addChore,
    markChoreDone: (id: string) => void actions.markChoreDone(id),
    setChoreInterval: (id: string, h: number) => void actions.updateChoreInterval(id, h),
    delChore: (id: string) => void actions.deleteChore(id),
    // status
    setWorking: actions.setWorking,
  };
}

export type KonsoleLogic = ReturnType<typeof useKonsoleLogic>;
export type { ChoreDto, ShoppingItemDto, TodoDto };
