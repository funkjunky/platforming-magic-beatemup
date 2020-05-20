import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'time',
  initialState: {
    currentFrame: Date.now(),
    lastFrame: Date.now() - 1,
  },
  reducers: {
    updateCurrentFrame: (state, { payload }) => void (state.currentFrame = payload),
    updateLastFrame: (state, { payload }) => void (state.lastFrame = payload),
  },
});

export const { updateCurrentFrame, updateLastFrame } = slice.actions;
export default slice.reducer;
