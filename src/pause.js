import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'pause',
  initialState: false,
  reducers: {
    togglePause: state => !state,
  }
});

export const { togglePause } = slice.actions;
export default slice.reducer;
