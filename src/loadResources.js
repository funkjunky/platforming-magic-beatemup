import character from '../assets/character.png';

const loadResources = async () => {
  const image = new Image();

  console.log('about to loadframes');
  // specify resources, which will trigger the onload
  image.src = character;
  // TODO: grab 96 from somewhere, like index... or define it elsewhere
  const frames = await loadFrames({ image, count: 10, width: 96, height: 96 });

  return {
    sprites: {
      idle: select(frames, [0, 1]),
      slash: {
        windup: [frames[2]],
        inmotion: [frames[3]],
        recover: [frames[5]], //opps, i ordered 4 and 5 wrong in the image
      },
      spell: {
        chargingup: [frames[2]],
        casting: [frames[4]],
      },
      running: select(frames, [6, 7, 8]),
      jumping: {
        raising: [frames[9]],
        crescendo: [frames[9]],
        falling: [frames[9]],
      },
    }
  }
};

// this will make more sense when i add more frames to animations
const select = (arr, indices) => indices.map(i => arr[i]);

const loadFrames = ({ image, count, width, height }) => new Promise(resolve =>
  // TODO: create a range iterator
  image.onload = async () => {
    console.log('onload');
    resolve(await Promise.all([...Array(count).keys()].map(i =>
      createImageBitmap(image, width * i, 0, width, height)
    )))
  }
);

export default loadResources;
