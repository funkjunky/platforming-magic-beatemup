const c = {
  purple:     '#b35ce5',
  darkGreen:  '#2dab9a',
  blue:       '#65ecda',
  green:      '#17ff70',
  red:        '#ff3f3f',
  orange:     '#ffaf3f'
};

const width = 5;

export default (ctx, state, resources, dt) => {
  const drawPerson = person => {
    // TODO: look into anchor, my char probably isn'tanchored propertly
    ctx.drawImage(resources.sprites.idle[0], person.x, person.y);
  };

  //BEGIN ACTUAL GRAPHICS
  ctx.clearRect(0, 0, 640, 480);
  //default colour
  ctx.fillStyle = c.blue;

  Object.values(state.entities).reverse().forEach(entity => {
    ctx.save();
    drawPerson(entity);
    ctx.restore();
  });
};
