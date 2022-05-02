import Phaser from 'phaser';

import { Preloader, HelloWorld } from './scenes';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scale: { zoom: 0.5 },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: [Preloader, HelloWorld],
};

export default new Phaser.Game(config);
