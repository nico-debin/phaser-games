import Phaser from 'phaser'

import Preloader from './scenes/Preloader'
import Game from './scenes/Game'
import Hud from './scenes/Hud'

const gameConfig: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	scene: [Preloader, Game, Hud],
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
		width: 800,
		height: 600,
	},
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
}

export default gameConfig;