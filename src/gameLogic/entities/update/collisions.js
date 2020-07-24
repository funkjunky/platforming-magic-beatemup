import { clearCollidedWith, pushCollidedWith, noCollisionWithExpired } from '../index';
import collidesWith from '../collidesWith';

export const updateCollisions = (entity, state, dispatch) => {
  // clear old collisions
  dispatch(clearCollidedWith({ entity }));
  // clear expired `noCollision` entries
  Object.entries(entity.noCollisionWith).forEach(([id, until]) =>
    until <= state.gameTime && dispatch(noCollisionWithExpired({ entity, noCollisionWith: { id } }))
  );

  // detect new collisions
  if (collidesWith[entity.type]) {
    Object.values(state.entities)
      .filter(({ type, id }) =>
        Object.keys(collidesWith[entity.type]).includes(type)
        && !entity.noCollisionWith[id]
      //.forEach(b => how(a, b) ?> handleCollision) // all below code could be summarized to this
      ).map(entityB => ([collidesWith[entity.type][entityB.type].how(entity, entityB), entity, entityB]))
      .filter(([how]) => !!how)
      .forEach(([how, entity, b]) => dispatch(pushCollidedWith({ entity, collidedWith: { entity: b, how } })))
  }
};

export const resolveCollisions = (entity, dispatch) => {
  entity.collidedWith.forEach(collidedWith =>
    collidesWith[entity.type][collidedWith.entity.type]
      .handleCollision(dispatch, entity, collidedWith.entity, collidedWith.how)
  );
};
