import Phaser from 'phaser'

import Preloader from './scenes/Preloader'
import Game from './scenes/Game'
import GameDebug from './scenes/GameDebug'
import settings from './settings'

declare global {
  interface Window {
    gameLoaded: () => void
  }
}

const defaultScenes = [Preloader, Game]

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
      debugShowBody: settings.debugMode,
      debugShowStaticBody: settings.debugMode,
    },
  },
  scene: defaultScenes,
}

if (settings.debugMode) {
	config.scale = {
		mode: Phaser.Scale.FIT,
		zoom: 2
	}
	config.scene = [...defaultScenes, GameDebug]
}

export default new Phaser.Game(config)

window.gameLoaded && window.gameLoaded()
