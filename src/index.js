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

document.addEventListener('DOMContentLoaded', start);

const setRAF = resources => window.raf = window.requestAnimationFrame(step(resources));

const step = resources => dt => {
  graphics(window.ctx, window.store.getState(), resources, dt);
  window.requestAnimationFrame(step(resources));
};

let a = 0;

console.log('modue.hot: ', module.hot);
if(module.hot) {
  console.log('called: ', ++a);
  //module.hot.accept(async () => {
  module.hot.accept('./graphics.js', async () => {
  // TODO: if this ever gets slower,
  // then look into doing intelligent reloading based on what changed.
    console.log('window raf: ', window.raf);
    window.store.replaceReducer(reducer);
    window.cancelAnimationFrame(window.raf);

    // do this after, so it doesn't delay the other things from loading.
    // TODO: do this more intelligently... so only if resources have changed.
    const resources = await loadResources();
    console.log('setting new raf');
    setRAF(resources);
    setupController();
  });
}

async function start() {
  const resources = await loadResources();
  console.log('resources: ', resources);

  window.store = createStore(
    reducer,
    applyMiddleware(
      createYieldEffectMiddleware(),
      tickMiddleware,
      metaSelector
    ),
  );
  window.store.dispatch(resumeTicks());

  window.ctx = document.querySelector('canvas').getContext('2d');
  setRAF(resources);

  window.store.dispatch(createEntity({ x: 50, y: 480 - 96 }));

  setupController();
}

const setupController = () => {
  // setup controls
  // TODO: move somewhere else????
  window.addEventListener('gamepadconnected', e => {
    console.log('gamepad connected: ', e.gamepad);
  });
}
