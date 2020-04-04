const setControls = (dispatch) => {
  //TODO bette define
  const buttonAssignments = {
    moveRight: 0, //[button indices]
    moveLeft: 1,
  };

  const dispatchMiddleware = cb => dispatch(cb());
  Controls.addMiddleware(dispatchMiddleware);

  Controls.on({
    buttons: buttonAssignments.moveLeft,
    pressed: movement.pushingLeft,
    released: movement.stopping,
  });

  Controls.on({
    buttons: buttonAssignments.moveRight,
    pressed: movement.pushingRight,
    released: movement.stopping,
  });
};

// TODO: create this thing
const Controls = {
  on: ({ buttons, pressedCB, releasedCB }) => {},
  addMiddleware: callback => {},
};
