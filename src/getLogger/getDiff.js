export const getDiff = (newObj, oldObj) => {
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
