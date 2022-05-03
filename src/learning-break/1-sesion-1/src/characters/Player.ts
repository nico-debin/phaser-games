import Phaser from 'phaser';

import { AvatarKeys } from '../consts';

export default class Player extends Phaser.GameObjects.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
  ) {
    super(scene, x, y, AvatarKeys.WARRIOR, 130);
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }
}