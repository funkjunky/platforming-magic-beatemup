import 'regenerator-runtime/runtime.js';
import 'end-polyFills';

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import { createEntity } from './entities';
import reducer from './reducer.js';
import { replaceAllTheModules, createInterval, loadRaf } from './bootstrap';
import { getControls, setControls } from './controls';
import getLogger from './getLogger';
import loadResources, { characterWidth } from './loadResources';
import defaultMapping from './controls/defaultMapping';
import { createSoundState } from './createSoundState';

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

  // define controls
  window.controls = getControls();
  setControls(window.controls, defaultMapping, window.store.dispatch);

  // TODO: make this NOT global, soundState should be the global thing??
  window.audioContext = new AudioContext(); //like canvas.getContext. It's a singleton generally.
  const resources = await loadResources(window.audioContext);
  // create soundState
  window.soundState = createSoundState(resources.sounds, window.audioContext);
  // load request animation frame
  loadRaf(resources);

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

  window.interval = createInterval();
}

if(module.hot) {
  module.hot.accept();
  replaceAllTheModules();
}
