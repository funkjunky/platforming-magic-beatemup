import { pauseTicks } from 'effect-tick';

import { pushingLeft, pushingRight, stopping } from 'gameLogic/entities/states/movement';
import { dashing, notdashing } from 'gameLogic/entities/states/dash';
import { jumping, falling } from 'gameLogic/entities/states/jump';
import castFireball from 'gameLogic/generators/fireball';
import { swingSword } from 'gameLogic/generators/sword';
import Player from 'gameLogic/entities/player';
import { togglePause } from 'gameLogic/pause';

export const setGameControls = (Controls, controllerMap, dispatch, getPlayer1) => {
  const playerAction = action => () =>
    dispatch(Player.actionsFilter(action({ entity: getPlayer1() })));

  Controls.onAxis({
    axis: axis => axis[0] < 0,
    press: playerAction(pushingLeft),
    release: playerAction(stopping),
  });

  Controls.onAxis({
    axis: axis => axis[0] > 0,
    press: playerAction(pushingRight),
    release: playerAction(stopping),
  });

  Controls.on({
    button: controllerMap.jump,
    press: playerAction(jumping),
    release: playerAction(falling),
  });

  Controls.on({
    button: controllerMap.dash,
    press: playerAction(dashing),
    release: playerAction(notdashing),
  });

  Controls.on({
    button: controllerMap.fireball,
    press: () => {},
    // TODO: how do i use filterActions with generators? ie. only shoot while grounded
    release: () => dispatch(castFireball(getPlayer1)),
    // TODO: add charging to cast, release to cancel.
  });

  Controls.on({
    button: controllerMap.swing,
    press: () => {},
    // TODO: how do i use filterActions with generators? ie. only shoot while grounded
    // TODO: it'd be cool if press started wind up, and release let the swing go.
    //      while winding up and holding it, you're slower, BUT it means you can release your attack whenever you want.
    release: () => dispatch(swingSword(getPlayer1)),
    // TODO: add charging to cast, release to cancel.
  });

  return Controls;
};

export const setAppControls = (Controls, controllerMap, dispatch) => {
  Controls.on({
    button: controllerMap.pause,
    press: () => {
      // TODO: this is a hack. I need to handle sounds better
      window.soundState.unregisterAllSounds();
      dispatch(pauseTicks());
      //---------
      dispatch(togglePause());
    },
    release: () => {}, // TODO: release should be optional
  });
}

export const getControls = () => {
  const buttonListeners = [];
  const axisListeners = [];

  return {
    // I'm not a big fan of the naming,probably onpress and onrelease. Also active feels out fo place...
    onAxis: ({ axis, press, release }) => {
      axisListeners.push({ axis, press, release, active: 0 })
    },
    on: ({ button, press, release }) => {
      buttonListeners.push({ button, press, release, active: 0 });
    },
    buttonListeners,
    axisListeners,
  };
};
