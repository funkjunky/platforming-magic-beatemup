import { level } from '../entities/level';
import * as Jump from '../entities/jump';
import * as Movement from '../entities/movement';

const { jumping, falling, grounded } = Jump.States;
const { pushingLeft, pushingRight, stopping } = Movement.States;

const c = {
  purple:     '#b35ce5',
  darkGreen:  '#2dab9a',
  blue:       '#65ecda',
  green:      '#17ff70',
  red:        '#ff3f3f',
  orange:     '#ffaf3f'
};

const groundedDuration = 300;
const getPlayerSprite = (sprites, entity, now) => {
  // TODO: this code is too dense. Find a way to abstract out pieces to remove context and simplify it
  const { jump, movement } = entity.states;
  const dir = Object.values(movement)[0].lastState || entity.props.vx < 0 ? pushingLeft : pushingRight;
  const getSprite = getGetSprite(now);
  if(jump[jumping]) {
    return sprites[dir].jumping.raising[0];

  } else if (jump[falling]) {
    return sprites[dir].jumping.falling[0];

  } else if (movement[pushingRight]) {
    // TODO: make sprite take an object, not a normal function, so it's more clear?? Maybe
    return getSprite(
      movement[pushingRight],
      // Need abs, because we could be pushing right, while sliding left (ie. -vx)
      96 * 96 / Math.floor(Math.abs(entity.props.vx), 1),
      sprites.pushingRight.running
    );

  } else if (movement[pushingLeft]) {
    return getSprite(
      movement[pushingLeft],
      96 * 96 / Math.floor(Math.abs(entity.props.vx), 1),
      sprites.pushingLeft.running
    );

  } else if (jump[grounded] && (now - jump[grounded].createdAt) < groundedDuration) {
    // TODO: make a landing animation and use it here instead IT should last groundedDuration
    const idleMsPerFrame = 500;
    return getSprite(
      movement[stopping],
      idleMsPerFrame,
      sprites[dir].idle,
    );

  } else if (movement[stopping]) {
    const idleMsPerFrame = 500;
    return getSprite(
      movement[stopping],
      idleMsPerFrame,
      sprites[dir].idle,
    );

  } else {
    console.error('NO GRAPHIC FOR STATE', movement, stopping, movement[stopping]);  
  }
};

const getGetSprite = now => (state, msPerFrame, sprites) => {
    const totalMs = now - state.createdAt
    const index = Math.floor(totalMs / msPerFrame) % sprites.length;
    return sprites[index];
};

export default (ctx, state, resources) => {
  const drawPerson = entity => {
    ctx.drawImage(getPlayerSprite(resources.sprites, entity, Date.now()), entity.props.x, entity.props.y);
  };

  //BEGIN ACTUAL GRAPHICS
  ctx.clearRect(0, 0, 640, 480);
  //default colour
  ctx.fillStyle = c.blue;

  level.forEach(block => ctx.fillRect(block.x, block.y, block.width, block.height));

  Object.values(state.entities).reverse().forEach(entity => {
    ctx.save();
    drawPerson(entity);
    ctx.restore();
  });
};
