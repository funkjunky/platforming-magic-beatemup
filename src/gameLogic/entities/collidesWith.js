import player from './player/collidesWith';
import fireball from './fireball/collidesWith';

const collidesWith = {
  player,
  fireball,

  doppleganger: player, //just copy the player collision
};

export default collidesWith;
