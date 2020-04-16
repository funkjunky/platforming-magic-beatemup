import { createAction } from '@reduxjs/toolkit';
import produce from 'immer';

import { typeDefinitions } from './typeDefinitions';

let _id= 0;
export const createEntity = createAction('CREATE_ENTITY', ({ type, state, props }) => ({
  payload: {
    id: type + ++_id,
    type,
    state,
    props,
  },
}));

// put the action(s) that are being called for the update,
// also the values they're contributing, into this meta object.
// For debugging purposes.
export const updateProps = createAction('UPDATE_PROPS', (payload, meta) => ({
  payload,
  meta,
}));

const entitiesReducer = (state = {}, action) => produce(state, draftState => {
  switch(action.type) {
    case createEntity.toString(): {
      const { id, type, states = {}, props: { x = 0, y = 0, vx = 0, vy = 0 } } = action.payload;
      draftState[id] = {
        id,
        type,
        // because createEntity isn't one of it's actions, state should be unchanged, BUT because state is undefined, initialState should be set!
        // TODO: RTK may break here... make sure it applies initialState here. [it better follow it's own rules about NOT using @@init]
        states: produce(states, states => typeDefinitions[type].stateReducer(states, action)),
        props: { x, y, vx, vy },
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
        typeDefinitions[entity.type].stateReducer(entity.states, action);
      }
  }
});

export default entitiesReducer;
