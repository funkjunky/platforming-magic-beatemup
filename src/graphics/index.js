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
// TODO: add a grounded sprite, for when "grounded" is new, ie. now - createdAt < 300
const getPlayerSprite = (sprites, entity) => {
  // TODO: this code is too dense. Find a way to abstract out pieces to remove context and simplify it
  const { jump, movement } = entity.states;
  const dir = entity.props.vx < 0 ? 'left' : 'right';
  if(jump[Jump.States.jumping]) {
    return sprites[dir].jumping.raising[0];
  } else if (jump[falling]) {
    return sprites[dir].jumping.falling[0];
    // TODO: pass in Date.now(), to make this function idempotent
  } else if (jump[grounded] && (Date.now() - jump[grounded].createdAt) < groundedDuration) {
    return sprites[dir].jumping.landing[0];
  } else if (movement[pushingRight]) {
    console.log(sprites.left.running.length);
    // TODO: make sprite take an object, not a normal function, so it's more clear?? Maybe
    return getSprite(
      movement[pushingRight],
      500 - entity.props.vx * 4, // TODO: this math seems meh... probably need to NOT use msPerFrame. Need to base on the nominator
      sprites.right.running
    );
  } else if (movement[pushingLeft]) {
    return getSprite(
      movement[pushingLeft],
      500 + entity.props.vx * 4, // TODO: this math seems meh... probably need to NOT use msPerFrame. Need to base on the nominator
      sprites.left.running
    );
  } else if (movement[stopping]) {
    const idleMsPerFrame = 500;
    return getSprite(
      movement[stopping],
      idleMsPerFrame,
      sprites.left.idle,
    );
  } else {
    console.error('NO GRAPHIC FOR STATE', movement, stopping, movement[stopping]);  
  }
};

const getSprite = (state, msPerFrame, sprites) => {
    // TODO: pass in Date.now(), to make this function idempotent
    const totalMs = Date.now() - state.createdAt
    const index = Math.floor(totalMs / msPerFrame) % sprites.length;
    return sprites[index];
};

export default (ctx, state, resources) => {
  const drawPerson = entity => {
    // TODO: look into anchor, my char probably isn'tanchored propertly
    ctx.drawImage(getPlayerSprite(resources.sprites, entity), entity.props.x, entity.props.y);
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
