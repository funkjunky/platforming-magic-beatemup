const getFlippedFrame = image => {
  const c = document.createElement('canvas');
  c.width = image.width;
  c.height= image.height;
  const ctx = c.getContext('2d');
  ctx.scale(-1, 1);
  ctx.drawImage(image, -image.width, 0);
  const img = new Image();
  img.src = c.toDataURL();
  return img;
}

export default getFlippedFrame;
