import soundUpdate from 'sounds/update';
import gameUpdate from 'gameLogic/update';
import { updateCurrentFrame, updateLastFrame } from 'gameLogic/time';
import controlsUpdate from 'controls/update';

export const createInterval = (globals) => setInterval(() => {
  controlsUpdate(globals.appControls);
  if (!globals.store.getState().pause) {
    globals.store.dispatch(updateCurrentFrame(Date.now()));
    controlsUpdate(globals.gameControls);
    gameUpdate(globals.store.getState(), globals.store.dispatch)
    soundUpdate(globals.store.getState(), globals.soundState)
  }
  globals.store.dispatch(updateLastFrame(Date.now()));
}, 20);

