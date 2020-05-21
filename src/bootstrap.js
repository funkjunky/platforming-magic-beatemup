import loadResources from './loadResources';
import { setControls, getControls } from 'controls';
import defaultControlsIndex from 'controls/defaultControlsIndex';
import createSoundState from 'sounds/createSoundState';
import { loadRaf } from 'graphics/loadRaf';
import { createInterval } from './createInterval';

export const loadResourcesAndLoops = async globals => {
    const audioContext = new AudioContext(); //like canvas.getContext. It's a singleton generally.
    const resources = await loadResources(audioContext);
    globals.soundState = createSoundState(resources.sounds, audioContext);
    loadRaf(resources.sprites, globals.store.getState);
    globals.controls = getControls();
    setControls(globals.controls, defaultControlsIndex, globals.store.dispatch);

    globals.interval = createInterval(globals);
}
