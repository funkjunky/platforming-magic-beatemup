import 'regenerator-runtime/runtime.js';
import 'end-polyFills';

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import { createEntity } from './entities';
import reducer from './reducer.js';
import { replaceAllTheModules, setUpdate, loadRaf } from './bootstrap';
import { setControls } from './controls';
import getLogger from './getLogger';

document.addEventListener('DOMContentLoaded', firstLoad);

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
  const spriteWidth = 96;
  window.store.dispatch(createEntity({
    props: {
      x: spriteWidth * 3,
      y: spriteWidth,
    },
    type: 'player',
  }));

  // TODO: put the setControls in with the other interval. They should all be in the same interval.
  window.controlsInterval = setControls(window.store.dispatch);
  window.updateInterval = setUpdate();
}

if(module.hot) {
  module.hot.accept();
  replaceAllTheModules();
}
