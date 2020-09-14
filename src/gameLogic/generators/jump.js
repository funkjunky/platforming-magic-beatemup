import { put } from 'rye-middleware/lib/effects';
import { addTick } from 'effect-tick';

import { jumping, falling } from 'gameLogic/entities/states/jump';
import { updateProps } from '../entities/index';
import { entitySelector } from 'gameLogic/entities';

const jumpingVel = 250;
const jumpingDuration = 1000;

export function* jump(getEntity) {
  const entity = getEntity();
  yield put(jumping({ entity }));
  yield put(updateProps({ entity, newProps: { vy: -jumpingVel } }));

  let timeElapsed = 0;
  yield put(addTick(dt => function _tick(dispatch) {
    console.log('bleh');
    timeElapsed += dt;
    // if we're now falling via vy, then set state to falling
    if (getEntity().props.vy > 0) dispatch(falling({ entity }));

    // We can only continue to jump for `jumpDuration`
    if (timeElapsed > jumpingDuration) return true;
  }));
}

export const cancelJump = ({ endGeneratorAction, entity }) => (dispatch, getState) => {
  dispatch(endGeneratorAction);
  // Quick fall, if we JUST started jumping
  if (entitySelector(getState)(entity.id)().createdAgo('jump', 'jumping') < 100) {
    dispatch(updateProps({ entity, newProps: { vy: 0 } }));
  }

  dispatch(falling({ entity }));
};
