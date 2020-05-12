import character from '../assets/character.png';

import { States } from './entities/states/movement';
const { pushingLeft, pushingRight } = States;

export const characterWidth = 96;

const loadResources = async () => {
  const rightFacingImage = new Image();

  console.log('about to loadframes');
  // specify resources, which will trigger the onload
  rightFacingImage.src = character;
  const frames = await loadFrames({ rightFacingImage, count: 13, width: characterWidth, height: characterWidth });

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
  running: select(frames[direction], [7, 8, 9, 8]),
  dashing: [frames[direction][6]],
  jumping: {
    raising: [frames[direction][10]],
    crescendo: [frames[direction][10]],
    falling: [frames[direction][10]],
    landing: select(frames[direction], [11, 12, 1]),
  },
});

// this will make more sense when i add more frames to animations
const select = (arr, indices) => indices.map(i => arr[i]);

const loadFrames = ({ rightFacingImage, count, width, height }) => new Promise(resolve =>
  // TODO: create a range iterator
  rightFacingImage.onload = async () => {
    console.log('onload');
    const flippedImage = await getFlippedSprite(rightFacingImage);
    resolve({
      [pushingRight]: await Promise.all([...Array(count).keys()].map(i =>
        createImageBitmap(rightFacingImage, width * i, 0, width, height)
      )),
      [pushingLeft]: (await Promise.all([...Array(count).keys()].map(i =>
        createImageBitmap(flippedImage, width * i, 0, width, height)
      ))).reduce((reversed, v) => ([ v, ...reversed ]), [])
    })
  }
);

const getFlippedSprite = image => {
  const c = document.createElement('canvas');
  c.width = image.width;
  c.height= image.height;
  const ctx = c.getContext('2d');
  ctx.scale(-1, 1);
  ctx.drawImage(image, -image.width, 0);
  const img = new Image();
  img.src = c.toDataURL();
  return img;
}

export default loadResources;
