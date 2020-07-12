import { combineReducers } from '../combineReducers';
import movement, * as Movement from '../states/movement';
import boundingBoxes from '../basicBoundingBoxes';
import { updateProps } from '../index';
import { doBoxesIntersect } from '../../doBoxesIntersect';

const { pushingRight } = Movement.States;

const fireballDefinition = {
  type: 'fireball',
  stateReducer: combineReducers({ movement }),
  boundingBoxes,
  updateProps: (entity, dt, dispatch) => {
    const { props: { x, y, speed }, states: { movement } } = entity;

    // TODO: just awful logic
    const vx = movement[pushingRight] ? speed : -speed; //i dunno... is it in the conjure?
    dispatch(updateProps({ entity, newProps: { x: x + vx * dt, y } })); 
  },
  updateWorld: (self, state, dt, dispatch) => {
    // TODO: too separated from the logic in fireball generator...
    Object.values(state.entities).forEach(entity =>
      entity.id != self.id
      && doBoxesIntersect(self, entity)
      && dispatch(updateProps({ entity: self, newProps: { collidedWith: entity } }))
    );
  },
};

export default fireballDefinition;
