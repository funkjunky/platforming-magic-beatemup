import { put } from 'rye-middleware/lib/effects';
import { sleep } from './tick';

import { dashing, notdashing } from 'gameLogic/entities/states/dash';

const maxDashDuration = 500;

export async function* dash(getEntity) {
  const entity = getEntity();
  yield put(dashing({ entity }));

  const { result } = yield put(sleep(maxDashDuration));
  await result;
  yield put(notdashing({ entity }));
}

// TODO: make a generic thunk for this (stateActionCreator) => ({ end, entity }) => dispatch
export const cancelDash = ({ endGeneratorAction, entity }) => dispatch => {
  dispatch(endGeneratorAction);
  dispatch(notdashing({ entity }));
};
