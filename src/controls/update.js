const xor = (a, b) => a && !b || b && !a;
const update = ({ axisListeners, buttonListeners }) => {
  if (!navigator.getGamepads()[0]) return;

  // TODO: AFTER the intensity update, see if I can combine the listeners.
  const changedAxis = axisListeners.filter(a => xor(a.active, a.axis(navigator.getGamepads()[0].axes)));
  // change active state
  changedAxis.forEach(a => a.active = !a.active);
  // trigger listeners
  changedAxis.filter(a => !a.active).forEach(a => a.release());
  changedAxis.filter(a => a.active).forEach(a => a.press());

  const changedButton = buttonListeners.filter(a => xor(a.active, navigator.getGamepads()[0].buttons[a.button].pressed));
  // change active state
  changedButton.forEach(a => a.active = !a.active);
  // trigger listeners
  changedButton.filter(a => !a.active).forEach(a => a.release());
  changedButton.filter(a => a.active).forEach(a => a.press());
}

export default update;
