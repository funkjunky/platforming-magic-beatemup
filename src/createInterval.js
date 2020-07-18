import soundUpdate from 'sounds/update';
import entitiesUpdate from 'gameLogic/entities/update';
import { incrementGameTime } from 'gameLogic/gameTime';
import controlsUpdate from 'controls/update';

export const createInterval = (globals) => {
  let lastTimestamp = Date.now();
  return setInterval(() => {
    const dt = Date.now() - lastTimestamp;
    lastTimestamp = Date.now();
    controlsUpdate(globals.appControls);
    if (!globals.store.getState().pause) {
      globals.store.dispatch(incrementGameTime(dt));
      controlsUpdate(globals.gameControls);
      entitiesUpdate(dt / 1000, globals.store.getState, globals.store.dispatch);
      soundUpdate(globals.store.getState(), globals.soundState);
    }
  }, 20);
};
