import { combineReducers } from '../combineReducers';
import movement, * as Movement from '../states/movement';
import boundingBoxes from '../basicBoundingBoxes';
import { updateProps } from '../index';

const { pushingRight } = Movement.States;

const Fireball = {
  type: 'fireball',
  stateReducer: combineReducers({ movement }),
  boundingBoxes,
  updateProps: (entity, dt, dispatch) => {
    const { props: { x, y, speed }, states: { movement } } = entity;

    // TODO: just awful logic
    const vx = movement[pushingRight] ? speed : -speed; //i dunno... is it in the conjure?
    dispatch(updateProps({ entity, newProps: { x: x + vx * dt, y } }));
  },
};

export default Fireball;
