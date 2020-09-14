import { call, put, fork } from 'rye-middleware/lib/effects';
import { addTick } from 'effect-tick';
import { sleep, waitForTrigger } from './tick';

import { createEntity, removeEntity } from 'gameLogic/entities';
import { conjuring, casting, recovering, ready } from 'gameLogic/entities/states/conjure';
import { pushingRight } from 'gameLogic/entities/states/movement';

// import { handleFireballDeath } from 'gameLogic/generators/fireball';

// TODO: the currying on redux thunk is awkward... perhaps just better formatting, or use generators?
// TODO:  when to call entity, or when to pass it as the function... it's hard to tell... clean up somehow??
//Curry is necessary for react-redux later. connect shorthand
// TODO: consider renaming fireball to castFireball... same with the other generators
export async function* fireball(owner) {
  const fireball = yield call(conjureFireball, owner, { speed: 100, radius: 12, dmg: 3 })

  // TODO: put this in 'castingFireball'
  yield put(casting({ entity: owner(), params: { type: 'fireball' } }));
  // TODO: Piggy backing on the movement state... but I'll still need to write the update for fireball, to move it forward.
  yield put(pushingRight({ entity: fireball() }));
  yield call(waitForTrigger, () => !fireball(), 3000);

  if (fireball()) {
    // TODO: figure out how to call handleFireballDeath() [yield, frk and put. can't dispatch] should be able to also dispatch, perhaps put generator
    //      If needed fork redux yield effect. It isn't being maintained anymore anyways, may as well take ownership, lol
    const { props: { x, y } } = fireball();
    yield fork(fireballExplosion, { x, y, width: 50, height: 50, dmgPerTick: 2 });
    yield put(removeEntity(fireball()));
  }
  // TODO: put in function as "death of fireball" Shared with collidesWith fireball
  yield put(recovering({ entity: owner() }));

  yield put(sleep(500));
  yield put(ready({ entity: owner() }));
}


function* conjureFireball(owner, props) {
  // TODO: fireball is shared with createFireball... DRY
  yield put(conjuring({ entity: owner(), params: { type: 'fireball' } }));
  yield call(sleep, 1000);

  const { props: { x, y, width }, id } = owner();
  return yield put(createFireball({ owner: { id }, x: x + width / 2, y, ...props }));
}

export function* fireballExplosion({ x, y, width, height, dmgPerTick }) {
  // TODO: sTillTick should be automatically defined in creation ALSO it should be a parameter, NOT a prop
  const explosion = yield put(createExplosion({ x, y, width, height, dmgPerTick, sPerTick: 0.5, sTillTick: 0.5 }));
  let msTillFinished = 2000;
  // TODO: should the lifespan ONLY exist here in the generator?
  // Also there's no indication when it would disappear according to either the state or the props.
  yield put(addTick(dt => function _tick() {
    return (msTillFinished -= dt) <= 0;
  }));
  yield put(removeEntity(explosion()));
}

// TODO: replace fireball and aoeeffect with the entity `type` property
const createFireball = props => createEntity({ type: 'fireball', props });
const createExplosion = props => createEntity({ type: 'aoeEffect', props });
