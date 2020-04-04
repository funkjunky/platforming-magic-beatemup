import { level } from './level';
import { cleanupProps } from './props';

//TODO: spriteWidth should be defined elsewhere.. ...
const spriteWidth = 96;

// TODO: put in loop after doing state machine updates
export const cleanupAction = entities => (dispatch) => {
  entities.forEach(entity => {
    // jumping state change example
    //if (getState()[x].entity.state.jump === 'falling' && collidedWithLevel()) dispatch(jumpingActions.ground());

    // stop the entity from being in any square
    level.filter(block => doBoxesIntersect(block, entity.props))
      .forEach(intersectingBlock => {
        // TODO: only doing horiz for now, adding vertical will add complexity
        // if velocity is positive, then retreat to x
        if (entity.props.velocity > 0) dispatch(cleanupProps({ x: intersectingBlock.x - spriteWidth }));
        // if velocity is negative, then retreat to x + width
        else                           dispatch(cleanupProps({ x: intersectingBlock.x + intersectingBlock.width }));
      });
  });
}

// out of laziness taken from https://gamedev.stackexchange.com/questions/586/what-is-the-fastest-way-to-work-out-2d-bounding-box-intersection
function doBoxesIntersect(a, b) {
  return (Math.abs(a.x - b.x) * 2 < (a.width + b.width)) &&
         (Math.abs(a.y - b.y) * 2 < (a.height + b.height));
}
