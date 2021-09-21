import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export interface CounterState {
  player: Number;
}

const initialState: CounterState = {
  player: 1,
};

export const gameSlice = createSlice({
  name: "counter",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    changePlayer: (state, action: PayloadAction<number>) => {
      state.player = action.payload;
    },
  },
});

export const { changePlayer } = gameSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectCount = (state: RootState) => state.counter.value;

export default gameSlice.reducer;
