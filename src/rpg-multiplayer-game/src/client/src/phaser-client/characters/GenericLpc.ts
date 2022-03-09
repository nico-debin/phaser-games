import Phaser from 'phaser'
import AvatarAnimationKeys from '../consts/AvatarAnimationKeys';
import { AnimationHandler } from '../anims/AnimationHandler';
import AbstractThrowableWeapon from '../classes/AbstractThrowableWeapon';
import AvatarKeys from '../consts/AvatarKeys';
import TextureKeys from '../consts/TextureKeys';
import { MovementInput, Orientation, PlayerId } from '../types/playerTypes'

import Player from './Player'

interface PlayerData {
  avatar: AvatarKeys;
  playerId: PlayerId;
}

export default class GenericLpc extends Player {
  playerData: PlayerData;
  bloodParticles: Phaser.GameObjects.Particles.ParticleEmitterManager;
  bloodParticlesEmitter: Phaser.GameObjects.Particles.ParticleEmitter;

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

    this.bloodParticles = scene.add.particles(TextureKeys.Blood);
    this.bloodParticlesEmitter = this.bloodParticles.createEmitter({
      alpha: { start: 0.7, end: 0 },
      lifespan: { min: 700, max: 1000 },
      speed: { min: 10, max: 60 },
      gravityY: 90,
      quantity: 4,
      angle: 360 - 20,
      timeScale: 2,
      on: false,
    });
    this.bloodParticlesEmitter.startFollow(this, 5, 10, true);
  }

  update(movementInput: MovementInput) {
    super.update(movementInput)
    
    if (this.isDead) return;

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

  setDepth(value: number): this {
    super.setDepth(value);
    this.bloodParticles.setDepth(value);
    return this;
  }

  private throwArrow(): boolean {
    if (!this.throwableWeaponGroup) {
      console.error('this.throwableWeaponGroup is undefined')
      return false
    }

    const arrow = this.throwableWeaponGroup.getFirstDead(
      true,
      this.x,
      this.y,
    ) as AbstractThrowableWeapon

    if (!arrow) {
      return false 
    }

    arrow.fire(this.x, this.y, this.orientation, this.id)

    // kill arrow after 5 seconds
    this.scene.time.delayedCall(2000, () => {
      if (arrow && arrow.active) {
        this.throwableWeaponGroup?.killAndHide(arrow);
        arrow.disableBody()
      } 
    }, [], this)

    return true
  }

  private handleFightAnimation() {
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
    if (this.isDead) return;
    if (this.throwArrow()) {
      this.handleFightAnimation();
    }
  }

  hurt(amount: number, orientation?: Orientation) {
    super.hurt(amount);
    if (this.isDead) return;

    this.healthBar.decrease(amount);

    switch (orientation) {
      case 'up': 
        this.bloodParticlesEmitter.setAngle(50);
        this.bloodParticlesEmitter.followOffset = new Phaser.Math.Vector2(0, 0)
        break;

      case 'down': 
        this.bloodParticlesEmitter.setAngle(360 - 50);
        this.bloodParticlesEmitter.followOffset = new Phaser.Math.Vector2(0, 10)
        break;

      case 'right':
        this.bloodParticlesEmitter.setAngle(360 - 180 + 20);
        this.bloodParticlesEmitter.followOffset = new Phaser.Math.Vector2(-5, 10)
        break;

      case 'left':
      default:
        this.bloodParticlesEmitter.setAngle(360 + 20);
        this.bloodParticlesEmitter.followOffset = new Phaser.Math.Vector2(5, 10)
    }

    this.bloodParticlesEmitter.start();
    this.scene.time.delayedCall(500, () => {
      this.bloodParticlesEmitter.stop();
    })
  }

  kill() {
    if (this.isDead) return;
    super.kill();
    const animation = `${this.playerData.avatar}-${AvatarAnimationKeys.DIE}`;
    this.anims.play(animation, false);
    this.healthBar.setVisible(false);
  }

  revive() {
    super.revive();
    this.healthBar.setValue(100).setVisible(false);
  }
}
