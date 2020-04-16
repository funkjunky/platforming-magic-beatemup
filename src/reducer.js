import { combineReducers } from 'redux';

import entities from './entities';
import lastUpdated from './lastUpdated';

export default combineReducers({
  entities,
  lastUpdated,
});
