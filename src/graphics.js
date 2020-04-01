const c = {
    purple:     '#b35ce5',
    darkGreen:  '#2dab9a',
    blue:       '#65ecda',
    green:      '#17ff70',
    red:        '#ff3f3f',
    orange:     '#ffaf3f'
};

const width = 5;

export default (ctx, state, dt) => {
    const drawPerson = (person, color = c.purple) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(person.x, person.y + 50);
        ctx.lineTo(person.x + 25, person.y);
        ctx.lineTo(person.x - 25, person.y);
        ctx.closePath();
        ctx.stroke();
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
