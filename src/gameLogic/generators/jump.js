import { put } from 'rye-middleware/lib/effects';
import { addTick } from 'effect-tick';

import { jumping, falling } from 'gameLogic/entities/states/jump';
import { updateProps } from '../entities/index';

const jumpingVel = 250;

export function* jump(getEntity) {
  const entity = getEntity();
  yield put(jumping({ entity }));
  yield put(updateProps({ entity, newProps: { vy: -jumpingVel } }));

  let timeElapsed = 0;
  yield put(addTick(dt => dispatch => {
    timeElapsed += dt;
    // if we're now falling via vy, then set state to falling
    if (getEntity().props.vy > 0) dispatch(falling({ entity }));

    // if we started falling...
    if (getEntity().state.jump[falling]) {
      // if it's been less than 100 ms, then quick fall, vy = 0
      if (timeElapsed < 100) dispatch(updateProps({ entity, newProps: { vy: 0 } }));

      // exit the loop
      return true;
    }
  }));
}
