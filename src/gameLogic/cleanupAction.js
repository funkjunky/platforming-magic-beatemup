import { level } from './entities/level';
import { updateProps } from './entities';
import { entityDefinitions } from './entities';
import { grounded, falling, States } from './entities/states/jump';
import { notdashing, States as DashStates } from './entities/states/dash';
import { doBoxesIntersect } from './entities/doBoxesIntersect';

export const cleanupAction = () => (dispatch, getState) => {
  Object.values(getState().entities).forEach(entity => {
    const entityDefn = entityDefinitions[entity.type];
    //TODO: temporary until i figure out how to handle multiple entity types
    if (entity.type !== 'player') return;

    // if jumping has been jumping for jumpDuration, then switch it to falling

    let isGrounded = false;
    const { top, bottom, left, right } = entityDefn.boundingBoxes(entity);
    // stop the entity from being in any square
    level.forEach(block => {
      // TODO: move state changes into their own function, even if i have to re-iterate on blocks? Hmmm...
      // This feels a little more out there, so even as the props are pushed away, this still feels the ground.
      if (doBoxesIntersect(block, bottom)) {
        if (!entity.states.jump[States.grounded]) {
          dispatch(grounded({ entity }));
        }
        isGrounded = true;
      }

      if (doBoxesIntersect(block, top)) {
        dispatch(updateProps({ entity, newProps: { y: block.y + block.height, vy: 0 } }));
      }
      // i add 1 pixel, then correct flush, so this won't be triggered again after being "grounded"
      if (doBoxesIntersect({ ...block, y: block.y + 1 }, bottom)) {
        dispatch(updateProps({ entity, newProps: { y: block.y - entity.props.height, vy: 0 } }));
      }

      if (doBoxesIntersect(block, right)) {
        dispatch(updateProps({ entity, newProps: { x: block.x - entity.props.width, vx: 0 } }));
      }
      if (doBoxesIntersect(block, left)) {
        dispatch(updateProps({ entity, newProps: { x: block.x + block.width, vx: 0 } }));
      }
    });

    // TODO: This should probably be in typeDefinition player
    const maxJumpDuration = 1000;
    // TODO: once a game clock is implemented, we can use that here, to continue to dash after a pause
    if (entity.states.jump[States.jumping] && (getState().time.currentFrame - entity.states.jump[States.jumping].createdAt) > maxJumpDuration) {
      dispatch(falling({ entity }));
    }

    // TODO: This should probably be in typeDefinition player
    const maxDashDuration = 500;
    if (entity.states.dash[DashStates.dashing] && (getState().time.currentFrame - entity.states.dash[DashStates.dashing].createdAt) > maxDashDuration) {
      dispatch(notdashing({ entity }));
    }

    if (!isGrounded && entity.states.jump[States.grounded]) {
      dispatch(falling({ entity }));
    }
  });
}
