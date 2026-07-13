import {
  addItem,
  clearDone,
  createChore,
  createTodo,
  deleteChore,
  deleteItem,
  deleteTodo,
  markDone,
  toggleItem,
  updateInterval,
  updateStatus,
  updateTodo,
} from "@/api/generated/holiday-dashboard-api";
import type { TodoCreationDto, TodoUpdateDto } from "@/api/generated/model";
import { useDataLoading } from "@/hooks/useDataLoading";
import { useCallback } from "react";

export type Person = "janne" | "simon";

/**
 * All mutations funnel through here. Every mutation refreshes the board after
 * completing, so the Konsole and the TV stay consistent from one source of truth.
 */
export function useDataInteractions() {
  const { loadBoard } = useDataLoading();

  const wrap = useCallback(
    async (fn: () => Promise<unknown>) => {
      await fn();
      await loadBoard();
    },
    [loadBoard],
  );

  return {
    // Todos
    addTodo: (dto: TodoCreationDto) => wrap(() => createTodo(dto)),
    updateTodo: (id: string, dto: TodoUpdateDto) => wrap(() => updateTodo(id, dto)),
    deleteTodo: (id: string) => wrap(() => deleteTodo(id)),
    // Shopping
    addShoppingItem: (text: string) => wrap(() => addItem({ text })),
    toggleShoppingItem: (id: string) => wrap(() => toggleItem(id)),
    deleteShoppingItem: (id: string) => wrap(() => deleteItem(id)),
    clearDoneShopping: () => wrap(() => clearDone()),
    // Chores
    addChore: (title: string, intervalHours: number) =>
      wrap(() => createChore({ title, intervalHours })),
    markChoreDone: (id: string) => wrap(() => markDone(id)),
    updateChoreInterval: (id: string, intervalHours: number) =>
      wrap(() => updateInterval(id, { intervalHours })),
    deleteChore: (id: string) => wrap(() => deleteChore(id)),
    // Status
    setWorking: (person: Person, text: string) => wrap(() => updateStatus(person, { text })),
  };
}
