// Toolbox imports
import { updateProps } from '../index';
import boundingBoxes from '../basicBoundingBoxes';
import movement, * as Movement from '../states/movement';
import jump, * as Jump from '../states/jump';
import dash, * as Dash from '../states/dash';
import conjure from '../states/conjure';
import { combineReducers } from '../combineReducers';
import { doBoxesIntersect } from '../../doBoxesIntersect';
import Block from '../block';
import Fireball from '../fireball';
import AoeEffect from '../aoeEffect';

const { jumping, falling, grounded } = Jump.States;
const { dashing } = Dash.States;
const { pushingLeft, pushingRight, stopping } = Movement.States;

const handleFireballCollision = (player, fireball, dispatch) => {
  console.log('player collided with fireball: ', player.id, fireball.id, dispatch);
};

const handleAoeEffectCollision = (player, aoeEffect, dispatch) => {
  console.log('player collided with aoeEffect: ', player.id, aoeEffect.id, dispatch);
};

const howPlayerBlock = (player, { props }) => {
  const { top, bottom, left, right } = playerDefinition.boundingBoxes(player);
  if (doBoxesIntersect(props, top)) {
    return { top };
  }
  if (doBoxesIntersect(props, bottom)) {
    return { bottom };
  }
  if (doBoxesIntersect(props, right)) {
    return { right };
  }
  if (doBoxesIntersect(props, left)) {
    return { left };
  }
};

const handleCollisionPlayerBlock = (dispatch, entity, { props }, how) => {
  if (how.top) {
    dispatch(updateProps({ entity, newProps: { y: props.y + props.height, vy: 0 } }));
  }
  // Note: I'm not sure if this is a good practice...
  //      I was hoping to only use the collision info to resolve
  if (how.bottom && entity.states.jump[falling]) {
    dispatch(updateProps({ entity, newProps: { y: props.y - entity.props.height + 1, vy: 0 } }));
  }
  if (how.right) {
    dispatch(updateProps({ entity, newProps: { x: props.x - entity.props.width, vx: 0 } }));
  }
  if (how.left) {
    dispatch(updateProps({ entity, newProps: { x: props.x + props.width, vx: 0 } }));
  }
};

// TODO: these should all be in entity itsself. Maybe props? Maybe somewhere more static (attrs)????
//        entity.state, entity.props, entity.attrs
// in pixels per second
//const acc = 300; // So it takes 0.3-ish second to get to max speed
const accel = {
  grounded: 300,
  falling: 100,
  jumping: 100,
}
const decel = {
  grounded: 300,
  falling: 100,
  jumping: 100,
}
const maxVel = 200;
const dashingVel = 400;

