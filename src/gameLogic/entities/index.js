import { createAction } from '@reduxjs/toolkit';
import produce from 'immer';

import player from './player';

let _id= 0;
export const createEntity = createAction('CREATE_ENTITY', ({ id, type, state, props }) => ({
  payload: {
    id: id || type + ++_id,
    type,
    state,
    props,
  },
}));

export const entityDefinitions = {
  player,
};

// put the action(s) that are being called for the update,
// also the values they're contributing, into this meta object.
// For debugging purposes.
// ~~ generic action for all entities
export const updateProps = createAction('UPDATE_PROPS', (payload, meta) => ({
  payload,
  meta,
}));

// we don't use createSlice, because we need to leverage the default case. RTK requires all code to be under an explicit type.
const entitiesReducer = (state = {}, action) => produce(state, draftState => {
  switch(action.type) {
    case createEntity.toString(): {
      const {
        id, type, states = {},
        // sensible props defaults. Currently use vx and vy for player
        props: { x = 0, y = 0, vx = 0, vy = 0, height = 96, width = 96 }
      } = action.payload;

      draftState[id] = {
        id,
        type,
        states: produce(states, states => entityDefinitions[type].stateReducer(states, action)),
        props: { x, y, vx, vy, height, width },
      };
      break;
    }

    // props update action
    case updateProps.toString():
      // Note: IF one at a time is too slow, do all at once.
      Object.entries(action.payload.newProps).forEach(([key, value]) => draftState[action.payload.entity.id].props[key] = value);
      break;

    // Everything else with a payload is a state action!
    default:
      if (action.payload && action.payload.id !== undefined) {
        const entity = draftState[action.payload.id];
        entityDefinitions[entity.type].stateReducer(entity.states, action);
      }
  }
});

export default entitiesReducer;