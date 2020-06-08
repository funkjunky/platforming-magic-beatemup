import { call, put, fork } from 'redux-yield-effect/lib/effects';
//import { createAction } from '@reduxjs/toolkit';
import { addTick } from 'effect-tick';

// TODO: takeDamage should be part of some entities, I don't think it should be generic... hmm
import { createEntity, removeEntity, takeDamage } from 'gameLogic/entities';
import { conjuring, casting, recovering, ready } from 'gameLogic/entities/states/conjure';
import { pushingRight } from 'gameLogic/entities/states/movement';

// TODO: the currying on redux thunk is awkward... perhaps just better formatting, or use generators?
// TODO:  when to call entity, or when to pass it as the function... it's hard to tell... clean up somehow??
//Curry is necessary for react-redux later. connect shorthand
export default function* _fireball(owner) {
  const fireball = yield call(conjureFireball, owner, { speed: 100, radius: 12 })

  // TODO: put this in 'castingFireball'
  yield put(casting({ entity: owner(), params: { type: 'fireball' } }));
  // TODO: Piggy backing on the movement state... but I'll still need to write the update for fireball, to move it forward.
  yield put(pushingRight({ entity: fireball() }));
  const duration = 3000;
  const collidedWith = yield call(waitForTrigger, fireball, duration);
  yield put(recovering({ entity: owner() }));
  if (collidedWith) {
    yield put(takeDamage(collidedWith, fireball()));
  }

  const { props: { x, y } } = fireball();
  yield put(removeEntity(fireball()));
  yield fork(fireballExplosion, { x, y, width: 50, height: 50, dmgPerTick: 2 });

  let msTillRecovery = 500;
  // TODO: deal with warning about generator... I should figure out how to get this to work as a thunk
  yield put(addTick(function* _tick(dt) {
    return (msTillRecovery -= dt) <= 0;
  }));
  yield put(ready({ entity: owner() }));
}

function* waitForTrigger(fireball, duration) {
  let msTillFinished = duration;
  // TODO: deal with warning about generator... I should figure out how to get this to work as a thunk
  const collidedWith = yield put(addTick(function* _tick(dt) {
    return (msTillFinished -= dt) <= 0 || fireball().props.collidedWith;
  }));
}

function* conjureFireball(owner, props) {
  // TODO: fireball is shared with createFireball... DRY
  yield put(conjuring({ entity: owner(), params: { type: 'fireball' } }));
  let msTillConjured = 1000;
  // TODO: deal with warning about generator... I should figure out how to get this to work as a thunk
  yield put(addTick(function* _tick(dt) {
    return (msTillConjured -= dt) <= 0;
  }));
  const { props: { x, y, width } } = owner();
  return yield put(createFireball({ x: x + width / 2, y, ...props }));
}

function* fireballExplosion({ x, y, width, height, dmgPerTick }) {
  // TODO: sTillTick should be automatically defined in creation ALSO it should be a parameter, NOT a prop
  const explosion = yield put(createExplosion({ x, y, width, height, dmgPerTick, sPerTick: 0.5, sTillTick: 0.5 }));
  let msTillFinished = 2000;
  // TODO: should the lifespan ONLY exist here in the generator?
  // Also there's no indication when it would disappear according to either the state or the props.
  yield put(addTick(function* _tick(dt) {
    return (msTillFinished -= dt) <= 0;
  }));
  yield put(removeEntity(explosion()));
}

const createFireball = props => createEntity({ type: 'fireball', props });
const createExplosion = props => createEntity({ type: 'aoeEffect', props });
