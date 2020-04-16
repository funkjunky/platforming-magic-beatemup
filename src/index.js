import 'regenerator-runtime/runtime.js';
import 'end-polyFills';

import { createStore, applyMiddleware, compose } from 'redux';
import { createYieldEffectMiddleware } from 'redux-yield-effect';
// import { put, fork, join } from 'redux-yield-effect/lib/effects';
import { tickMiddleware, resumeTicks, /* pauseTicks */ } from 'effect-tick';
import { createEntity } from './entities/index.js';
import reducer from './reducer.js';
import metaSelector from 'redux-meta-selector';
import loadResources from './loadResources';
import graphics from './graphics.js';
import { setControls } from './Controls';
import { typeDefinitions } from './entities/typeDefinitions';
import { update } from './lastUpdated';

// TODO: clean up this index file a lot!

document.addEventListener('DOMContentLoaded', firstLoad);

window.raf    // the raf to cancel on HMR
window.store  // the store to update on HMR

const step = (ctx, resources) => dt => {
  graphics(ctx, window.store.getState(), resources, dt);
  window.raf = window.requestAnimationFrame(step(ctx, resources));
};

const loadRaf = () => {
  loadResources().then(resources =>  {
    const ctx = document.querySelector('canvas').getContext('2d');
    if (window.raf) window.cancelAnimationFrame(window.raf);
    window.raf = window.requestAnimationFrame(step(ctx, resources));
  });
};

//TODO: spriteWidth should be defined elsewhere.. ...
const spriteWidth = 96;
async function firstLoad() {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  window.store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(
      createYieldEffectMiddleware(),
      tickMiddleware,
      metaSelector
    )),
  );

  // load request animation frame
  loadRaf();

  // start ticks
  window.store.dispatch(resumeTicks());


  // create the first player entity
  window.store.dispatch(createEntity({
    props: {
      x: spriteWidth,
      y: 480 - spriteWidth - spriteWidth,
    },
    type: 'player',
  }));

  window.addEventListener('gamepadconnected', e => {
    console.log('gamepad connected: ', e.gamepad);
  });

  // TODO: put the setControls in with the other interval. They should all be in the same interval.
  window.controlsInterval = setControls(window.store.dispatch);
  window.updateInterval = setInterval(() => {
    const { entities, lastUpdated } = window.store.getState();
    const dt = (Date.now() - lastUpdated) / 1000;
    Object.values(entities).forEach(entity =>
      typeDefinitions[entity.type].update(entity, dt, window.store.dispatch));
    // call cleanup
    window.store.dispatch(update(Date.now()));
  }, 500);
}

if(module.hot) {
  // Called after every change.
  // Use window globals to keep track of old state.
  module.hot.accept();
  if (window.raf) loadRaf();
  if (window.store) window.store.replaceReducer(reducer);
  if (window.controlsInterval) {
    clearInterval(window.controlsInterval);
    window.controlsInterval = setControls(window.store.dispatch);
  }
  // NOTE: I might have to add controller in here
}
