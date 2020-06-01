import boundingBoxes from '../basicBoundingBoxes';
import { takeDamage } from '../entities';
import { updateProps } from '../index';

// TODO: available props should be defined here...
//  as well as perhaps how the entity can be interacted with.
//  Like taking damage.
const aoeEffectDefinition = {
  type: 'aoeEffect',
  stateReducer: () => {},
  boundingBoxes,
  update: (entity, dt, dispatch) => {
    dispatch(updateProps({ entity, newProps: { sTillTick: entity.props.sTillTick - dt } }));
  },
  // TODO: dt should probably be in ms, not seconds... in other update, just convert ms to seconds
  updateWorld: (self, state, dt, dispatch) => {
    if (self.props.sTillTick <= 0) {
      dispatch(takeDamage({ area: self, dmg: self.props.dmgPerTick }));
      dispatch(updateProps({ entity: self, newProps: { sTillTick: self.props.sPerTick + self.props.sTillTick } }));
    }
  },
};

export default aoeEffectDefinition;
