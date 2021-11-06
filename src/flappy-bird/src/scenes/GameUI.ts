import Phaser from 'phaser'
import EventKeys from '../consts/EventKeys'
import SceneKeys from '../consts/SceneKeys'
import TextureKeys from '../consts/TextureKeys'

import { sceneEvents } from '../events/EventsCenter'

export default class GameUI extends Phaser.Scene {
  private hearts!: Phaser.GameObjects.Group
  private scoreText!: Phaser.GameObjects.Text

  constructor() {
    super({ key: SceneKeys.GameUI })
  }

  create() {
    this.hearts = this.add.group({
      classType: Phaser.GameObjects.Image,
    })

    this.hearts.createMultiple({
      key: TextureKeys.HeartFull,
      setXY: {
        x: 20,
        y: 20,
        stepX: 32,
      },
      quantity: 5,
      setScale: {
        x: 2,
        y: 2,
      },
    })

    const style = { color: '#000', fontSize: '24px' }
    this.scoreText = this.add
      .text(10, 40, 'Score: 0', style)
      .setOrigin(0, 0)
      .setScrollFactor(0, 0)

    sceneEvents.on(
      EventKeys.PlayerHealthChanged,
      this.handlePlayerHealthChanged,
      this,
    )

    sceneEvents.on(EventKeys.ScoreUpdated, this.handleScoreUpdate, this)
  }

  handlePlayerHealthChanged(lives: number) {
    this.hearts.children.each((gameObject, index) => {
      const heart = gameObject as Phaser.GameObjects.Image
      if (index < lives) {
        heart.setTexture(TextureKeys.HeartFull)
      } else {
        heart.setTexture(TextureKeys.HeartEmpty)
      }
    })
  }

  handleScoreUpdate(score: number) {
    this.scoreText.setText(`Score: ${score}`)
  }
}
