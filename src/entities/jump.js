import { createSlice } from '@reduxjs/toolkit';

// Note: here, the reducer is enforcing the state machine
const jumpSlice = createSlice({
  name: 'jump',
  initialState: 'falling',
  reducers: {
    grounded: () => 'grounded',
    jumping: state => state === 'grounded' ? 'jumping' : undefined, // undefined means unchanged,
    falling: () => 'falling',
  },
});

export default jumpSlice.reducer;
export const { grounded, jumping, falling } = jumpSlice.actions;
