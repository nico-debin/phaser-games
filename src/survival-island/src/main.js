import Phaser from './lib/phaser.js'
import MainScene from './scenes/MainScene.js'
import RandomNamePlugin from './plugins/RandomNamePlugin.js'
import DialogModalPlugin from './plugins/DialogModalPlugin.js'

const config = {
  type: Phaser.AUTO,
  width: 512,
  height: 512,
  scene: MainScene,
  backgroundColor: '#000c1f',
  parent: 'game-container',
  scale: {
    zoom: 2.3,
  },
  physics: { default: 'matter', matter: { debug: false, gravity: { y: 0 } } },
  plugins: {
    global: [
      { key: 'RandomNamePlugin', plugin: RandomNamePlugin, start: true },
      { key: 'DialogModalPlugin', plugin: DialogModalPlugin, start: true },
    ],
  },
}

const game = new Phaser.Game(config)
