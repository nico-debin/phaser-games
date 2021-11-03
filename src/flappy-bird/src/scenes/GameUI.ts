import Phaser from 'phaser'
import TextureKeys from '~/consts/TextureKeys'
import SceneKeys from '../consts/SceneKeys'

import { sceneEvents } from '../events/EventsCenter'

export default class GameUI extends Phaser.Scene {
  private hearts!: Phaser.GameObjects.Group

  constructor() {
    super({ key: SceneKeys.GameUI })
    console.log(`running ${SceneKeys.GameUI}`)
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

    sceneEvents.on(
      'player-health-changed',
      this.handlePlayerHealthChanged,
      this,
    )
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
}
