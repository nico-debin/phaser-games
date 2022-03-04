import Phaser from "phaser";
import { Orientation, PlayerId } from "../types/playerTypes";

export default class ThrowableWeapon extends Phaser.Physics.Arcade.Image {
  protected _thrownBy: PlayerId | undefined;

  get thrownBy(): PlayerId {
    return this._thrownBy || "";
  }

  set thrownBy(id: PlayerId) {
    this._thrownBy = id;
  }

  fire(
    x: number,
    y: number,
    orientation: Orientation,
    thrownBy: PlayerId
  ): void {
    // Set the playerId who fired
    this.thrownBy = thrownBy;

    // Make sure it's active
    this.setActive(true);

    // UNCAUGHT BUG: For some reason I couldn't find yet, the player's
    // body needs to be moved by 16 pixels in X and Y. 
    // Remove this when the bug is fixed
    const errorOffset = 16;

    // Make sure the body is enabled
    this.enableBody(true, x + errorOffset, y + errorOffset, true, true);

    // Body size is 1 pixel
    this.body.setSize(1, 1, true);

    // Generate unit vector (vector unitario)
    const vec = this.getVectorFromOrientation(orientation);

    // Speed
    const velocity = 500;
    this.setVelocity(vec.x * velocity, vec.y * velocity);
  }

  protected getVectorFromOrientation(orientation: Orientation): Phaser.Math.Vector2 {
    const vec = new Phaser.Math.Vector2(0, 0);

    switch (orientation) {
      case "left":
        vec.x = -1;
        break;

      case "up":
        vec.y = -1;
        break;

      case "down":
        vec.y = 1;
        break;

      default:
      case "right":
        vec.x = 1;
        break;
    }

    return vec;
  }
}
