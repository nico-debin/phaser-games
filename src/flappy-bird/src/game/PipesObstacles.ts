import Phaser from 'phaser'

export default class PipesObstacles extends Phaser.Physics.Arcade.StaticGroup {
  constructor(world: Phaser.Physics.Arcade.World, scene: Phaser.Scene) {
    super(world, scene)
  }
}
