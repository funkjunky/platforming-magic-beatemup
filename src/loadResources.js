import character from 'assets/character.png';
import dash from 'assets/dash.wav';
import { States } from 'gameLogic/entities/states/movement';
import getSwordieSprites from './getSwordieSprites';
import loadSound from './loadSound';
import getFlippedFrame from './getFlippedFrame';

const { pushingLeft, pushingRight } = States;

export const characterWidth = 96;

const loadSounds = async audioContext => ({
  dash: await loadSound(audioContext, dash),
});

const loadResources = async audioContext => {
  const rightFacingImage = new Image();

  console.log('about to loadframes');
  // specify resources, which will trigger the onload
  rightFacingImage.src = character;
  const frames = await loadFrames({ rightFacingImage, count: 13, width: characterWidth, height: characterWidth });
  const swordieSprites = getSwordieSprites(frames);

  return {
    frames,
    sprites: {
      pushingRight: swordieSprites(pushingRight),
      pushingLeft: swordieSprites(pushingLeft),
    },
    sounds: await loadSounds(audioContext),
  }
};
//const flippedImage = await getFlippedFrame(rightFacingImage);
// .reduce((reversed, v) => ([ v, ...reversed ]), [])

// TODO: can I make a library functions to simplify this??
const loadFrames = ({ rightFacingImage, count, width, height }) =>
  new Promise(resolve =>
    rightFacingImage.onload = async () =>
      // TODO: create a range iterator
      resolve(await Promise.all([...Array(count).keys()].map(i =>
        createImageBitmap(rightFacingImage, width * i, 0, width, height)
      )))
);

// TODO: use this to ensure I can do load frames after the image has loaded,... rather than relying on an onLoad
// So.... I can write something like:
//  return splitImagesIntoFrames(await loadImage(rightFacingImage));
const imagesToLoad = new set();
const loadImage = image => new Promise(resolve => {
  if(imagesToLoad.exists(image)) {
    imagesToLoad.onLoad = () => resolve(image);
  } else {
    imagesToLoad.set(image);
    resolve(image);
  }
});

export default loadResources;
