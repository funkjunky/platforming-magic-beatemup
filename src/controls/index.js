import { pushingLeft, pushingRight, stopping } from 'gameLogic/entities/states/movement';
import { dashing, notdashing } from 'gameLogic/entities/states/dash';
import { jumping, falling } from 'gameLogic/entities/states/jump';
// TODO: plaer1 is awkward
import { player1 } from '../index';
import Player from 'gameLogic/entities/player';
import { togglePause } from 'gameLogic/pause';

export const setGameControls = (Controls, controllerMap, dispatch) => {
  const playerAction = action => () =>
    dispatch(Player.actionsFilter(action(player1)));

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

  return Controls;
};

export const setAppControls = (Controls, controllerMap, dispatch) => {
  Controls.on({
    button: controllerMap.pause,
    press: () => {
      // TODO: this is a hack. I need to handle sounds better
      window.soundState.unregisterAllSounds();
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
