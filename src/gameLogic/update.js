import { entityDefinitions } from './entities';
import { cleanupAction } from './cleanupAction';

const update = (dt, { entities }, dispatch) => {
  Object.values(entities).forEach(entity =>
    entityDefinitions[entity.type].update(entity, dt, dispatch));
  dispatch(cleanupAction())
};

export default update;
