import { createAction } from '@reduxjs/toolkit';
import produce from 'immer';

import player from './player';
import fireball from './fireball';
import aoeEffect from './aoeEffect';
import doppleganger from './doppleganger';
import block from './block';

// TODO: abstract out the hp part, as like "createDamagableEntity", with a required hp prop
let _id= 0;
export const createEntity = createAction('CREATE_ENTITY', ({ id, type, states, props }) => {
  const processedId = id || type + ++_id;
  return {
    payload: {
      id: processedId,
      type,
      states,
      props,
    },
    // see: redux-meta-selector middleware
    meta: {
      selector: state => state.entities[processedId],
    },
  }
});

// returns the entity, enhanced with a `createdAgo` function that gives how long a state has been active (undefined if not exist)
export const entitySelector = getState => id => () => {
  const entity = () => getState().entities[id];

  return {
    ...entity(),
    // TODO: should i remove position,and just use Object.values()[0]?
    createdAgo: (state, position) => entity().states[state]
      && getState().gameTime - entity().states[state][position].createdAt,
  };
};

// TODO: this file is getting large and has too many concepts in it
export const noCollisionWithForDuration = ({ entity, noCollisionWith, duration }) =>
  (dispatch, getState) =>
    dispatch(noCollisionWithUntil({
      entity,
      noCollisionWith,
      until: getState().gameTime + duration,
    }));

export const noCollisionWithUntil = createAction('NO_COLLISION_WITH_UNTIL');
export const noCollisionWithExpired = createAction('NO_COLLISION_WITH_EXPIRED');

export const removeEntity = createAction('REMOVE_ENTITY');

export const clearCollidedWith = createAction('CLEAR_COLLIDED_WITH');

export const pushCollidedWith = createAction('ADD_COLLIDED_WITH');

// TODO: should this be here? Not all entities take damage
export const takeDamage = createAction('TAKE_DAMAGE');

export const entityDefinitions = {
  player,
  fireball,
  aoeEffect,
  block,

  doppleganger,
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
        props, props: { x = 0, y = 0, vx = 0, vy = 0 }
      } = action.payload;

      draftState[id] = {
        id,
        type,
        states: produce(states, states => entityDefinitions[type].stateReducer?.(states, action)),
        props: { x, y, vx, vy, ...props },
        collidedWith: [],
        noCollisionWith: {},
      };
      break;
    }

    case removeEntity.toString():
      // TODO: use action.payload.entity.id to be consistent
      delete draftState[action.payload.id];
      break;

    case clearCollidedWith.toString():
      draftState[action.payload.entity.id].collidedWith = [];
      break;

    case pushCollidedWith.toString():
      // TODO: provide a shortcut or defined variable for draftState[action.payload.entity.id]
      draftState[action.payload.entity.id].collidedWith.push(action.payload.collidedWith);
      break;

    case noCollisionWithUntil.toString(): {
      const { entity, noCollisionWith, until } = action.payload;
      draftState[entity.id].noCollisionWith[noCollisionWith.id] = until;
      break;
    }

    case noCollisionWithExpired.toString(): {
      const { entity, noCollisionWith } = action.payload;
      delete draftState[entity.id].noCollisionWith[noCollisionWith.id];
      break;
    }

    // props update action
    case updateProps.toString():
      // Note: IF one at a time is too slow, do all at once.
      Object.entries(action.payload.newProps).forEach(([key, value]) => {
        draftState[action.payload.entity.id].props[key] = value;
      });

      break;

    case takeDamage.toString():
      draftState[action.payload.entity.id].props.hp -= action.payload.dmg;
      break;

    // Everything else with a payload is a state action!
    default:
      // TODO: this if statement is suspicious. Is it needed? When will this be mistakenly triggered? provide an else and console log to see.
      if (action.payload?.entity) {
        const entity = draftState[action.payload.entity.id];
        entityDefinitions[entity.type].stateReducer(entity.states, action);
      }
  }
});

export default entitiesReducer;
