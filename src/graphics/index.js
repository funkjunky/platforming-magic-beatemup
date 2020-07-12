import * as Jump from 'gameLogic/entities/states/jump';
import * as Movement from 'gameLogic/entities/states/movement';
import * as Dash from 'gameLogic/entities/states/dash';
import * as Conjure from 'gameLogic/entities/states/conjure';

const { jumping, falling, grounded } = Jump.States;
const { pushingLeft, pushingRight, stopping } = Movement.States;
const { dashing } = Dash.States;
const { conjuring, casting, recovering, ready } = Conjure.States;

const c = {
  purple:     '#b35ce5',
  darkGreen:  '#2dab9a',
  blue:       '#65ecda',
  green:      '#17ff70',
  red:        '#ff3f3f',
  orange:     '#ffaf3f'
};

const getDir = movement => {
  // TODO: bug: we can flukily get stopping.lastState = stopping... I need to patch that, So i can remove that condition.
  if (movement[stopping] && movement[stopping].lastState !== stopping) return movement[stopping].lastState;
  else return movement[pushingRight] ? pushingRight : pushingLeft;
}

const groundedDuration = 300;
const getPlayerSprite = (sprites, entity, now) => {
  // TODO: this code is too dense. Find a way to abstract out pieces to remove context and simplify it
  const { jump, movement, dash, conjure } = entity.states;
  const dir = getDir(movement);
  const getSprite = getGetSprite(now);
  if (conjure[conjuring]) {
    // TODO: name sprites the same as their states
    return sprites[dir].spell.chargingup[0];
  } else if (conjure[casting]) {
    return sprites[dir].spell.casting[0];
  } else if (conjure[recovering]) {
    return sprites[dir].spell.recover[0];
  } else if(jump[jumping]) {
    return sprites[dir].jumping.raising[0];
  } else if (jump[falling]) {
    return sprites[dir].jumping.falling[0];

  } else if (dash[dashing]) {
    return sprites[dir].dashing[0];

  } else if (movement[pushingRight] || movement[pushingLeft]) {
    // TODO: make sprite take an object, not a normal function, so it's more clear?? Maybe
    return getSprite(
      movement[dir],
      // Need abs, because we could be pushing right, while sliding left (ie. -vx)
      96 * 96 / Math.floor(Math.abs(entity.props.vx), 1),
      sprites[dir].running
    );
  } else if (jump[grounded] && (now - jump[grounded].createdAt) < groundedDuration) {
    const groundedMsPerFrame = groundedDuration / 3;
    return getSprite(
      jump[grounded],
      groundedMsPerFrame,
      sprites[dir].jumping.landing,
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

export default (ctx, state, sprites) => {
  const drawPerson = entity => {
    ctx.drawImage(getPlayerSprite(sprites, entity, window.store.getState().gameTime), entity.props.x, entity.props.y);
  };
  const drawFireball = entity => {
    ctx.fillStyle = c.red;
    ctx.beginPath();
    ctx.arc(entity.props.x, entity.props.y, entity.props.radius, 0, 2 * Math.PI);
    ctx.fill();
  };
  const drawAoeEffect = entity => {
    ctx.fillStyle = c.red;
    ctx.globalAlpha = 0.5;
    ctx.fillRect(entity.props.x, entity.props.y, entity.props.width, entity.props.height);
  };

  //BEGIN ACTUAL GRAPHICS
  ctx.clearRect(0, 0, 960, 540);
  //default colour
  ctx.fillStyle = c.blue;

  Object.values(state.entities).reverse().forEach(entity => {
    ctx.save();
    switch (entity.type) {
      case 'player':
      case 'doppleganger':
        drawPerson(entity);
        break;
      case 'fireball':
        drawFireball(entity);
        break;
      case 'aoeEffect':
        drawAoeEffect(entity);
        break;
      case 'block':
        ctx.fillRect(entity.props.x, entity.props.y, entity.props.width, entity.props.height);
        break;
      default:
    }
    ctx.restore();
  });

  if (state.pause) {
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = c.orange;
    ctx.fillRect(0, 0, 960, 540);
    ctx.globalAlpha = 1.0;
    ctx.fillStyle = c.darkGreen;
    ctx.textAlign = 'center';
    ctx.fillText('PAUSE', 480, 270);
  }

  // printing character position:
  ctx.font = "20px Georgia";
  ctx.textAlign = 'left';
  Object.values(state.entities).filter(({ type }) => type === 'fireball').forEach((fireball, i) =>
    ctx.fillText('X, Y: ' + fireball.props.x + ', ' + fireball.props.y, 20, 20 + 40 * i)
  );
};
