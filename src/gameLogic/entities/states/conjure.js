import { createSlice } from '@reduxjs/toolkit';

import { createState } from './createState';

export const States = {
  conjuring: 'conjuring',
  casting: 'casting',
  recovering: 'recovering',
  ready: 'ready',
};

const conjureSlice = createSlice({
  name: 'conjure',
  initialState: { [States.ready]: { createdAt: 0 } },
  reducers: {
    conjuring: (_, { params }) => createState(States.conjuring, params),
    casting: (_, { params }) => createState(States.casting, params),
    recovering: (_, { params }) => createState(States.recovering, params),
    ready: () => createState(States.ready),
  },
});

export default conjureSlice.reducer;
export const { conjuring, casting, recovering, ready } = conjureSlice.actions;
