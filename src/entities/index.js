import { createSlice } from '@reduxjs/toolkit';

let _id = 0;

const slice = createSlice({
  name: 'entities',
  initialState: {},
  reducers: {
    // configure RTK to just pass the entity and not the type
    createEntity: (state, { payload: entity }) =>
      void (state[_id++] = { x: 0, y: 0, ...entity }),
    removeEntity: (state, { payload: entity }) =>
      delete state[entity().id],
  },
});

export const { createEntity, removeEntity } = slice.actions;
export default slice.reducer;
