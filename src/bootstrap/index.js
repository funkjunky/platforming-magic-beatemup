import loadResources from '../loadResources';
import graphics from '../graphics';
import { entityDefinitions } from '../entities';
import { update } from '../lastUpdated';
import reducer from '../reducer';
import { setControls } from '../controls';
import { cleanupAction } from '../cleanupAction';

// NOTE: this file and /index should be the only files using the window global
const step = (ctx, resources) => dt => {
  graphics(ctx, window.store.getState(), resources, dt);
  window.raf = window.requestAnimationFrame(step(ctx, resources));
};

export const loadRaf = () => {
  loadResources().then(resources =>  {
    const ctx = document.querySelector('canvas').getContext('2d');
    if (window.raf) window.cancelAnimationFrame(window.raf);
    window.raf = window.requestAnimationFrame(step(ctx, resources));
  });
};

export const setUpdate = () => setInterval(() => {
  const { entities, lastUpdated } = window.store.getState();
  const dt = (Date.now() - lastUpdated) / 1000;
  Object.values(entities).forEach(entity =>
    entityDefinitions[entity.type].update(entity, dt, window.store.dispatch));
  window.store.dispatch(cleanupAction())
  // call cleanup
  window.store.dispatch(update(Date.now()));
}, 20);

export const replaceAllTheModules = () => {
  if (window.raf) loadRaf();
  if (window.store) window.store.replaceReducer(reducer);
  if (window.controlsInterval) {
    clearInterval(window.controlsInterval);
    window.controlsInterval = setControls(window.store.dispatch);
  }
  if (window.updateInterval) {
    clearInterval(window.updateInterval);
    window.updateInterval = setUpdate();
  }
}
