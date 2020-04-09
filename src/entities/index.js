import { combineReducers } from 'redux';
import produce from 'immer';

import state from './state';
import props from './props';

let _id = 0;

// TODO: figure out how to use toolkit
// Problem: toolkit doesn't allow an arbitrary reducer
// Problem: I don't think toolkit was designed to work with hierarchical reducers
// Solution: I think the only thing I'm missing is immer.
//  So just explicitly use immer, instead of forcing createSlice
//  Maybe use createSlice, but only use the pieces I need.

const entitiesReducer = (entities, action) =>
  produce(entities, draft => {
    const { type, payload: entity } = action
    if (type === 'entities/createEntity') {
      draft[entity.id] = entity;
    } else if(entity) {
      draft[entity.id] = combineReducers({
        state,
        props,
      })(draft[entity.id], action);
    } else if(!entities) { //initialState
      return {};
    }
  });

export default entitiesReducer;
export const createEntity = entity => ({
  type: 'entities/createEntity',
  payload: {
    id: _id,
    ...entity,
  },
});
