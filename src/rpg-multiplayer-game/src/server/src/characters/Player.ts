import Phaser from 'phaser'
import ThrowableWeapon from '../classes/ThrowableWeapon';
import { MovementInput, Orientation, PlayerId, PlayerInitialState } from '../types/playerTypes'
import { AvatarSetting, avatarSettings } from './AvatarSetting'

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      player(x: number, y: number, playerId: PlayerId): Player

      playerFromInitialState(playerInitialState: PlayerInitialState): Player
    }
  }
}
export const FULL_HEALTH = 100;
export const HEALTH_DAMAGE_DECREASE = 10;

export default class Player extends Phaser.Physics.Arcade.Image {
  private playerId: PlayerId
  private _orientation: Orientation;
  private throwableWeaponGroup?: Phaser.Physics.Arcade.Group;

  readonly avatarSetting: AvatarSetting

  // The voting zone where the player is standing on (or undefined if not)
  currentVotingZone: Phaser.GameObjects.Zone | undefined;

  // Callback to trigger when player leaves the voting zone
  onPlayerLeftVotingZone!: () => void

  constructor(scene: Phaser.Scene, x: number, y: number, playerId: PlayerId) {
    super(scene, x, y, '')
    this.playerId = playerId
    this._orientation = 'down'
    
    // The only avatar setting allowed for now is generic-lpc
    this.avatarSetting = avatarSettings.find((setting) => setting.name === 'generic-lpc')!
  }

  get id() {
    return this.playerId
  }

  update(movementInput: MovementInput) {
    const speed = 300
  
    // Handle Movement
    if (movementInput.left && movementInput.up) {
      this.setVelocity(-speed * 0.75, -speed * 0.75)
      this._orientation = 'left'
    } else if (movementInput.left && movementInput.down) {
      this.setVelocity(-speed * 0.75, speed * 0.75)
      this._orientation = 'left'
    } else if (movementInput.right && movementInput.up) {
      this.setVelocity(speed * 0.75, -speed * 0.75)
      this._orientation = 'right'
    } else if (movementInput.right && movementInput.down) {
      this.setVelocity(speed * 0.75, speed * 0.75)
      this._orientation = 'right'
    } else if (movementInput.left) {
      this.setVelocity(-speed, 0)
      this._orientation = 'left'
    } else if (movementInput.right) {
      this.setVelocity(speed, 0)
      this._orientation = 'right'
    } else if (movementInput.up) {
      this.setVelocity(0, -speed)
      this._orientation = 'up'
    } else if (movementInput.down) {
      this.setVelocity(0, speed)
      this._orientation = 'down'
    } else {
      this.setVelocity(0, 0)
    }

    // Handle voting zone
    let isOverlappingWithZone = false
    if (this.currentVotingZone) {
      const zoneBounds = this.currentVotingZone.getBounds()
      const playerBounds = this.getBounds()
      isOverlappingWithZone = Phaser.Geom.Intersects.GetRectangleIntersection(zoneBounds, playerBounds).width > 0

      if (!isOverlappingWithZone) {
        this.setUserLeftVotingZone()
      }
    }
  }

  get orientation(): Orientation {
    return this._orientation;
  }

  isOnVotingZone(): boolean {
    return this.currentVotingZone !== undefined
  }

  // Method to call by Phaser's Physics when player is overlapping with a zone
  setVotingZone(zone: Phaser.GameObjects.Zone, onPlayerLeftVotingZone: () => void): Player {
    this.currentVotingZone = zone
    this.onPlayerLeftVotingZone = onPlayerLeftVotingZone
    return this
  }

  // Method to call when the user leaves the voting zone
  setUserLeftVotingZone(): Player {
    this.onPlayerLeftVotingZone()
    this.currentVotingZone = undefined
    return this
  }

  fight(): void {
    this.shootThrowableWeapon();
  }

  setThrowableWeapon(weaponGroup: Phaser.Physics.Arcade.Group): void {
    this.throwableWeaponGroup = weaponGroup;
  }

  shootThrowableWeapon(): void {
    if (!this.throwableWeaponGroup) {
      console.error('this.throwableWeaponGroup is undefined')
      return
    }

    const arrow = this.throwableWeaponGroup.getFirstDead(
      true,
      this.x,
      this.y,
    ) as ThrowableWeapon

    if (!arrow) {
      return 
    }

    arrow.fire(this.x, this.y, this.orientation, this.id)

    // kill arrow after 2 seconds
    this.scene.time.delayedCall(2000, () => {
      if (arrow && arrow.active) {
        this.throwableWeaponGroup?.killAndHide(arrow);
        arrow.disableBody()
      } 
    }, [], this)
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

Phaser.GameObjects.GameObjectFactory.register('playerFromInitialState', function (
  this: Phaser.GameObjects.GameObjectFactory,
  playerInitialState: PlayerInitialState,
) {
  return this.scene.add.player(
    playerInitialState.x,
    playerInitialState.y,
    playerInitialState.playerId
  )
})
