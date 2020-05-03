// Toolbox imports
import { updateProps } from '../index';
import boundingBoxes from '../basicBoundingBoxes';
import movement, * as Movement from '../states/movement';
import jump, * as Jump from '../states/jump';
import { combineReducers } from '../combineReducers';

// arbitrary imports
import { characterWidth } from '../../loadResources';

const { jumping, falling, grounded } = Jump.States;
const { pushingLeft, pushingRight, stopping } = Movement.States;

// TODO: these should all be in entity itsself. Maybe props? Maybe somewhere more static (attrs)????
//        entity.state, entity.props, entity.attrs
// in pixels per second
const acc = 200; // So it takes 0.5 second to get to max speed
const dec = 100; // it takes 1 seconds to stop, naturally
const maxVel = characterWidth;
const fallingAcc = 200;
const terminalVel = 200;
const jumpingVel = 150;
const playerDefinition = {
  type: 'player',
  stateReducer: combineReducers({ movement, jump }),
  boundingBoxes,
  actionsFilter: action => (dispatch, getState) => {
    if (action.type === Jump.jumping.toString() && !getState().entities[action.payload.id].states.jump.grounded) return;
    //TODO: this is just to stop action spam... I need a more generic solution for thi.
    else if (action.type === Jump.falling.toString() && getState().entities[action.payload.id].states.jump.falling) return;

    return dispatch(action);
  },
  // dt is in seconds.
  update: (entity, dt, dispatch) => {
    const { props, states: { movement, jump } } = entity;
    // would immer allow me to reuse the props, like destructuring them?
    let vx = props.vx;
    let vy = props.vy;
    if (movement[pushingRight]) {
      vx = Math.min(maxVel, props.vx + acc * dt)
    } else if (movement[pushingLeft]) {
      vx = Math.max(-maxVel, props.vx - acc * dt)
    } else if (movement[stopping]) {
      // decelerate
      if (props.vx > 0) vx = Math.max(0, props.vx - dec * dt);
      if (props.vx < 0) vx = Math.min(0, props.vx + dec * dt);
    }

    // temporary, until i implement jumping. I need the grounded to properly do the acc of falling
    if (jump[falling]) {
      vy = Math.min(terminalVel, vy + dt * fallingAcc);
    } else if (jump[jumping]) {
      vy = -jumpingVel;
    } else if (jump[grounded]) {
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
}

export default playerDefinition;
