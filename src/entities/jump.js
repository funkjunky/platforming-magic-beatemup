import { createSlice } from '@reduxjs/toolkit';
import { createState } from '../createState';

export const States = {
  grounded: 'grounded',
  jumping: 'jumping',
  falling: 'falling',
};

// Note: here, the reducer is enforcing the state machine
// TODO: perhaps use middleware to add the updatedOn??
//        It'd be nice to go back to simple states if possible
const jumpSlice = createSlice({
  name: 'jump',
  initialState: createState(States.falling), // Note: Date.now() will be called early on import
  reducers: {
    grounded: () => createState(States.grounded),
    // TODO: I'm not sure i want this logic here... It'd be nice to keep these hyper simple
    jumping: state => state[States.grounded] ? createState(States.jumping) : undefined, // undefined means unchanged,
    falling: () => createState(States.falling),
  },
});

export default jumpSlice.reducer;
export const { grounded, jumping, falling } = jumpSlice.actions;
