// Toolbox imports
import { States as Movement } from '../states/movement';
import { fireball } from 'gameLogic/generators/fireball';
import { jump } from 'gameLogic/generators/jump';
import PlayerDefinition from '../player';

import { pushingLeftForX, pushingRightForX } from 'gameLogic/generators/enemyAI';

const dopplegangerDefinition = {
  ...PlayerDefinition,
  type: 'doppleganger',
  updateDoAction: (getEntity, dispatch) => {
    const entity = getEntity();
    if (entity.states.movement[Movement.stopping]) {
      // TODO:dependant on loop cycle interval
      if (Math.random() < 0.5) {
        dispatch(pushingLeftForX(entity, Math.random() * 2000));
      } else {
        dispatch(pushingRightForX(entity, Math.random() * 2000));
      }
    }

    //this is dumb, but every LOOP there' a 1/100 chance of jumping
    if (dopplegangerDefinition.allowedToDispatch(jump.name, entity) && Math.random() > 0.995) {
      dispatch(jump(getEntity));
    }

    if (dopplegangerDefinition.allowedToDispatch(fireball.name, entity) && Math.random() > 0.99) {
      dispatch(fireball(getEntity));
    }
  },
};

export default dopplegangerDefinition;
