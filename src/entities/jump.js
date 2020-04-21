import { createSlice } from '@reduxjs/toolkit';

const jumpSlice = createSlice({
  name: 'jump',
  initialState: 'falling',
  reducers: {
    grounded: () => 'grounded', //currently unused. see notes in cleanupAction.js
    jumping: () => 'jumping',
    falling: () => 'falling',
  },
});

export default jumpSlice.reducer;
export const { grounded, jumping, falling } = jumpSlice.actions;
