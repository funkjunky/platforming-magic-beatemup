import { createAction } from '@reduxjs/toolkit';
import produce from 'immer';

// TODO: suspicious, because this file contains zero logic, until I add this
import { doBoxesIntersect } from './doBoxesIntersect';

import player from './player';
import fireball from './fireball';

let _id= 0;
export const createEntity = createAction('CREATE_ENTITY', ({ id, type, state, props }) => ({
  payload: {
    id: id || type + ++_id,
    type,
    state,
    props,
  },
}));

export const removeEntity = createAction('REMOVE_ENTITY');

// TODO: should this be here? Not all entities take damage
export const takeDamage = createAction('TAKE_DAMAGE');

export const entityDefinitions = {
  player,
  fireball,
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

    case removeEntity.toString():
      delete draftState[action.payload.id];
      break;

    // props update action
    case updateProps.toString():
      // Note: IF one at a time is too slow, do all at once.
      Object.entries(action.payload.newProps).forEach(([key, value]) => draftState[action.payload.entity.id].props[key] = value);
      break;

    // take damage is sent to a target or anyone in the area for the damage
    case takeDamage.toString():
      // TODO: I should probably handle this in a separate function somewhere
      if (action.payload.area) {
        Object.values(draftState).forEach(entity =>
          doBoxesIntersect(entity, action.payload.area) && entity.props.health
            && (entity.props.health -= action.payload.dmg)
        );
      } else if (action.payload.target) {
        draftState[action.payload.entity.id].props.health -= action.payload.dmg;
      }
      break;

    // Everything else with a payload is a state action!
    default:
      // TODO: this if statement is suspicious. Is it needed? When will this be mistakenly triggered? provide an else and console log to see.
      if (action.payload && action.payload.entity !== undefined) {
        const entity = draftState[action.payload.entity.id];
        entityDefinitions[entity.type].stateReducer(entity.states, action);
      }
  }
});

export default entitiesReducer;
