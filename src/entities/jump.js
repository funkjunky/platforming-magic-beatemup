import { createSlice } from '@reduxjs/toolkit';

// Note: here, the reducer is enforcing the state machine
// TODO: perhaps use middleware to add the updatedOn??
//        It'd be nice to go back to simple states if possible
const jumpSlice = createSlice({
  name: 'jump',
initialState: { state: 'falling', updatedOn: Date.now() }, // Note: Date.now() will be called early on import
  reducers: {
    grounded: () => ({ state: 'grounded', updatedOn: Date.now() }),
    jumping: ({ state }) => state === 'grounded' ? { state: 'jumping', updatedOn: Date.now() } : undefined, // undefined means unchanged,
    falling: () => ({ state: 'falling', updatedOn: Date.now() }),
  },
});

export default jumpSlice.reducer;
export const { grounded, jumping, falling } = jumpSlice.actions;
