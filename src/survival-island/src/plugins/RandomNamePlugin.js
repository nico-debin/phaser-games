import Phaser from '../lib/phaser.js'

export default class RandomNamePlugin extends Phaser.Plugins.BasePlugin {
  constructor(pluginManager) {
    super('RandomNamePlugin', pluginManager)

    this.syllables = [
      'fro',
      'tir',
      'nag',
      'bli',
      'mon',
      'fay',
      'shi',
      'zag',
      'blarg',
      'rash',
      'izen',
    ]
  }

  init() {
    console.log('RandomNamePlugin is alive')
  }

  getName() {
    let name = ''

    for (let i = 0; i < Phaser.Math.Between(2, 4); i++) {
      name = name.concat(Phaser.Utils.Array.GetRandom(this.syllables))
    }

    return Phaser.Utils.String.UppercaseFirst(name)
  }
}
