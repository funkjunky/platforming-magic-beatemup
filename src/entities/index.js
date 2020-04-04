import { combineReducers } from 'redux';

import state from './state';
import props from './props';

let _id = 0;

// TODO: figure out how to use toolkit
// Problem: toolkit doesn't allow an arbitrary reducer
// Problem: I don't think toolkit was designed to work with hierarchical reducers
// Solution: I think the only thing I'm missing is immer.
//  So just explicitly use immer, instead of forcing createSlice
//  Maybe use createSlice, but only use the pieces I need.

const entitiesReducer = (entities, action) => {
  if (action.type === 'entities/createEntity') {
    entities[_id++] = action.payload;
    return entities;
  } else if(action.entity) {
    // mutate the entity TODO: use immer
    entities[action.entity.id] = combineReducers({
      state,
      props
    })(entities[action.entity.id], action);
  } else {
    // initialState
    return {};
  }
}

export default entitiesReducer;
export const createEntity = entity => ({
  type: 'entities/createEntity',
  payload: {
    id: _id,
    ...entity,
  },
});
