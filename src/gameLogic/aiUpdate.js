import { entityDefinitions } from './entities';

export default ({ entities }, dispatch) => {
  Object.values(entities).forEach(entity =>
    entityDefinitions[entity.type].updateDoAction?.(entity, dispatch));
};
