import { pushingLeft, pushingRight, stopping } from '../entities/movement';
import { jumping, falling } from '../entities/jump';
import { player1 } from '../index';

export const setControls = (dispatch) => {
  const [Controls, interval] = getControls();

  const dispatchMiddleware = entityStateAction => dispatch(entityStateAction(player1));
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

  Controls.on({
    button: 0,
    press: jumping,
    release: falling,
  });

  return interval;
};

const getControls = () => {
  const buttonListeners = [];
  const axisListeners = [];
  const middleware = [];

  const registers = {
    // I'm not a big fan of the naming,probably onpress and onrelease. Also active feels out fo place...
    onAxis: ({ axis, press, release }) => {
      axisListeners.push({ axis, press, release, active: 0 })
    },
    on: ({ button, press, release }) => {
      buttonListeners.push({ button, press, release, active: 0 });
    },
    addMiddleware: callback => middleware.push(callback),
  };

  // Is this the correct way to do middleware??? hmmmm maybe it should call the CB first?
  const applyMiddleware = (mw, cb) =>
    mw.length
      ? middleware.reduce((cb, mw) => mw(cb), cb)
      : cb();

  const xor = (a, b) => a && !b || b && !a;
  // poll for changes
  const interval = setInterval(() => {
    if (!navigator.getGamepads()[0]) return;

    axisListeners.forEach(a => {
      if (xor(a.active, a.axis(navigator.getGamepads()[0].axes))) {
        a.active = !a.active;
        if(a.active) {
          applyMiddleware(middleware, a.press);
        } else {
          applyMiddleware(middleware, a.release);
        }
      }
    })

    buttonListeners.forEach(a => {
      if (xor(a.active, navigator.getGamepads()[0].buttons[a.button].pressed)) {
        a.active = !a.active;
        if(a.active) {
          applyMiddleware(middleware, a.press);
        } else {
          applyMiddleware(middleware, a.release);
        }
      }
    })
  }, 10);
  // Note: if i put the poll above 10, then  going from right to left, will cause the stop to happen AFTER the left, causing the person to stop.
  //        I'll need to fix that before reducing the poll

  return [registers, interval];
};
