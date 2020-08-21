import { call, put } from 'rye-middleware/lib/effects';
// lol effect-tick should be renamed to tick-middleware or tick-generator-middleware
import { sleep } from './tick';

import { windingUp, swinging, recovering, ready } from 'gameLogic/entities/states/attack';

// TODO: filename should be the same as the function name
export function* swingSword(entity) {
  yield put(windingUp({ entity: entity() }));
  yield call(sleep, 200);

  yield put(swinging({ entity: entity() }));
  yield call(sleep, 100);

  yield put(recovering({ entity: entity() }));
  yield call(sleep, 100);

  yield put(ready({ entity: entity() }));
}
