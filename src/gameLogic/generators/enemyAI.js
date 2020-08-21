import { put, call } from 'rye-middleware/lib/effects';

import { pushingLeft, pushingRight, stopping } from 'gameLogic/entities/states/movement';
import { sleep } from './tick';

export function* pushingLeftForX(entity, ms) {
  yield put(pushingLeft({ entity }));
  yield call(sleep, ms);
  yield put(stopping({ entity }));
}

export function* pushingRightForX(entity, ms) {
  yield put(pushingRight({ entity }));
  yield call(sleep, ms);
  yield put(stopping({ entity }));
}
