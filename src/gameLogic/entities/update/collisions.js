import { entityDefinitions, clearCollidedWith, pushCollidedWith } from '../index';

export const updateCollisions = (entity, entities, dispatch) => {
  // clear old collisions
  dispatch(clearCollidedWith({ entity }));

  // detect new collisions
  const entityDefn = entityDefinitions[entity.type];
  if (entityDefn.collidesWith) {
    Object.values(entities)
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
