import { entityDefinitions } from './entities';

export default (getState, dispatch) => {
  Object.values(getState().entities).forEach(entity =>
    entityDefinitions[entity.type].updateDoAction?.(() => getState().entities[entity.id], dispatch));
};
