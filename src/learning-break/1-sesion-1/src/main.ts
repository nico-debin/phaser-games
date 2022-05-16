import Phaser from 'phaser';

import { HelloWorld, Preloader, Game } from './scenes';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scale: { zoom: 1 },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  roundPixels: true,
  scene: [ Preloader, Game, HelloWorld ],
};

export default new Phaser.Game(config);
