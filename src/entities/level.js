const spriteWidth = 96; //This is arbitrary, so it's fine.
// array of squares drawn down
export const level = [
  { x: 0, y: 480-spriteWidth, width: 640, height: spriteWidth },
  { x: 0, y: 480-spriteWidth-spriteWidth, width: spriteWidth, height: spriteWidth },
  { x: 640-spriteWidth, y: 480-spriteWidth-spriteWidth, width: spriteWidth, height: spriteWidth },

  { x: spriteWidth, y: spriteWidth, width: spriteWidth, height: spriteWidth },
  { x: spriteWidth * 3, y: 480 - spriteWidth * 2, width: spriteWidth, height: spriteWidth },
];