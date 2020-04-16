import { updateProps } from './entities';
import { update } from './lastUpdated';

// returns middleware and a function to change the filters
// This is an opinionated logger for my use for this game
const logger = () => {
  let filters = {};
  const actions = [];
  const filter = action =>
    // TODO: use type insteadof toString??
    (filters.includeUpdate || action.type !== updateProps.toString())
    && (filters.includeLastUpdated || action.type !== update.toString());
  
  let oldCount = actions.length;

  return {
    middleware: store => next => action => {
      actions.push(action);
      const oldResult = store.getState();
      const result = next(action);
      // TODO: maybe clone the result andold result before putting it in getDiff or maybe just copy and freeze?? I dunno...
      //const diff = getDiff(result, oldResult);
      const filteredActions = actions.filter(filter);
      if (oldCount !== filteredActions.length) {
        // TODO: also do this hen filters change. Consider my above restriction on updating logger
        document.getElementById('logger').innerHTML = JSON.stringify(filteredActions, null, 2);
      }
      oldCount = filteredActions.length;
    },
    changeFilters: _filters => filters = _filters,
  };
};

const getDiff = (newObj, oldObj) => {
  return {
    new: getNewDiff(newObj, oldObj),
    old: getOldDiff(newObj, oldObj),
  };
}

const getNewDiff = (newVar, oldVar) => {
  // Note: we can do this because our data is immutible
  if (newVar !== oldVar) {
    if (typeof newVar !== 'object' || typeof oldVar !== 'object') return newVar;
    else {
      return Object.entries(newVar).reduce((newObj, [key, value]) => {
        const res = getNewDiff(value, oldVar[key]);
        if (res)  return { ...newObj, [key]: res };
        else      return newObj;
      }, {});
    }
  }
}

// TODO: maybe i should do new and old in one function and build up the objects by reference?
const getOldDiff = (newVar, oldVar) => {
  // Note: we can do this because our data is immutible
  if (newVar !== oldVar) {
    if (typeof newVar !== 'object' || typeof oldVar !== 'object') return oldVar;
    else {
      return Object.entries(newVar).reduce((oldObj, [key, value]) => {
        const res = getOldDiff(value, oldVar[key]);
        if (res)  return { ...oldObj, [key]: res };
        else      return oldObj;
      }, {});
    }
  }
}


export default logger;
