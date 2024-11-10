// historySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface HistoryItem {
  title: string;
  date: string;
  percentage: number;
}

interface HistoryState {
  history: HistoryItem[];
}

const initialState: HistoryState = {
  history: [],
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addHistoryItem(state, action: PayloadAction<HistoryItem>) {
      state.history.push(action.payload);
    },
  },
});

export const { addHistoryItem } = historySlice.actions;
export default historySlice.reducer;
