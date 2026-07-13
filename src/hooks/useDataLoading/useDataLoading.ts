import { getBoard } from "@/api/generated/holiday-dashboard-api";
import { setBoard } from "@/store/board-slice";
import { useAppDispatch } from "@/store/hooks";
import { useCallback } from "react";

/** All reads funnel through here — the only sanctioned load path for components. */
export function useDataLoading() {
  const dispatch = useAppDispatch();

  const loadBoard = useCallback(async () => {
    const board = await getBoard();
    dispatch(setBoard(board));
  }, [dispatch]);

  return { loadBoard };
}
