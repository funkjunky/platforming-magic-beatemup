import 'regenerator-runtime/runtime.js';
import 'end-polyFills';

import { createStore, applyMiddleware } from 'redux';
import { createYieldEffectMiddleware } from 'redux-yield-effect';
// import { put, fork, join } from 'redux-yield-effect/lib/effects';
import { tickMiddleware, resumeTicks, /* pauseTicks */ } from 'effect-tick';
import { createEntity } from './entities/index.js';
import reducer from './reducer.js';
import metaSelector from 'redux-meta-selector';
import loadResources from './loadResources';
import graphics from './graphics.js';

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
  window.store = createStore(
    reducer,
    applyMiddleware(
      createYieldEffectMiddleware(),
      tickMiddleware,
      metaSelector
    ),
  );

  // load request animation frame
  loadRaf();

  // start ticks
  window.store.dispatch(resumeTicks());


  // create the first player entity
  window.store.dispatch(createEntity({
    velocity: 0, //set this as a defualt in props
    x: spriteWidth,
    y: 480 - spriteWidth - spriteWidth,
    type: 'player',
  }));

  console.log('state: ', window.store.getState());

  window.addEventListener('gamepadconnected', e => {
    console.log('gamepad connected: ', e.gamepad);
  });

  //setControls(window.store.dispatch);
}

if(module.hot) {
  // Called after every change.
  // Use window globals to keep track of old state.
  module.hot.accept();
  if (window.raf) loadRaf();
  if (window.store) window.store.replaceReducer(reducer);
  // NOTE: I might have to add controller in here
}
