import 'regenerator-runtime/runtime.js';
import 'end-polyFills';

import { createStore, applyMiddleware } from 'redux';
import { createYieldEffectMiddleware } from 'redux-yield-effect';
import { put, fork, join } from 'redux-yield-effect/lib/effects';
import { tickMiddleware, resumeTicks, pauseTicks } from 'effect-tick';
import { createEntity } from './entities/index.js';
import reducer from './reducer.js';
import metaSelector from 'redux-meta-selector';
import loadResources from './loadResources';
import graphics from './graphics.js';

document.addEventListener('DOMContentLoaded', start);

const setRAF = resources => window.requestAnimationFrame(step(resources));

const step = resources => dt => {
  graphics(window.ctx, window.store.getState(), resources, dt);
  window.requestAnimationFrame(step(resources));
};

if(module.hot) {
  // TODO: if this ever gets slower,
  // then look into doing intelligent reloading based on what changed.
  module.hot.accept(() => {
    window.store.replaceReducer(reducer);
    window.cancelAnimationFrame(window.raf);

    // do this after, so it doesn't delay the other things from loading.
    // TODO: do this more intelligently... so only if resources have changed.
    const resources = loadResources();
    setRAF(resources);
  });
}

async function start() {
  console.log('loading...');
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
  store.dispatch(resumeTicks());

  window.ctx = document.querySelector('canvas').getContext('2d');
  setRAF(resources);

  store.dispatch(createEntity({ x: 100 }));
};
