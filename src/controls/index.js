import { pushingLeft, pushingRight, stopping } from '../entities/movement';

export const setControls = (dispatch) => {
  const [Controls, interval] = getControls();

  //TODO bette define
  /*
  const buttonAssignments = {
    moveRight: 0, //[button indices]
    moveLeft: 1,
  };
  */

  // TODO: uhhhhhh hacky...
  const playerEntity = { id: 'player1' };
  const dispatchMiddleware = entityStateAction => dispatch(entityStateAction(playerEntity));
  Controls.addMiddleware(dispatchMiddleware);

  Controls.onAxis({
    axis: axis => axis[0] < -0.5,
    press: pushingLeft,
    release: stopping,
  });

  Controls.onAxis({
    axis: axis => axis[0] > 0.5,
    press: pushingRight,
    release: stopping,
  });

  return interval;
};

const getControls = () => {
  const listeners = {};
  const axisListeners = [];
  const middleware = [];

  const registers = {
    // I'm not a big fan of the naming,probably onpress and onrelease. Also active feels out fo place...
    onAxis: ({ axis, press, release }) => {
      axisListeners.push({ axis, press, release, active: 0 })
      console.log('count: ', axisListeners.length);
    },
    on: ({ button, press, release }) => {
      listeners[button] = { press, release, active: 0 };
    },
    // TODO: add a remove, especially for HMR [perhaps a removeAll]
    addMiddleware: callback => middleware.push(callback),
  };

  // Is this the correct way to do middleware??? hmmmm maybe it should call the CB first?
  const applyMiddleware = (mw, cb) =>
    mw.length
      ? middleware.reduce((cb, mw) => mw(cb), cb)
      : cb();

  const xor = (a, b) => a && !b || b && !a;
  // poll for changes
  const interval = setInterval(() =>
    navigator.getGamepads()[0] && axisListeners.forEach(a => {
      if (xor(a.active, a.axis(navigator.getGamepads()[0].axes))) {
        a.active = !a.active;
        if(a.active) {
          applyMiddleware(middleware, a.press);
        } else {
          applyMiddleware(middleware, a.release);
        }
      }
    })
  , 10);
  // Note: if i put the poll above 10, then  going from right to left, will cause the stop to happen AFTER the left, causing the person to stop.
  //        I'll need to fix that before reducing the poll

  return [registers, interval];
};
