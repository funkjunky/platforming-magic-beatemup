import character from '../assets/character.png';

import { States } from './entities/movement';
const { pushingLeft, pushingRight } = States;

const loadResources = async () => {
  const image = new Image();

  console.log('about to loadframes');
  // specify resources, which will trigger the onload
  image.src = character;
  // TODO: grab 96 from somewhere, like index... or define it elsewhere
  const frames = await loadFrames({ image, count: 10, width: 96, height: 96 });

  return {
    sprites: {
      pushingRight: getSprites(frames, pushingRight),
      pushingLeft: getSprites(frames, pushingLeft),
    },
  }
};

const getSprites = (frames, direction) => ({
  idle: select(frames[direction], [0, 1]),
  slash: {
    windup: [frames[direction][2]],
    inmotion: [frames[direction][3]],
    recover: [frames[direction][5]], //opps, i ordered 4 and 5 wrong in the image
  },
  spell: {
    chargingup: [frames[direction][2]],
    casting: [frames[direction][4]],
  },
  running: select(frames[direction], [6, 7, 8]),
  jumping: {
    raising: [frames[direction][9]],
    crescendo: [frames[direction][9]],
    falling: [frames[direction][9]],
    landing: [frames[direction][9]],
  },
});

// this will make more sense when i add more frames to animations
const select = (arr, indices) => indices.map(i => arr[i]);

// TODO: rename image to rightFacingSpriteSheet
const loadFrames = ({ image, count, width, height }) => new Promise(resolve =>
  // TODO: create a range iterator
  image.onload = async () => {
    console.log('onload');
    const flippedImage = await getFlippedSprite(image);
    resolve({
      [pushingRight]: await Promise.all([...Array(count).keys()].map(i =>
        createImageBitmap(image, width * i, 0, width, height)
      )),
      [pushingLeft]: await Promise.all([...Array(count).keys()].map(i =>
        createImageBitmap(flippedImage, width * i, 0, width, height)
      ))
    })
  }
);

// TODO: do the flipping
const getFlippedSprite = image => {
  return image;
}

export default loadResources;
