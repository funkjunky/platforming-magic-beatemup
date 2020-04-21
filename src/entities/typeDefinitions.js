import { updateProps } from './index';
import boundingBoxes from './basicBoundingBoxes';

import movement from './movement';
import jump from './jump';

// considering immer...
const combineReducers = reducers => (draftState, action) =>
  Object.entries(reducers).forEach(([name, reducer]) => {
    draftState[name] = reducer(draftState[name], action)
    console.log('new states: ', action.type, name, draftState[name]);
  });

// TODO: these should all be in entity itsself. Maybe props? Maybe somewhere more static (attrs)????
//        entity.state, entity.props, entity.attrs
// in pixels per second
const acc = 100; // So it takes 1 second to get to max speed
const dec = 50; // it takes 2 seconds to stop, naturally
const maxVel = 100;
const fallingAcc = 200;
const terminalVel = 200;
const jumpingVel = 150;
export const typeDefinitions = {
  player: {
    type: 'player',
    stateReducer: combineReducers({ movement, jump }),
    boundingBoxes,
    // dt is in seconds.
    update: (entity, dt, dispatch) => {
      const { props, states: { movement, jump } } = entity;
      // would immer allow me to reuse the props, like destructuring them?
      let vx = props.vx;
      let vy = props.vy;
      if (movement === 'pushingRight') {
        vx = Math.min(maxVel, props.vx + acc * dt)
      } else if (movement === 'pushingLeft') {
        vx = Math.max(-maxVel, props.vx - acc * dt)
      } else if (movement === 'stopping') {
        // decelerate
        if (props.vx > 0) vx = Math.max(0, props.vx - dec * dt);
        if (props.vx < 0) vx = Math.min(0, props.vx + dec * dt);
      }

      // temporary, until i implement jumping. I need the grounded to properly do the acc of falling
      if (jump === 'falling') {
        vy = Math.min(terminalVel, vy + dt * fallingAcc);
      } else if (jump === 'jumping') { // TODO: most games only allow this for a short time.
        vy = -jumpingVel;
      } else if (jump === 'grounded') {
        vy = 0;
      }

      const newProps = {
        vx,
        vy,
        x: props.x + dt * vx,
        y: props.y + dt * vy,
      };
      dispatch(updateProps({ entity, newProps }));
    },
    // also add state machines??
  },
};
