// run this every 10 ms??
// TODO: this function should simply state WHAT should be playing (state)... abstract the conditionals to another function.
const soundUpdate = (state, soundState) => {
  Object.values(state.entities).forEach(entity => {
    // TODO: not every entity will have states.dash
    // if the entity is dashing, and we're not playing the sound, then...
    if (entity.states.dash.dashing && !(soundState.getPlayingSounds()['dash'] && soundState.getPlayingSounds()['dash'][entity.id])) {
      // create the sound, and start it at the appropriate time based on the state time, and now
      soundState.registerSound('dash', entity, entity.states.dash.dashing, state.time.currentFrame);
    } else if (!entity.states.dash.dashing && soundState.getPlayingSounds()['dash'] && soundState.getPlayingSounds()['dash'][entity.id]) {
      soundState.unregisterSound('dash', entity);
    }
  });
}

export default soundUpdate;
