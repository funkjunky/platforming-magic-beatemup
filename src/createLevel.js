import { createEntity } from 'gameLogic/entities';

const blockHeight = 10;
// TODO: export this from elsewhere
export const canvasHeight = 540;
export const canvasWidth = 960;

export default () => dispatch => {
  dispatch(createEntity({ type: 'block', props: { x: 0, y: canvasHeight - blockHeight, width: canvasWidth, height: blockHeight } }));
  dispatch(createEntity({ type: 'block', props: { x: 0, y: 0, width: blockHeight, height: canvasHeight - blockHeight } }));
  dispatch(createEntity({ type: 'block', props: { x: canvasWidth - blockHeight, y: 0, width: blockHeight, height: canvasHeight - blockHeight } }));
  dispatch(createEntity({ type: 'block', props: { x: canvasWidth / 8, y: canvasHeight / 2, width: canvasWidth / 4, height: blockHeight } }));
  dispatch(createEntity({ type: 'block', props: { x: canvasWidth * 5 / 8, y: canvasHeight / 2, width: canvasWidth / 4, height: blockHeight } }));
}
