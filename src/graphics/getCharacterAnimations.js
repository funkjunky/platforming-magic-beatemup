const select = (arr, indices) => indices.map(i => arr[i]);

// TODO: i just removed the "direction", I gotta make sure this'll work like this
const getRightFacingCharacterAnimations = frames => ({
  idle: select(frames, [0, 1]),
  slash: {
    windup: [frames[2]],
    inmotion: [frames[3]],
    recover: [frames[5]], //opps, i ordered 4 and 5 wrong in the image
  },
  spell: {
    chargingup: [frames[2]],
    casting: [frames[4]],
    recover: [frames[5]], //opps, i ordered 4 and 5 wrong in the image
  },
  running: select(frames, [7, 8, 9, 8]),
  dashing: [frames[6]],
  jumping: {
    raising: [frames[10]],
    crescendo: [frames[10]],
    falling: [frames[10]],
    landing: select(frames, [11, 12, 1]),
  },
});

export default getCharacterAnimations;
