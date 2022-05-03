import Phaser from 'phaser';

import { AvatarKeys, AvatarAnimationKeys } from '../consts';
import { InputController } from "../controllers";
import { AnimationHandler } from '../anims/AnimationHandler';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
  ) {
    // The avatar used by the player
    const avatar = AvatarKeys.WARRIOR;

    super(scene, x, y, avatar);

    // Add game object to Scene and to the physics engine
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Create animations for current avatar
    AnimationHandler.add(scene, avatar);

    // Start with IDLE animation
    this.anims.play(`${avatar}-${AvatarAnimationKeys.IDLE_DOWN}`);
  }

  update(inputController: InputController): void {
    // Update player movement
    this.updateVelocity(inputController);

    // Animate according to player movement
    this.updateAnimation();
  }

  private updateVelocity(inputController: InputController): void {
    const speed = 250;

    // 8 direction movements
    if (inputController.left.isDown && inputController.up.isDown) {
      this.setVelocity(-speed * 0.75, -speed * 0.75);
    } else if (inputController.left.isDown && inputController.down.isDown) {
      this.setVelocity(-speed * 0.75, speed * 0.75);
    } else if (inputController.right.isDown && inputController.up.isDown) {
      this.setVelocity(speed * 0.75, -speed * 0.75);
    } else if (inputController.right.isDown && inputController.down.isDown) {
      this.setVelocity(speed * 0.75, speed * 0.75);
    } else if (inputController.left.isDown) {
      this.setVelocity(-speed, 0);
    } else if (inputController.right.isDown) {
      this.setVelocity(speed, 0);
    } else if (inputController.up.isDown) {
      this.setVelocity(0, -speed);
    } else if (inputController.down.isDown) {
      this.setVelocity(0, speed);
    } else {
      this.setVelocity(0, 0);
    }
  }

  private updateAnimation(): void {
    const avatar = this.texture.key;

    if (this.body.velocity.x < 0) {
      // Moving LEFT
      this.play(`${avatar}-${AvatarAnimationKeys.WALK_SIDE}`, true);

      // Flip sprite to the left
      this.setFlipX(true);

    } else if (this.body.velocity.x > 0) {
      // Moving RIGHT
      this.play(`${avatar}-${AvatarAnimationKeys.WALK_SIDE}`, true);

      // Flip sprite to the right
      this.setFlipX(false);
    } else if (this.body.velocity.y < 0) {
      // Moving UP
      this.play(`${avatar}-${AvatarAnimationKeys.WALK_UP}`, true);
    } else if (this.body.velocity.y > 0) {
      // Moving DOWN
      this.play(`${avatar}-${AvatarAnimationKeys.WALK_DOWN}`, true);
    } else {
      // IDLE
      const parts = this.anims.currentAnim.key.split('-');
      const index = avatar.includes('-') ? 2 : 1;
      parts[index] = 'idle';
      this.play(parts.join('-'));
    }
  }
}