import 'regenerator-runtime/runtime.js';
import 'end-polyFills';

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createYieldEffectMiddleware } from 'redux-yield-effect';
import { tickMiddleware, resumeTicks } from 'effect-tick';

import { createEntity } from 'gameLogic/entities';
import reducer from 'gameLogic/reducer.js';
import { loadResourcesAndLoops } from './bootstrap';
import getLogger from 'getLogger';
import { characterWidth } from './loadResources';

document.addEventListener('DOMContentLoaded', firstLoad);

export const player1 = { id: 'player1' };

async function firstLoad() {
  const logger = getLogger();
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  window.store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(
      thunk,
      createYieldEffectMiddleware(),
      tickMiddleware, //might be screwing up things...
      logger.middleware,
    )),
  );
  window.store.dispatch(resumeTicks());

  // create the first player entity
  window.store.dispatch(createEntity({
    props: {
      x: characterWidth * 3,
      y: characterWidth,
      height: characterWidth,
      width: characterWidth,
    },
    type: 'player',
    id: player1.id,
  }));

  loadResourcesAndLoops(window);
}

if(module.hot) {
  module.hot.accept();

  // if this is an HMR and NOT the first load
  if (window.interval || window.raf || window.store) {
    window.cancelAnimationFrame(window.raf);
    window.store.replaceReducer(reducer);
    clearInterval(window.interval);
    loadResourcesAndLoops(window);
  }
}
