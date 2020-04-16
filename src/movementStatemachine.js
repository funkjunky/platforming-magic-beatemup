
const acc = 1;
// TODO: use maxVelocity in cleanupReducer
// const maxVelocity = 10;
// TODO: visualize this with ascii art in console [using formatting and colours?? Console is powerful]
// Note: we are storing the INTENTION, not the state. I think it's easier to work with.
const movementStateMachine = {
  stopping: {
    next: ['pushingLeft', 'pushingRight'],
    // called using statesUpdateProps action
    reducer: (props, dt) => {
      if (props.velocity > 0) {
        props.velocity -= acc * dt
      } else if (props.velocity < 0) {
        props.velocity += acc * dt;
      }
      // TODO: cleanupReducer will zero when close enough to avoid drift. If state is stopping
    },
  },
  pushingLeft: {
    next: ['pushingRight', 'stopping'],
    reducer: (props, dt) => props.velocity -= acc * dt,
  },
  pushingRight: {
    next: ['pushingLeft', 'stopping'],
    reducer: (props, dt) => props.velocity += acc * dt,
  },
};

export default movementStateMachine;
