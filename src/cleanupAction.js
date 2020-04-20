import { level } from './entities/level';
import { updateProps } from './entities';
import { typeDefinitions } from './entities/typeDefinitions';

export const cleanupAction = () => (dispatch, getState) => {
  Object.values(getState().entities).forEach(entity => {
    const entityDefn = typeDefinitions[entity.type];
    // jumping state change example
    //if (getState()[x].entity.state.jump === 'falling' && collidedWithLevel()) dispatch(jumpingActions.ground());

    const { top, bottom, left, right } = entityDefn.boundingBoxes(entity);
    // stop the entity from being in any square
    level.forEach(block => {
      if (doBoxesIntersect(block, top)) {
        dispatch(updateProps({ entity, newProps: { y: block.y + block.width + entity.props.height, vy: 0 } }));
      }
      if (doBoxesIntersect(block, bottom)) {
        dispatch(updateProps({ entity, newProps: { y: block.y, vy: 0 } }));
      }
      if (doBoxesIntersect(block, right)) {
        dispatch(updateProps({ entity, newProps: { x: block.x - entity.props.width, vx: 0 } }));
      }
      if (doBoxesIntersect(block, left)) {
        dispatch(updateProps({ entity, newProps: { x: block.x + block.width, vx: 0 } }));
      }
    });
  });
}

const centrex = ({ x, width }) => x + width / 2;
const centrey = ({ y, height }) => y + height / 2;
// out of laziness taken from https://gamedev.stackexchange.com/questions/586/what-is-the-fastest-way-to-work-out-2d-bounding-box-intersection
// I adjusted to anchor in centre for calculation. I should default anchor in centre for performance, perhaps. Or simplicity of code?
// // TODO: factor out division for performance
function doBoxesIntersect(a, b) {
  return Math.abs(centrex(a) - centrex(b)) < ((b.width + a.width) / 2)
  && Math.abs(centrey(a) - centrey(b)) < ((b.height + a.height) / 2);
}
