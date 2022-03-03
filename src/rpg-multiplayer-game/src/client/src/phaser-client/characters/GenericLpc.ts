import Phaser from 'phaser'
import AvatarAnimationKeys from '~/phaser-client/consts/AvatarAnimationKeys';
import { AnimationHandler } from '../anims/AnimationHandler';
import AvatarKeys from '../consts/AvatarKeys';
import TextureKeys from '../consts/TextureKeys';
import { MovementInput, PlayerId } from '../types/playerTypes'

import Player from './Player'

interface PlayerData {
  avatar: AvatarKeys;
  playerId: PlayerId;
}

export default class GenericLpc extends Player {
  playerData: PlayerData;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    playerData: PlayerData,
    errorOffset = 16,
  ) {
    // UNCAUGHT BUG: For some reason I couldn't find yet, the player
    // rendering needs to be moved by 16 pixels in X and Y. 
    // Remove this when the bug is fixed
    // const errorOffset = 16;

    super(scene, x + errorOffset, y + errorOffset, playerData.avatar, playerData.playerId)
    this.playerData = playerData;

    AnimationHandler.add(scene, playerData.avatar);

    this.anims.play(`${playerData.avatar}-${AvatarAnimationKeys.IDLE_DOWN}`)
  }

  update(movementInput: MovementInput) {
    super.update(movementInput)

    const { avatar } = this.playerData;

    if (movementInput.left) {
      // Moving Left
      this.anims.play(`${avatar}-${AvatarAnimationKeys.WALK_SIDE}`, true)

      // Flip sprite to the left
      this.setFlipX(true)
    } else if (movementInput.right) {
      // Moving Right
      this.anims.play(`${avatar}-${AvatarAnimationKeys.WALK_SIDE}`, true)

      // Flip sprite to the right
      this.setFlipX(false)
    } else if (movementInput.up) {
      // Moving Up
      this.anims.play(`${avatar}-${AvatarAnimationKeys.WALK_UP}`, true)
    } else if (movementInput.down) {
      // Moving Down
      this.anims.play(`${avatar}-${AvatarAnimationKeys.WALK_DOWN}`, true)
    } else {
      const parts = this.anims.currentAnim.key.split('-')
      parts[2] = 'idle'
      this.anims.play(parts.join('-'))
    }
  }

  shootThrowableWeapon(): void {
    super.shootThrowableWeapon();
    this.throwArrow();
  }

  throwArrow(): boolean {
    if (!this.throwableWeaponGroup) return false

    const arrow = this.throwableWeaponGroup.get(
      this.x,
      this.y,
      TextureKeys.UIMenu1,
      'weapon-arrow',
    ) as Phaser.Physics.Arcade.Image

    if (!arrow) {
      return false 
    }

    const vec = new Phaser.Math.Vector2(0, 0)

    switch(this.orientation) {
      case 'left':
        vec.x = -1;
        break;

      case 'up':
        vec.y = -1;
        break;

      case 'down':
        vec.y = 1;
        break;
        
      default:
      case 'right':
        vec.x = 1;
        break;

    }

    const angle = vec.angle()

    arrow.setActive(true)
    arrow.setVisible(true)

    arrow.setRotation(angle)

    // arrow starting point spacing from player
    arrow.x += vec.x * 14
    arrow.y += vec.y * 20

    const velocity = 500
    arrow.setVelocity(vec.x * velocity, vec.y * velocity)

    // kill arrow after 5 seconds
    this.scene.time.delayedCall(2000, () => {
      if (arrow && arrow.active) {
        this.throwableWeaponGroup?.killAndHide(arrow);
      } 
    }, [], this)

    return true
  }

  handleFightAnimation() {
    const { avatar } = this.playerData;
    let animation: string | undefined;

    const currentAnimation = this.anims.getName();
    let flipX = false;

    switch (this.orientation) {
      case 'left':
        animation = `${avatar}-${AvatarAnimationKeys.SHOOT_SIDE}`;
        flipX = true;
        break;
      case 'right':
        animation = `${avatar}-${AvatarAnimationKeys.SHOOT_SIDE}`;
        break;
      case 'up':
        animation = `${avatar}-${AvatarAnimationKeys.SHOOT_UP}`;
        break;
      case 'down':
        animation = `${avatar}-${AvatarAnimationKeys.SHOOT_DOWN}`;
        break;
    }
    if (animation) {
      this.anims.play(animation);
      this.anims.playAfterRepeat(currentAnimation);
      this.setFlipX(flipX)
    }
  }

  fight() {
    super.fight();
    if (this.throwArrow()) {
      this.handleFightAnimation();
    }
  }
}
