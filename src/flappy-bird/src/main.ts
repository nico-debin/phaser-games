import Phaser from 'phaser'

import Preloader from './scenes/Preloader'
import Game from './scenes/Game'
import GameUI from './scenes/GameUI'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 640,
  scale: {
    zoom: 1,
  },
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 2000 },
			debug: true
		}
	},
	scene: [Preloader, Game, GameUI],
}

export default new Phaser.Game(config)
