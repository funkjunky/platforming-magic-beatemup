const loadSound = async (audioContext, src) => {
  const res = await fetch(src);
  const arrayBuffer = await res.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return audioBuffer;
};

export default loadSound;
