import Phaser from 'phaser'
import { MovementInput, PlayerId, PlayerState } from '../types/playerTypes'
import { AvatarSetting, avatarSettings } from './AvatarSetting'

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      player(x: number, y: number, playerId: PlayerId): Player

      playerFromState(playerState: PlayerState): Player
    }
  }
}

const getRandomAvatarSetting = () => {
  const randomIndex = Phaser.Math.Between(0, avatarSettings.length - 1)
  return avatarSettings[randomIndex]
}

export default class Player extends Phaser.Physics.Arcade.Image {
  private playerId: PlayerId
  readonly avatarSetting: AvatarSetting

  constructor(scene: Phaser.Scene, x: number, y: number, playerId: PlayerId) {
    super(scene, x, y, '')
    this.playerId = playerId
    // this.scale = 2
    // this.avatarSetting = getRandomAvatarSetting()
    this.avatarSetting = avatarSettings.find((setting) => setting.name === 'generic-lpc')!
  }

  static fromPlayerState(scene: Phaser.Scene, playerState: PlayerState) {
    return new Player(scene, playerState.x, playerState.y, playerState.playerId)
  }

  get id() {
    return this.playerId
  }

  update(movementInput: MovementInput) {
    const speed = 300

    if (movementInput.left) {
      this.setVelocity(-speed, 0)
    } else if (movementInput.right) {
      this.setVelocity(speed, 0)
    } else if (movementInput.up) {
      this.setVelocity(0, -speed)
    } else if (movementInput.down) {
      this.setVelocity(0, speed)
    } else {
      this.setVelocity(0, 0)
    }
  }
}

Phaser.GameObjects.GameObjectFactory.register('player', function (
  this: Phaser.GameObjects.GameObjectFactory,
  x: number,
  y: number,
  playerId: PlayerId,
) {
  const player = new Player(this.scene, x, y, playerId)

  this.scene.physics.world.enableBody(
    player,
    Phaser.Physics.Arcade.DYNAMIC_BODY,
  )

  const { avatarSetting } = player
  const { sizeFactor } = avatarSetting.body

  player.body.setSize(
    sizeFactor * avatarSetting.body.size.width,
    sizeFactor * avatarSetting.body.size.height,
    avatarSetting.body.size.center,
  )
  player.body.setOffset(
    sizeFactor * avatarSetting.body.offset.x,
    sizeFactor * avatarSetting.body.offset.y,
  )

  // The player can't be pushed by any other object
  player.setPushable(false)

  return player
})

Phaser.GameObjects.GameObjectFactory.register('playerFromState', function (
  this: Phaser.GameObjects.GameObjectFactory,
  playerState: PlayerState,
) {
  return this.scene.add.player(playerState.x, playerState.y, playerState.playerId)
})
