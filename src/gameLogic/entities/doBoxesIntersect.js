const centrex = ({ x, width }) => x + width / 2;
const centrey = ({ y, height }) => y + height / 2;
// out of laziness taken from https://gamedev.stackexchange.com/questions/586/what-is-the-fastest-way-to-work-out-2d-bounding-box-intersection
// I adjusted to anchor in centre for calculation. I should default anchor in centre for performance, perhaps. Or simplicity of code?
// // TODO: factor out division for performance
export function doBoxesIntersect(a, b) {
  return Math.abs(centrex(a) - centrex(b)) < ((b.width + a.width) / 2)
  && Math.abs(centrey(a) - centrey(b)) < ((b.height + a.height) / 2);
}
