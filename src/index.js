import 'regenerator-runtime/runtime.js';
import 'end-polyFills';

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import { createEntity } from './entities';
import reducer from './reducer.js';
import { replaceAllTheModules, setUpdate, loadRaf } from './bootstrap';
import { setControls } from './controls';
import getLogger from './getLogger';
import { characterWidth } from './loadResources';
import defaultMapping from './controls/defaultMapping';

document.addEventListener('DOMContentLoaded', firstLoad);

export const player1 = { id: 'player1' };

async function firstLoad() {
  const logger = getLogger();
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  window.store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(
      thunk,
      logger.middleware,
    )),
  );

  // load request animation frame
  loadRaf();

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

  window.controlsInterval = setControls(defaultMapping, window.store.dispatch);
  window.updateInterval = setUpdate();
}

if(module.hot) {
  module.hot.accept();
  replaceAllTheModules();
}
