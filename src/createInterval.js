import soundUpdate from 'sounds/update';
import gameUpdate from 'gameLogic/update';
import { updateCurrentFrame, updateLastFrame } from 'gameLogic/time';
import controlsUpdate from 'controls/update';

export const createInterval = (globals) => setInterval(() => {
  // TODO: we don't want to register game actions, while paused... BUT we need to get access to the pause button
  // Further, how will we do menus in the pause mode?
  controlsUpdate(globals.controls);
  if (!globals.store.getState().pause) {
    globals.store.dispatch(updateCurrentFrame(Date.now()));
    gameUpdate(globals.store.getState(), globals.store.dispatch)
    soundUpdate(globals.store.getState(), globals.soundState)
    globals.store.dispatch(updateLastFrame(Date.now()));
  }
}, 20);

