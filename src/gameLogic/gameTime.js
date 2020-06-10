import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'gameTime',
  initialState: 0,
  reducers: {
    incrementGameTime: (state, { payload }) => state + payload,
  },
});

export const { incrementGameTime } = slice.actions;
export default slice.reducer;
