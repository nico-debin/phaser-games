import Phaser from 'phaser'

import Preloader from './scenes/Preloader'
import Game from './scenes/Game'

declare global {
	interface Window { gameLoaded: () => void; }
}

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.HEADLESS,
	autoFocus: false,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 }
		}
	},
	scene: [Preloader, Game]
}

export default new Phaser.Game(config)

window.gameLoaded()
