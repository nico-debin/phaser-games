import Phaser from 'phaser'
import HealthBar from '../classes/HealthBar';

import { MovementInput, Orientation, PlayerId } from '../types/playerTypes'

export default abstract class Player extends Phaser.GameObjects.Sprite {
  private playerId: PlayerId
  protected orientation: Orientation;
  protected throwableWeaponGroup?: Phaser.Physics.Arcade.Group;
  protected _isDead: boolean = false;
  protected healthBar: HealthBar;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, playerId: string, frame?: string | number | undefined) {
    super(scene, x, y, texture)
    this.playerId = playerId
    this.orientation = 'down'

    this.healthBar = new HealthBar(scene, x, y + this.displayHeight * 0.5 + 5, this.displayWidth, 10, true);
    this.healthBar.setVisible(false);
  }

  get id (){
    return this.playerId
  }

  update(movementInput: MovementInput) {
    if (this.isDead) return;

    this.healthBar.setPosition(this.x, this.y + this.displayHeight * 0.5 + 5, true)

    if (movementInput.left) {
      this.orientation = 'left';
    } else if (movementInput.right) {
      this.orientation = 'right';
    } else if (movementInput.up) {
      this.orientation = 'up';
    } else if (movementInput.down) {
      this.orientation = 'down';
    }
  }

  fight(): boolean {
    // Override this method on child classes
    if (this.isDead) return false;
    return true;
  }

  hurt(amount: number, orientation?: Orientation) {
    // Override this method on child classes
    if (this.isDead) return;
  }

  set health(amount: number) {
    this.healthBar.setValue(amount);
    if (amount === 0) {
      this.kill();
    }
  }

  set healthBarIsVisible(isVisible: boolean) {
    this.healthBar.setVisible(isVisible);
  }

  /**
   * Set player as dead
   */
  kill() {
    this._isDead = true;
  }
  
  /**
   * Set player as alive
   */
  revive() {
    this._isDead = false;
  }

  get isDead() {
    return this._isDead;
  }

  setThrowableWeapon(weaponGroup: Phaser.Physics.Arcade.Group) {
    this.throwableWeaponGroup = weaponGroup;
  }

  shootThrowableWeapon(): void {}
}
