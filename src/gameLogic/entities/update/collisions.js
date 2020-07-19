import { entityDefinitions, clearCollidedWith, pushCollidedWith, noCollisionWithExpired } from '../index';

export const updateCollisions = (entity, state, dispatch) => {
  // clear old collisions
  dispatch(clearCollidedWith({ entity }));
  // clear expired `noCollision` entries
  Object.entries(entity.noCollisionWith).forEach(([id, until]) =>
    // TODO: I shouldn't have to build up an entity... hmmmm
    until > state.gameTime && dispatch(noCollisionWithExpired({ entity: { id } }))
  );

  // detect new collisions
  const entityDefn = entityDefinitions[entity.type];
  if (entityDefn.collidesWith) {
    Object.values(state.entities)
      .filter(({ type }) => Object.keys(entityDefn.collidesWith).includes(type))
      //.forEach(b => how(a, b) ?> handleCollision) // all below code could be summarized to this
      .map(entityB => ([entityDefn.collidesWith[entityB.type].how(entity, entityB), entity, entityB]))
      .filter(([how]) => !!how)
      .forEach(([how, entity, b]) => dispatch(pushCollidedWith({ entity, collidedWith: { entity: b, how } })))
  }
};

export const resolveCollisions = (entity, dispatch) => {
  const entityDefn = entityDefinitions[entity.type];
  //if (entity.collidedWith.length > 0) console.log('someting collided! ', entity.collidedWith);
  entity.collidedWith.forEach(collidedWith =>
    entityDefn.collidesWith[collidedWith.entity.type]
      .handleCollision(dispatch, entity, collidedWith.entity, collidedWith.how)
  );
};
