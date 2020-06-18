import { put, call } from 'redux-yield-effect/lib/effects';

import { pushingLeft, pushingRight, stopping } from 'gameLogic/entities/states/movement';
import { sleep } from './spawnEnemies'; //TODO: sleep should exist somewhere else... probably a library

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
