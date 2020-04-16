import { createSlice } from '@reduxjs/toolkit';

const movementSlice = createSlice({
  name: 'movement',
  initialState: 'stopping',
  reducers: {
    pushingRight: () => 'pushingRight',
    pushingLeft: () => 'pushingLeft',
    stopping: () => 'stopping',
  },
});

export default movementSlice.reducer;
export const { pushingRight, pushingLeft, stopping } = movementSlice.actions;
