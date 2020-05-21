import { entityDefinitions } from './entities';
import { cleanupAction } from './cleanupAction';

const update = ({ entities, time }, dispatch) => {
  const dt = (time.currentFrame - time.lastFrame) / 1000;
  Object.values(entities).forEach(entity =>
    entityDefinitions[entity.type].update(entity, dt, dispatch));
  dispatch(cleanupAction())
};

export default update;
