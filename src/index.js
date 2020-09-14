import 'regenerator-runtime/runtime.js';
import 'end-polyFills';

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createRyeMiddleware } from 'rye-middleware';
import { tickMiddleware, resumeTicks } from 'effect-tick';
import metaSelector from 'redux-meta-selector';

import { createEntity } from 'gameLogic/entities';
import reducer from 'gameLogic/reducer.js';
import { loadResourcesAndLoops } from './bootstrap';
import getLogger from 'getLogger';
import { characterWidth } from './loadResources';
import spawnEnemiesLevel1 from 'gameLogic/generators/spawnEnemies';
import { togglePause } from 'gameLogic/pause';
import createLevel from './createLevel';

export const player1 = { id: 'player1' };

document.addEventListener('DOMContentLoaded', firstLoad);

async function firstLoad() {
  const logger = getLogger();
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  window.store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(
      thunk,
      createRyeMiddleware(),
      tickMiddleware, //might be screwing up things...
      metaSelector,
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
      maxHp: 24,
      hp: 24,
    },
    type: 'player',
    id: player1.id,
  }));

  window.store.dispatch(createLevel())

  window.store.dispatch(spawnEnemiesLevel1());

  let pausedBecauseOfVisibilityChange = false;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && !window.store.getState().pause) {
      window.store.dispatch(togglePause());
      pausedBecauseOfVisibilityChange = true;
    } else if (!document.hidden && pausedBecauseOfVisibilityChange) {
      // TODO: add a toggle to turn this off in options
      window.setTimeout(() => window.store.dispatch(togglePause()), 200);
      pausedBecauseOfVisibilityChange = false;
    }
  });

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
