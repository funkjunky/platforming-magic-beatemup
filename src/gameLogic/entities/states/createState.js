// WHAT A LEAK! TODO: re-evaluate? This was to make everything rely on the currentFrame time in redux, so we don't get negatives
//  Maybe give currentFrame it's own global function. syncedNow = () => window.store.getState.currentFrame
export const createState = (state, extraProps = {}) => ({ [state]: { createdAt: syncedNow(), ...extraProps } });

const syncedNow = () =>
  window.store ? window.store.getState().time.currentFrame : Date.now();
