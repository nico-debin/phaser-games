import Phaser from 'phaser'

export type PlayerId = string;

export default class Player extends Phaser.Physics.Arcade.Image {
  private playerId: PlayerId

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, playerId: string, frame?: string | number) {
    super(scene, x, y, texture)
    this.playerId = playerId
  }

  get id (){
    return this.playerId
  }
}
