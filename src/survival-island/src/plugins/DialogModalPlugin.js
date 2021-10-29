import Phaser from '../lib/phaser.js'

export default class DialogModalPlugin extends Phaser.Plugins.BasePlugin {
  constructor(pluginManager) {
    super('DialogModalPlugin', pluginManager)
  }

  init() {
    console.log('DialogModalPlugin is alive')
  }
}
