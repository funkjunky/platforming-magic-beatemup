import { createSlice } from '@reduxjs/toolkit';

import Entity from '../entity';

// TODO: maybe dont use toolkit, because init will never be used... hmmm
const initialState = {
  velocity: 0,
  x: 0,
  y: 0, // - character height, -block level height
};

const slice = createSlice({
  name: 'props',
  initialState: initialState,
  reducers: {
    // for an entity...
    statesUpdateProps: (entity, { payload: dt }) => {
      // for each state machine...
      Object.entries(Entity[entity.type].stateMachines)
        .forEach(([stateMachine, possibleStates]) => {
          const currentState = entity.state[stateMachine];
          // run the reducer for the current state of that state machine for the entities props
          possibleStates[currentState].reducer(entity.props, dt);
        });
    },
    cleanupProps: (entity, { payload: props }) =>
      Object.entries(props).forEach(([key, value]) =>
        entity.props[key] = value
      ),
  },
});

export default slice.reducer;
export const { statesUpdateProps, cleanupProps } = slice.actions;
