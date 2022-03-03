import Phaser from "phaser";
import { Orientation, PlayerId } from "../types/playerTypes";

export default class AbstractThrowableWeapon extends Phaser.Physics.Arcade.Image {
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

    const vec = this.getVectorFromOrientation(orientation);
    const angle = vec.angle();

    // Rotate the image according to the orientation
    this.setRotation(angle);

    // Speed
    const velocity = 500;
    this.setVelocity(vec.x * velocity, vec.y * velocity);

    // Make sure it's visible and active
    this.setActive(true);
    this.setVisible(true);

    // Make sure the body is enabled
    this.enableBody(true, x, y, true, true);

    // Body size is 1 pixel
    this.body.setSize(1, 1, true);
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
