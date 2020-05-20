import loadResources from '../loadResources';
import graphics from '../graphics';
import { entityDefinitions } from '../entities';
import { updateCurrentFrame, updateLastFrame } from '../time';
import reducer from '../reducer';
import { setControls, getControls } from '../controls';
import { cleanupAction } from '../cleanupAction';
import defaultControlsIndex from '../controls/defaultMapping';  // TODO: rename so it's consistent
import soundUpdate from '../soundUpdate';
import createSoundState from '../createSoundState';

// NOTE: this file and /index should be the only files using the window global
const step = (ctx, resources) => dt => {
  graphics(ctx, window.store.getState(), resources, dt);
  window.raf = window.requestAnimationFrame(step(ctx, resources));
};

export const loadRaf = resources => {
  const ctx = document.querySelector('canvas').getContext('2d');
  if (window.raf) window.cancelAnimationFrame(window.raf);
  window.raf = window.requestAnimationFrame(step(ctx, resources));
};

export const gameUpdate = ({ entities, time }, dispatch) => {
  const dt = (time.currentFrame - time.lastFrame) / 1000;
  Object.values(entities).forEach(entity =>
    entityDefinitions[entity.type].update(entity, dt, dispatch));
  dispatch(cleanupAction())
};

const xor = (a, b) => a && !b || b && !a;
const controlsUpdate = ({ axisListeners, buttonListeners }) => {
  if (!navigator.getGamepads()[0]) return;

  // TODO: AFTER the intensity update, see if I can combine the listeners.
  const changedAxis = axisListeners.filter(a => xor(a.active, a.axis(navigator.getGamepads()[0].axes)));
  // change active state
  changedAxis.forEach(a => a.active = !a.active);
  // trigger listeners
  changedAxis.filter(a => !a.active).forEach(a => a.release());
  changedAxis.filter(a => a.active).forEach(a => a.press());

  const changedButton = buttonListeners.filter(a => xor(a.active, navigator.getGamepads()[0].buttons[a.button].pressed));
  // change active state
  changedButton.forEach(a => a.active = !a.active);
  // trigger listeners
  changedButton.filter(a => !a.active).forEach(a => a.release());
  changedButton.filter(a => a.active).forEach(a => a.press());
}

export const createInterval = () => setInterval(() => {
  // TODO: we don't want to register game actions, while paused... BUT we need to get access to the pause button
  // Further, how will we do menus in the pause mode?
  controlsUpdate(window.controls);
  if (!window.store.getState().pause) {
    window.store.dispatch(updateCurrentFrame(Date.now()));
    gameUpdate(window.store.getState(), window.store.dispatch)
    soundUpdate(window.store.getState(), window.soundState)
    window.store.dispatch(updateLastFrame(Date.now()));
  }
}, 20);

export const replaceAllTheModules = async () => {
  // TODO: really, if any of these are true, they're all true, I should make that more clear, with a single conditional.
  if (window.raf) {
    const resources = await loadResources(window.audioContext);
    window.soundState = createSoundState(resources.sounds, window.audioContext);
    // TODO: only pass sprites, not the whole objet that includes sounds
    loadRaf(resources);
  }

  if (window.store) {
    window.store.replaceReducer(reducer);
    window.controls = getControls();
    setControls(window.controls, defaultControlsIndex, window.store.dispatch);
  }

  if (window.interval) {
    clearInterval(window.interval);
    window.interval = createInterval();
  }
}
