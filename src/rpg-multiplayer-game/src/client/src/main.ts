import Phaser from 'phaser'

import Preloader from './scenes/Preloader'
import Game from './scenes/Game'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	scene: [Preloader, Game],
	scale: {
		mode: Phaser.Scale.FIT,
		zoom: 2
	}
}

export default new Phaser.Game(config)