const fallingAcc = 400;
const terminalVel = 600;
const jumpingVel = 250;
const jumpingDec = 200;
const playerDefinition = {
  type: 'player',
  stateReducer: combineReducers({ movement, jump, dash, conjure }),
  boundingBoxes,
  collidesWith: {
    [Block.type]: {
      how: howPlayerBlock,
      handleCollision: handleCollisionPlayerBlock,
    },
    [Fireball.type]: {
      how: (player, fireball) => {},
      handleCollision: handleFireballCollision,
    },
    [AoeEffect.type]: {
      how: (player, aoeEffect) => {},
      handleCollision: (proximity) => handleAoeEffectCollision(proximity),
    },
  },
  actionsFilter: action => (dispatch, getState) => {
    // TODO: can i go back to just payload.id? why is entity a property? Probably cant because of generators?
    const { jump } = getState().entities[action.payload.entity.id].states;
    if (action.type === Jump.jumping.toString()
      && !jump.grounded
      // TODO: abstract out getState.gameTime
      // This is to say, if you recentl started falling, you can STILL jump
      && !(jump.falling && getState().gameTime - jump.falling.createdAt < 100)
    ) return;
    // TODO: this is just to stop action spam... I need a more generic solution for thi.
    else if (action.type === Jump.falling.toString() && getState().entities[action.payload.entity.id].states.jump.falling) return;

    // TODO: this places sucks... maybe turn jump into a thunk
    if (action.type === Jump.jumping.toString()) dispatch(updateProps({ entity: action.payload.entity, newProps: { vy: -jumpingVel } }));

    // can only dash while grounded
    if (action.type === dashing.toString() && !jump.grounded) return;

    // TODO: this also sucks...
    // If falling and current is jumping AND it's less than 1 second old, then drop vy to 0, instantly start falling
    if (
      action.type === Jump.falling.toString()
      && getState().entities[action.payload.entity.id].states.jump.jumping
      && getState().gameTime - getState().entities[action.payload.entity.id].states.jump.jumping.createdAt < 1000
    ) dispatch(updateProps({ entity: action.payload.entity, newProps: { vy: 0 } }));

    return dispatch(action);
  },
  // TODO: these things should probably be in a dash / jump generator
  //      but,I'm not yet sure how to handle filtering generator actions.
  updateState: (entity, gameState, dispatch) => {
    // TODO: This should probably be in typeDefinition player
    const maxJumpDuration = 1000;
    // TODO: once a game clock is implemented, we can use that here, to continue to dash after a pause
    if (entity.states.jump[jumping] && (gameState.gameTime - entity.states.jump[jumping].createdAt) > maxJumpDuration) {
      dispatch(Jump.falling({ entity }));
    }

    // TODO: This should probably be in typeDefinition player
    const maxDashDuration = 500;
    if (entity.states.dash[dashing] && (gameState.gameTime - entity.states.dash[dashing].createdAt) > maxDashDuration) {
      dispatch(Dash.notdashing({ entity }));
    }

    // ground if collided with floor
    const collidedWithFloor = entity.collidedWith.find(({ entity, how }) => entity.type === Block.type && how.bottom)
    if (entity.states.jump[falling] && collidedWithFloor) {
      dispatch(Jump.grounded({ entity }));
    // fall if no longer colliding with floor
    } else if (entity.states.jump[grounded] && !collidedWithFloor) {
      dispatch(Jump.falling({ entity }));
    }
  },
  // dt is in seconds.
  updateProps: (entity, dt, dispatch) => {
    const { props, states: { movement, jump, dash } } = entity;
    // would immer allow me to reuse the props, like destructuring them?
    let vx = props.vx;
    let vy = props.vy;
    const acc = accel[Object.keys(jump)[0]];
    const dec = decel[Object.keys(jump)[0]];
    if (dash.dashing) {
      vx = movement[pushingRight] || (movement[stopping] && movement[stopping].lastState === pushingRight)
        ? dashingVel
        : -dashingVel;
    } else if (movement[pushingRight]) {
      if (props.vx > maxVel) {
        // if grounded, then slow down dash 3x, otherwise 1x
        vx = props.vx - acc * dt * (jump.grounded ? 3 : 1); //triple friction until we're below max vel
      } else {
        vx = maxVel < props.vx ? props.vx : props.vx + acc * dt;
        // if trying to change direction on the ground, or in the air while going over max speed.
        // air: it's to stop people from flying off by accident during a dash jump.
        if (vx < 0 && (jump.grounded || props.vx < -maxVel)) vx += acc * dt * 3; //change direction faster
      }
    } else if (movement[pushingLeft]) {
      if (props.vx < -maxVel) {
        vx = props.vx + acc * dt * (jump.grounded ? 3 : 1); //only diff beteen right and left is + -. simplify this
      }else {
        vx = -maxVel > props.vx ? props.vx : props.vx - acc * dt;
        if (vx > 0 && (jump.grounded || props.vx > maxVel)) vx -= acc * dt * 3;
      }
    } else if (movement[stopping]) {
      // decelerate
      if (props.vx > 0) vx = Math.max(0, props.vx - dec * dt);
      if (props.vx < 0) vx = Math.min(0, props.vx + dec * dt);
    }

    if (jump[falling]) {
      vy = Math.min(terminalVel, vy + dt * fallingAcc);
    } else if (jump[jumping]) {
      vy = props.vy + dt * jumpingDec;
    } else if (jump[grounded]) {
      vy = 0;
    }

    const newProps = {
      vx,
      vy,
      x: props.x + (dt * vx),
      y: props.y + (dt * vy),
    };
    dispatch(updateProps({ entity, newProps }));
  },
  // also add state machines??
}

export default playerDefinition;
