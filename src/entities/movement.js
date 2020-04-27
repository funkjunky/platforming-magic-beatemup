import { createSlice } from '@reduxjs/toolkit';

import { createState } from '../createState';

export const States = {
  pushingRight: 'pushingRight',
  pushingLeft: 'pushingLeft',
  stopping: 'stopping',
};

const movementSlice = createSlice({
  name: 'movement',
  initialState: createState('stopping'),
  reducers: {
    pushingRight: () => createState('pushingRight'),
    pushingLeft: () => createState('pushingLeft'),
    stopping: () => createState('stopping'),
  },
});

export default movementSlice.reducer;
export const { pushingRight, pushingLeft, stopping } = movementSlice.actions;
