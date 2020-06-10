import { combineReducers } from 'redux';

import entities from './entities';
import gameTime from './gameTime';
import pause from './pause';

export default combineReducers({
  entities,
  gameTime,
  pause,
});
