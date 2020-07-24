import { createSlice } from '@reduxjs/toolkit';

import { createState } from './createState';

export const States = {
  windingUp: 'windingUp',
  swinging: 'swinging',
  recovering: 'recovering',
  ready: 'ready',
};

const conjureSlice = createSlice({
  name: 'attack',
  initialState: { [States.ready]: { createdAt: 0 } },
  reducers: {
    windingUp: (_, { params }) => createState(States.windingUp, params),
    swinging: (_, { params }) => createState(States.swinging, params),
    recovering: (_, { params }) => createState(States.recovering, params),
    ready: () => createState(States.ready),
  },
});

export default conjureSlice.reducer;
export const { windingUp, swinging, recovering, ready } = conjureSlice.actions;
