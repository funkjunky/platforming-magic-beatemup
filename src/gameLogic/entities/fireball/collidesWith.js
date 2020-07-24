import { removeEntity } from '../index';
import { doesSpawnIntersect } from 'gameLogic/doBoxesIntersect';
import { fireballExplosion } from 'gameLogic/generators/fireball';

import player from '../player';
import doppleganger from '../doppleganger';

const collidesWith = {
  [player.type]: {
    // TODO: This will break the generator terribly!!!
    how: doesSpawnIntersect,
    // TODO: put in function as "death of fireball" Shared with collidesWith fireball
    handleCollision: handleFireballDeath,
  },
  [doppleganger.type]: {
    how: doesSpawnIntersect,
    // TODO: put in function as "death of fireball" Shared with collidesWith fireball
    handleCollision: handleFireballDeath,
  },
};

export const handleFireballDeath = (dispatch, entity) => {
  const { props: { x, y } } = entity;
  dispatch(fireballExplosion({ x, y, width: 50, height: 50, dmgPerTick: 2 }));
  dispatch(removeEntity(entity));
};

export default collidesWith;
