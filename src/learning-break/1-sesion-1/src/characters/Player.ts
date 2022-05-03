import Phaser from 'phaser';

import { AvatarKeys } from '../consts';
import { InputController } from "../controllers";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
  ) {
    super(scene, x, y, AvatarKeys.WARRIOR, 130);
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  update(inputController: InputController): void {
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
}