export const createSoundState = (sounds, audioContext) => {
  const playingSounds = {}; // sounds[label][owner.id]

  const soundState = {
    getPlayingSounds: () => playingSounds,
    registerSound: async (label, owner, state, now) => {
      // TODO: put dashSound in loadResource

      // createBufferSource plays the sound
      const sampleSource = audioContext.createBufferSource();
      sampleSource.buffer = sounds[label];
      sampleSource.connect(audioContext.destination);
      sampleSource.start(0, now - state.createdAt);

      if (!sounds[label]) sounds[label] = {};
      sounds[label][owner.id] = {
        state,
        sampleSource,
      };
    },
    unregisterSound: (label, owner) => {
      //sounds[label][owner.id].sampleSource.stop();
      delete sounds[label][owner.id];
    },
  };
  return soundState;
};
