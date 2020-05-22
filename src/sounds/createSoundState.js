const createSoundState = (sounds, audioContext) => {
  const playingSounds = {}; // sounds[label][owner.id]

  const soundState = {
    getPlayingSounds: () => playingSounds,
    registerSound: async (label, owner, state, now) => {
      // TODO: put dashSound in loadResource

      // createBufferSource plays the sound
      const sampleSource = audioContext.createBufferSource();
      sampleSource.buffer = sounds[label];
      sampleSource.connect(audioContext.destination);
      sampleSource.start(0, (now - state.createdAt) / 1000);

      if (!playingSounds[label]) playingSounds[label] = {};
      playingSounds[label][owner.id] = {
        state,
        sampleSource,
      };
    },
    unregisterSound: (label, owner) => {
      playingSounds[label][owner.id].sampleSource.stop();
      delete playingSounds[label][owner.id];
    },
    unregisterAllSounds: () => {
      Object.entries(playingSounds).forEach(([k, s]) => {
        Object.values(s).forEach(({ sampleSource }) => sampleSource.stop());
        delete playingSounds[k];
      });
    },
  };
  return soundState;
};

export default createSoundState;
