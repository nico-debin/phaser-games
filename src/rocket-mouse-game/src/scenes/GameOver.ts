import Phaser, { Scene } from 'phaser'
import SceneKeys from '../consts/SceneKeys'

export default class GameOver extends Phaser.Scene {
  constructor() {
    super(SceneKeys.GameOver)
  }

  create() {
    const { width, height } = this.scale

    const x = width * 0.5
    const y = height * 0.5

    this.add
      .text(x, y, 'Press SPACE to Play Again', {
        fontSize: '32px',
        color: '#FFFFFF',
        backgroundColor: '#000000',
        shadow: { fill: true, blur: 0, offsetY: 0 },
        padding: { left: 15, right: 15, top: 10, bottom: 10 },
      })
      .setOrigin(0.5)
  }

  update() {
    const cursors = this.input.keyboard.createCursorKeys()

    if (cursors.space.isDown) {
      this.scene.start(SceneKeys.Game)
    }
  }
}
