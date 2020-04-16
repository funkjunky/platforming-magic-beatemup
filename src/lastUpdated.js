import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'lastUpdated',
  initialState: Date.now(),
  reducers: {
    update: (state, { payload: lastUpdated }) => lastUpdated,
  },
});

export const { update } = slice.actions;
export default slice.reducer;
