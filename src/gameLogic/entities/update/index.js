import { entityDefinitions } from '../index';
import { updateCollisions, resolveCollisions } from './collisions';

const update = (dt, getState, dispatch) => {
  Object.values(getState().entities).forEach(entity => {
    updateCollisions(entity, getState().entities, dispatch);
  });
  Object.values(getState().entities).forEach(entity => {
    resolveCollisions(entity, dispatch);
  });
  Object.values(getState().entities).forEach(entity => {
    // Note: Using updateState is a crutch. Try and avoid it, but it'sgood for quick hacking.
    entityDefinitions[entity.type].updateState?.(entity, getState(), dispatch)
  });
  Object.values(getState().entities).forEach(entity => {
    entityDefinitions[entity.type].updateProps?.(entity, dt, dispatch)
  });
  Object.values(getState().entities).forEach(entity => {
    const getEntity = () => getState().entities[entity.id];
    entityDefinitions[entity.type].updateDoAction?.(getEntity, dispatch);
  });
};

export default update;


