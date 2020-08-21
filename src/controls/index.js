import { pauseTicks } from 'effect-tick';

import { pushingLeft, pushingRight, stopping } from 'gameLogic/entities/states/movement';
import { dashing, notdashing } from 'gameLogic/entities/states/dash';
import { falling } from 'gameLogic/entities/states/jump';
import castFireball from 'gameLogic/generators/fireball';
import { swingSword } from 'gameLogic/generators/sword';
import { jump } from 'gameLogic/generators/jump';
import Player from 'gameLogic/entities/player';
import { togglePause } from 'gameLogic/pause';
import { player1 } from './index';

// returns the entity, enhanced with a `createdAgo` function that gives how long a state has been active (undefined if not exist)
const entitySelector = getState => id => () => {
  const entity = getState().entities[id];

  return {
    ...entity,
    createdAgo: state => entity.states[state]
      && getState().gameTime - entity.states[state].createdAt,
  };
};

export const setGameControls = (Controls, controllerMap, { dispatch, getState }) => {
  const player1Selector = () => entitySelector(getState)(player1.id);

  const tryAction = action =>
    Player.allowedToDispatch(action.type, player1Selector())
      && dispatch(action({ entity: player1Selector }));
  const tryGenerator = (generator, attrs) =>
    Player.allowedToDispatch(generator.name, player1Selector())
      && dispatch(generator(player1Selector, attrs));

  Controls.onAxis({
    axis: axis => axis[0] < 0,
    press: tryAction(pushingLeft),
    release: tryAction(stopping),
  });

  Controls.onAxis({
    axis: axis => axis[0] > 0,
    press: tryAction(pushingRight),
    release: tryAction(stopping),
  });

  Controls.on({
    button: controllerMap.jump,
    press: tryGenerator(jump),
    // TODO: ALSO cancel jump generator
    release: tryAction(falling),
  });

  Controls.on({
    button: controllerMap.dash,
    press: tryAction(dashing),
    release: tryAction(notdashing),
  });

  Controls.on({
    button: controllerMap.fireball,
    press: () => {},
    release: () => tryGenerator(castFireball),
    // TODO: add charging to cast, release to cancel.
  });

  Controls.on({
    button: controllerMap.swing,
    press: () => {},
    // TODO: it'd be cool if press started wind up, and release let the swing go.
    //      while winding up and holding it, you're slower, BUT it means you can release your attack whenever you want.
    release: () => tryGenerator(swingSword),
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
