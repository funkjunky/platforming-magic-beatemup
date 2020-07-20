import { removeEntity } from '../index';
import { doesSpawnIntersect } from 'gameLogic/doBoxesIntersect';

import player from '../player';
import doppleganger from '../doppleganger';

const collidesWith = {
  [player.type]: {
    how: doesSpawnIntersect,
    handleCollision: (dispatch, entity) => dispatch(removeEntity({ entity })),
  },
  [doppleganger.type]: {
    how: doesSpawnIntersect,
    handleCollision: (dispatch, entity) => dispatch(removeEntity({ entity })),
  },
};

export default collidesWith;
