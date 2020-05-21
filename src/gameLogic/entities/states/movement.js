import { createSlice } from '@reduxjs/toolkit';

import { createState } from './createState';

export const States = {
  pushingRight: 'pushingRight',
  pushingLeft: 'pushingLeft',
  stopping: 'stopping',
};

const movementSlice = createSlice({
  name: 'movement',
  initialState: createState(States.stopping, { lastState: States.pushingRight }),
  reducers: {
    pushingRight: () => createState(States.pushingRight),
    pushingLeft: () => createState(States.pushingLeft),
    stopping: state => createState(States.stopping, { lastState: Object.keys(state)[0] }),
  },
});

export default movementSlice.reducer;
export const { pushingRight, pushingLeft, stopping } = movementSlice.actions;
