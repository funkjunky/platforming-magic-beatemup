const boundingBoxWidth = 20;

const basicBoundingBoxes = entity => ({
  top: {
    x: entity.props.x + boundingBoxWidth,
    y: entity.props.y,
    width: entity.props.width - boundingBoxWidth * 2,
    height: boundingBoxWidth,
  },
  bottom: {
    x: entity.props.x + boundingBoxWidth,
    y: entity.props.y + entity.props.height - boundingBoxWidth,
    width: entity.props.width - boundingBoxWidth * 2,
    height: boundingBoxWidth,
  },
  left: {
    x: entity.props.x,
    y: entity.props.y + boundingBoxWidth,
    width: boundingBoxWidth,
    height: entity.props.height - boundingBoxWidth * 2,
  },
  right: {
    x: entity.props.x + entity.props.width - boundingBoxWidth,
    y: entity.props.y + boundingBoxWidth,
    width: boundingBoxWidth,
    height: entity.props.height - boundingBoxWidth * 2,
  },
});

export default basicBoundingBoxes;
