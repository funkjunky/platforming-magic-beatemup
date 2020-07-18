import { updateProps, pushCollidedWith, clearCollidedWith } from 'gameLogic/entities';
import { incrementGameTime } from 'gameLogic/gameTime';

export const getFilter = filters => ({ action }) =>
  // TODO: use type insteadof toString??
  (filters.includeUpdate || action.type !== updateProps.toString())
  && (filters.includeIncrementGameTime || action.type !== incrementGameTime.toString())
  && (filters.includeClearCollidedWith || action.type !== clearCollidedWith.toString())
  && (filters.includeCollidedWith || action.type !== pushCollidedWith.toString())
