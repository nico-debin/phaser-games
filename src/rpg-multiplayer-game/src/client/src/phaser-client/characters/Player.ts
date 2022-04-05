import Phaser from 'phaser'
import HealthBar from '../classes/HealthBar';

import { MovementInput, Orientation, PlayerId } from '../types/playerTypes'

export default abstract class Player extends Phaser.GameObjects.Sprite {
  private playerId: PlayerId
  protected _orientation: Orientation;
  protected throwableWeaponGroup?: Phaser.Physics.Arcade.Group;
  protected _isDead: boolean = false;
  protected healthBar: HealthBar;
  protected usernameLabel?: Phaser.GameObjects.Text;
  protected displayUsernameLabel = false;
  protected _enableBlood = true;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, playerId: string, frame?: string | number | undefined) {
    super(scene, x, y, texture)
    this.playerId = playerId
    this._orientation = 'down'

    this.healthBar = new HealthBar(scene, 0, 0, this.displayWidth, 10, true).setVisible(false);
  }

  get id (){
    return this.playerId
  }

  get orientation (): Orientation {
    return this._orientation;
  }

  get enableBlood(): boolean {
    return this._enableBlood;
  }

  set enableBlood (value: boolean) {
    this._enableBlood = value;
  }

  destroy (fromScene?: boolean | undefined) {
    super.destroy(fromScene);
    this.healthBar.destroy();
    this.usernameLabel?.destroy();
  }

  update(movementInput: MovementInput) {
    if (this.isDead) return;

    this.updateHealthBarPosition();

    if (movementInput.left) {
      this._orientation = 'left';
    } else if (movementInput.right) {
      this._orientation = 'right';
    } else if (movementInput.up) {
      this._orientation = 'up';
    } else if (movementInput.down) {
      this._orientation = 'down';
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
    isVisible && this.updateHealthBarPosition();
  }

  private updateHealthBarPosition(): void {
    const offset = this.displayUsernameLabel ? 8 : 0;
    this.healthBar.setPosition(this.x, this.y + this.displayHeight * 0.5 + 5 + offset, true);
  }

  /**
   * Set player as fight winner
   */
  winner() {
    // Override this method on child classes
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

  setRenderUsername(newValue: boolean): this {
    this.displayUsernameLabel = newValue;
    this.updateHealthBarPosition();
    return this;
  }
}
