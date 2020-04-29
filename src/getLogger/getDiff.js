export const getDiff = (newObj, oldObj) => {
  return {
    new: getXDiff(newObj, oldObj, newObj),
    old: getXDiff(newObj, oldObj, oldObj),
  };
}
const getXDiff = (newVar, oldVar, perspective) => {
  if (newVar !== oldVar) {
    if (typeof newVar !== 'object' || typeof oldVar !== 'object') return perspective;
    else {
      return Object.entries(newVar).reduce((obj, [key, value]) => {
        const res = getXDiff(value, oldVar[key], perspective[key]);
        if (res)  return { ...obj, [key]: res };
        else      return obj;
      }, {});
    }
  }
}
