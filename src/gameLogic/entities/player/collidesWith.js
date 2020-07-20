import { doBoxesIntersect, doEntitiesIntersect, doesSpawnIntersect } from '../../doBoxesIntersect';

import { States } from '../states/jump';
import { updateProps, takeDamage, noCollisionWithForDuration } from '../index';

import Block from '../block';
import Fireball from '../fireball';
import AoeEffect from '../aoeEffect';

import Player from './index';

const collidesWith = {
  [Block.type]: {
    how: (player, { props }) => {
      const { top, bottom, left, right } = Player.boundingBoxes(player);
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
    },
    handleCollision: (dispatch, entity, { props }, how) => {
      if (how.top) {
        dispatch(updateProps({ entity, newProps: { y: props.y + props.height, vy: 0 } }));
      }
      // Note: I'm not sure if this is a good practice...
      //      I was hoping to only use the collision info to resolve
      if (how.bottom && entity.states.jump[States.falling]) {
        dispatch(updateProps({ entity, newProps: { y: props.y - entity.props.height + 1, vy: 0 } }));
      }
      if (how.right) {
        dispatch(updateProps({ entity, newProps: { x: props.x - entity.props.width, vx: 0 } }));
      }
      if (how.left) {
        dispatch(updateProps({ entity, newProps: { x: props.x + props.width, vx: 0 } }));
      }
    },
  },
  [Fireball.type]: {
    how: (player, fireball) => doesSpawnIntersect(fireball, player),
    handleCollision: (dispatch, entity, fireball) => {
      if (entity.id !== fireball.props.owner.id) {
        dispatch(takeDamage({ entity, dmg: fireball.props.dmg }));
        // TODO: add knockback and stun
      }
    },
  },
  [AoeEffect.type]: {
    how: doEntitiesIntersect,
    handleCollision: (dispatch, entity, aoeEffect) => {
      dispatch(takeDamage({ entity, dmg: aoeEffect.props.dmg }));
      dispatch(noCollisionWithForDuration({ entity, noCollisionWith: aoeEffect, duration: 1000 }));
    },
  },
};

export default collidesWith;
