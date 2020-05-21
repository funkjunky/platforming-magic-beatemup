import { combineReducers } from 'redux';

import entities from './entities';
import time from './time';
import pause from './pause';

export default combineReducers({
  entities,
  time,
  pause,
});
