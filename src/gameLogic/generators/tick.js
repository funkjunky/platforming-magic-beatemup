// TODO: these should be in the tick library.
import { addTick } from 'effect-tick';
import { put } from 'rye-middleware/lib/effects';

/// TODO better name...
export function* waitForTrigger(condition, duration) {
  let msTillFinished = duration;
  yield put(addTick(function _tick(dt) {
    return (msTillFinished -= dt) <= 0 || !condition;
  }));
}

export function* sleep(ms) {
  yield put(addTick(function _tick(dt) {
    return (ms -= dt) <= 0
  }));
}

