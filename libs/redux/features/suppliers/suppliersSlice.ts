import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SliceState = number;

const initialState: SliceState = 0;

const supplierSlice = createSlice({
  name: "test",
  initialState,
  reducers: {
    increment: (state, action: PayloadAction<number>) => state + action.payload,
    decrement: (state, action: PayloadAction<number>) => state - action.payload,
  },
});

export const { increment, decrement } = supplierSlice.actions;

export default supplierSlice.reducer;
