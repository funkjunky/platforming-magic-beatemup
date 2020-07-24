import { call, put } from 'redux-yield-effect/lib/effects';
import { addTick } from 'effect-tick';
import { windingUp, swinging, recovering, ready } from 'gameLogic/entities/states/attack';

// TODO: create an abstraction that this and fireball can use.
function* sleep(ms) {
  // TODO: deal with warning about generator... I should figure out how to get this to work as a thunk
  yield put(addTick(function* _tick(dt) {
    return (ms -= dt) <= 0
  }));
}

export function* swingSword(entity) {
  yield put(windingUp({ entity: entity() }));
  yield call(sleep, 200);

  yield put(swinging({ entity: entity() }));
  yield call(sleep, 100);

  yield put(recovering({ entity: entity() }));
  yield call(sleep, 100);

  yield put(ready({ entity: entity() }));
}
