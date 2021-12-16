import Phaser from 'phaser'

import Preloader from './scenes/Preloader'
import Game from './scenes/Game'
import settings from './settings'

declare global {
  interface Window {
    gameLoaded: () => void
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: settings.debugMode ? Phaser.AUTO : Phaser.HEADLESS,
  autoFocus: false,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: settings.debugMode,
    },
  },
  scene: [Preloader, Game],
}

if (settings.debugMode) {
	config.scale = {
		mode: Phaser.Scale.FIT,
		zoom: 2
	}
}

export default new Phaser.Game(config)

window.gameLoaded && window.gameLoaded()
