import loadResources from './loadResources';
import { setGameControls, setAppControls, getControls } from 'controls';
import defaultControlsIndex from 'controls/defaultControlsIndex';
import createSoundState from 'sounds/createSoundState';
import { loadRaf } from 'graphics/loadRaf';
import { createInterval } from './createInterval';
import { player1 } from './index';

export const loadResourcesAndLoops = async globals => {
    const audioContext = new AudioContext(); //like canvas.getContext. It's a singleton generally.
    const resources = await loadResources(audioContext);
    globals.soundState = createSoundState(resources.sounds, audioContext);
    loadRaf(resources.sprites, globals.store.getState);
  // TODO: should i combine getControls and setControls??
    globals.gameControls = getControls();
    globals.appControls = getControls();
    const getPlayer1 = () => globals.store.getState().entities[player1.id];
    setGameControls(globals.gameControls, defaultControlsIndex, globals.store.dispatch, getPlayer1);
    setAppControls(globals.appControls, defaultControlsIndex, globals.store.dispatch);

    globals.interval = createInterval(globals);
}
