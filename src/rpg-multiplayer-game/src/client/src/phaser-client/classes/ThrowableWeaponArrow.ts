import Phaser from 'phaser';
import TextureKeys from '../consts/TextureKeys';
import AbstractThrowableWeapon from './AbstractThrowableWeapon';

export class ThrowableWeaponArrow extends AbstractThrowableWeapon {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    const texture = TextureKeys.UIMenu1;
    const frame = 'weapon-arrow';
    super(scene, x, y, texture, frame);
  }
}
