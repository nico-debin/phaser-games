import Phaser from 'phaser'
import TextureKeys from '~/consts/TextureKeys'
import Game from '~/scenes/Game'

// PipeColumn consists in two pipes aligned with the same x position
// One column is at the top, the otherone is at the bottom
// There must be a gap between top column and bottom column
export default class PipeColumn extends Phaser.GameObjects.Container {

  private gameScene: Game
  private topPipe: Phaser.GameObjects.Sprite
  private bottomPipe: Phaser.GameObjects.Sprite

  constructor(scene: Game, x: number, topY?: number | undefined, bottomY?: number | undefined) {
    super(scene)
    this.gameScene = scene
    
    if (topY === undefined || bottomY === undefined) {
      const randomCoordinates = scene.generateRandomVerticalPositionPipesCoordinates()
      topY = randomCoordinates.topY
      bottomY = randomCoordinates.bottomY
    }

    this.topPipe = scene.physics.add.staticSprite(x, topY as number, TextureKeys.Pipe)
    this.bottomPipe = scene.physics.add.staticSprite(x, bottomY as number, TextureKeys.Pipe)

    this.topPipe.setOrigin(0.5, 1).setFlipY(true)
    this.bottomPipe.setOrigin(0.5, 0)

    const topPipeBody = this.topPipe.body as Phaser.Physics.Arcade.StaticBody
    const bottomPipeBody = this.bottomPipe.body as Phaser.Physics.Arcade.StaticBody

    topPipeBody.setOffset(0, -this.topPipe.displayHeight / 2)
    bottomPipeBody.setOffset(0, this.bottomPipe.displayHeight / 2)
  }

  // @ts-ignore
  get displayWidth() {
    return this.topPipe.displayWidth
  }

  // @ts-ignore
  get x() {
    return this.topPipe.x
  }

  setHorizontalPosition(x: number) {
    this.topPipe.x = x
    this.bottomPipe.x = x
  }

  updateBodiesFromGameObject() {
    const topPipeBody = this.topPipe.body as Phaser.Physics.Arcade.StaticBody
    const bottomPipeBody = this.bottomPipe.body as Phaser.Physics.Arcade.StaticBody
    topPipeBody.updateFromGameObject()
    bottomPipeBody.updateFromGameObject()
  }

  wrapPipes(x: number) {
    this.setHorizontalPosition(x)
    
    const { topY, bottomY } = this.gameScene.generateRandomVerticalPositionPipesCoordinates()
    this.topPipe.y = topY
    this.bottomPipe.y = bottomY

    this.updateBodiesFromGameObject()
  }
}
