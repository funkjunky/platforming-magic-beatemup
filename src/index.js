import 'regenerator-runtime/runtime.js';
import 'end-polyFills';

import reducer from 'gameLogic/reducer.js';
import { loadResourcesAndLoops } from './bootstrap';

import firstLoad from './firstLoad';

document.addEventListener('DOMContentLoaded', firstLoad);

if(module.hot) {
  module.hot.accept();

  // if this is an HMR and NOT the first load
  if (window.interval || window.raf || window.store) {
    window.cancelAnimationFrame(window.raf);
    window.store.replaceReducer(reducer);
    loadResourcesAndLoops(window);
  }
}
