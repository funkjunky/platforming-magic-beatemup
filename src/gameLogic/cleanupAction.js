import { updateProps } from './entities';
import { entityDefinitions } from './entities';
import { grounded, falling, States } from './entities/states/jump';
import { notdashing, States as DashStates } from './entities/states/dash';
import { doBoxesIntersect } from './doBoxesIntersect';

export const cleanupAction = () => (dispatch, getState) => {
  Object.values(getState().entities).forEach(entity => {
    const entityDefn = entityDefinitions[entity.type];
    //TODO: hmmmm need a better way to do this whole function.
    //      the level interaction is for players and enemies, maybe some other entities
    //      the jumping and dashing and falling all depend on the entity, especially the dashing
    if (entity.type !== 'player' && entity.type !== 'doppleganger') return;

    let isGrounded = false;
    const { top, bottom, left, right } = entityDefn.boundingBoxes(entity);
    // stop the entity from being in any square
    Object.values(getState().entities).filter(({ type }) => type === 'block').forEach(block => {
      // TODO: move state changes into their own function, even if i have to re-iterate on blocks? Hmmm...
      // This feels a little more out there, so even as the props are pushed away, this still feels the ground.
      if (doBoxesIntersect(block.props, bottom)) {
        if (entity.states.jump[States.falling]) {
          dispatch(grounded({ entity }));
        }
        isGrounded = true;
      }

      if (doBoxesIntersect(block.props, top)) {
        dispatch(updateProps({ entity, newProps: { y: block.props.y + block.props.height, vy: 0 } }));
      }
      // i add 1 pixel, then correct flush, so this won't be triggered again after being "grounded"
      if (doBoxesIntersect({ ...block.props, y: block.props.y + 1 }, bottom)) {
        // HERE: This is triggering after we jump [WHY DOES THIS SUDDENLY HAPPEN?!]
        dispatch(updateProps({ entity, newProps: { y: block.props.y - entity.props.height, vy: 0 } }));
      }

      if (doBoxesIntersect(block.props, right)) {
        dispatch(updateProps({ entity, newProps: { x: block.props.x - entity.props.width, vx: 0 } }));
      }
      if (doBoxesIntersect(block.props, left)) {
        dispatch(updateProps({ entity, newProps: { x: block.props.x + block.props.width, vx: 0 } }));
      }
    });

    // TODO: This should probably be in typeDefinition player
    const maxJumpDuration = 1000;
    // TODO: once a game clock is implemented, we can use that here, to continue to dash after a pause
    if (entity.states.jump[States.jumping] && (getState().gameTime - entity.states.jump[States.jumping].createdAt) > maxJumpDuration) {
      dispatch(falling({ entity }));
    }

    // TODO: This should probably be in typeDefinition player
    const maxDashDuration = 500;
    if (entity.states.dash[DashStates.dashing] && (getState().gameTime - entity.states.dash[DashStates.dashing].createdAt) > maxDashDuration) {
      dispatch(notdashing({ entity }));
    }

    if (!isGrounded && entity.states.jump[States.grounded]) {
      dispatch(falling({ entity }));
    }
  });
}
