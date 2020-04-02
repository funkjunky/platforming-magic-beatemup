import { put } from 'redux-yield-effect/lib/effects';
import { addTick } from 'effect-tick';

import { seekStep } from './index';

//TODO: replace fireballRadius with hit detection, and replace speed.
const speed = 0.1; //x per ms
const fireballRadius = 0.1;
export const seek = function* _seek(owner, target) {
    yield put(addTick(function* _tick(dt) {
        const distance = yield put(seekStep(owner, target, dt * speed));
        return fireballRadius > distance();
    }));
};
