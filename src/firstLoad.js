import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createYieldEffectMiddleware } from 'redux-yield-effect';
import { tickMiddleware, resumeTicks } from 'effect-tick';
import metaSelector from 'redux-meta-selector';

import reducer from 'gameLogic/reducer.js';
import getLogger from 'getLogger';
import { characterWidth } from './loadResources';
import { loadResourcesAndLoops } from './bootstrap';

import { createEntity } from 'gameLogic/entities';

export const player1 = { id: 'player1' };

async function firstLoad() {

  const logger = getLogger();

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  window.store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(
      thunk,
      createYieldEffectMiddleware(),
      tickMiddleware(),
      metaSelector,
      logger.middleware,
    )),
  );
  window.store.dispatch(resumeTicks());

  // create the first player entity
  const firstPlayer = {
    props: {
      x: characterWidth * 3,
      y: characterWidth,
      height: characterWidth,
      width: characterWidth,
    },
    type: 'player',
    id: player1.id,
  };
  window.store.dispatch(createEntity(firstPlayer));

  loadResourcesAndLoops(window);
}

export default firstLoad;
