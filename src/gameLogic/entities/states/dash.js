import { createSlice } from '@reduxjs/toolkit';

import { createState } from './createState';

export const States = {
  dashing: 'dashing',
  notdashing: 'notdashing',
};

const dashSlice = createSlice({
  name: 'dash',
  initialState: { [States.notdashing]: { createdAt: 0 } },
  reducers: {
    dashing: () => createState(States.dashing),
    notdashing: () => createState(States.notdashing),
  },
});

export default dashSlice.reducer;
export const { dashing, notdashing } = dashSlice.actions;
