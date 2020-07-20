import boundingBoxes from '../basicBoundingBoxes';
import { updateProps } from '../index';

//import { type as dopplegangerType } from '../doppleganger';

// TODO: available props should be defined here...
//  as well as perhaps how the entity can be interacted with.
//  Like taking damage.
const aoeEffectDefinition = {
  type: 'aoeEffect',
  stateReducer: () => {},
  boundingBoxes,
  collidesWith: {
    ['doppleganger']: {
      how: () => false,
    },
  },
  updateProps: (entity, dt, dispatch) => {
    dispatch(updateProps({ entity, newProps: { sTillTick: entity.props.sTillTick - dt } }));
  },
  // TODO: dt should probably be in ms, not seconds... in other update, just convert ms to seconds
  updateWorld: (self, state, dt, dispatch) => {
    if (self.props.sTillTick <= 0) {
      // TODO: should this be in the generator???? Yeah probably..
      //      different aoe effects will do different things, some won't tick at all!
      //      [I think this effects the graphics... so don't remove without thought]
      dispatch(updateProps({ entity: self, newProps: { sTillTick: self.props.sPerTick + self.props.sTillTick } }));
    }
  },
};

export default aoeEffectDefinition;
