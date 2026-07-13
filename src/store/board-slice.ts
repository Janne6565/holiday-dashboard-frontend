import type { BoardDto } from "@/api/generated/model";
import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

interface BoardState {
  data: BoardDto | null;
  loaded: boolean;
}

const initialState: BoardState = { data: null, loaded: false };

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    setBoard(state, action: PayloadAction<BoardDto>) {
      state.data = action.payload;
      state.loaded = true;
    },
  },
});

export const { setBoard } = boardSlice.actions;
export default boardSlice.reducer;
