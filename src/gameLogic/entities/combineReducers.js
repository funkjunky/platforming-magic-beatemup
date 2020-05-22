// combining based on immer.
export const combineReducers = reducers => (draftState, action) =>
  Object.entries(reducers).forEach(([name, reducer]) => {
    draftState[name] = reducer(draftState[name], action)
  });

