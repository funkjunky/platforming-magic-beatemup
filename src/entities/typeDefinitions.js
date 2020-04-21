import movement from './movement';
import { updateProps } from './index';
import boundingBoxes from './basicBoundingBoxes';

// considering immer...
const combineReducers = reducers => (draftState, action) =>
  Object.entries(reducers).forEach(([name, reducer]) =>
    draftState[name] = reducer(draftState[name], action)
  );

// in pixels per second
const acc = 100; // So it takes 1 second to get to max speed
const dec = 50; // it takes 2 seconds to stop, naturally
const maxVel = 100;
export const typeDefinitions = {
  player: {
    type: 'player',
    stateReducer: combineReducers({ movement }),
    boundingBoxes,
    // dt is in seconds.
    update: (entity, dt, dispatch) => {
      const { props, states: { movement } } = entity;
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
      vy = 100;

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
