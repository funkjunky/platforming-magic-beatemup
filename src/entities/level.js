const blockHeight = 10;
const canvasWidth = 960;
const canvasHeight = 540;
// array of squares drawn down
// SSB style
export const level = [
  //floor
  { x: 0, y: canvasHeight - 10, width: canvasWidth, height: blockHeight },
  //left wall
  { x: 0, y: 0, width: blockHeight, height: canvasHeight - blockHeight },
  //right wall
  { x: canvasWidth - blockHeight, y: 0, width: blockHeight, height: canvasHeight - blockHeight },
  //centre platform
  { x: canvasWidth * 3 / 8, y: canvasHeight * 3 / 4, width: canvasWidth / 4, height: canvasHeight / 4 - blockHeight },
  //platform1
  { x: canvasWidth / 8, y: canvasHeight / 2, width: canvasWidth / 4, height: blockHeight },
  //platform2
  { x: canvasWidth * 5 / 8, y: canvasHeight / 2, width: canvasWidth / 4, height: blockHeight },
];
