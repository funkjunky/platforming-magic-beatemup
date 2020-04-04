import { level } from './level';

const c = {
  purple:     '#b35ce5',
  darkGreen:  '#2dab9a',
  blue:       '#65ecda',
  green:      '#17ff70',
  red:        '#ff3f3f',
  orange:     '#ffaf3f'
};

export default (ctx, state, resources) => {
  const drawPerson = person => {
    // TODO: look into anchor, my char probably isn'tanchored propertly
    ctx.drawImage(resources.sprites.running[0], person.x, person.y);
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
