import Phaser from "phaser";

export default class HealthBar {
  private bar: Phaser.GameObjects.Graphics;
  private x: number = 0;
  private y: number = 0;
  private value: number;
  private _width: number = 80;
  private _height: number = 16;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width = 80,
    height = 16,
    center = false
  ) {
    this.bar = new Phaser.GameObjects.Graphics(scene);

    this.value = 100;
    this._width = width;
    this._height = height;

    this.setPosition(x, y, center);

    scene.add.existing(this.bar);
  }

  destroy(fromScene?: boolean | undefined) {
    this.bar.destroy(fromScene);
  }

  set width(w: number) {
    this._width = w;
  }

  get width(): number {
    return this._width;
  }

  set height(h: number) {
    this._height = h;
  }

  get height(): number {
    return this._height;
  }

  setPosition(x: number, y: number, center = false): void {
    this.x = x;
    this.y = y;

    if (center) {
      this.x -= this.width * 0.5;
    }

    this.draw();
  }

  setValue(value: number): HealthBar {
    this.value = value;
    this.draw();
    return this;
  }

  setVisible(value: boolean): HealthBar {
    this.bar.setVisible(value);
    this.draw();
    return this;
  }

  decrease(amount: number): boolean {
    this.value -= amount;

    if (this.value < 0) {
      this.value = 0;
    }

    this.draw();

    return this.value === 0;
  }

  draw(): void {
    this.bar.clear();

    const alpha = 1.0;

    //  White Background
    this.bar.fillStyle(0x000000);
    this.bar.fillRect(this.x, this.y, this.width, this.height);

    //  Black border
    this.bar.fillStyle(0xffffff, alpha);
    this.bar.fillRect(this.x + 1, this.y + 1, this.width - 2, this.height - 2);

    // Fill with health color
    if (this.value < 30) {
      // Red
      this.bar.fillStyle(0xff0000, alpha);
    } else if (this.value <= 50) {
      // Orange
      this.bar.fillStyle(0xffa500, alpha);
    } else {
      // Green
      this.bar.fillStyle(0x00ff00, alpha);
    }

    // Calculate width based on health value
    const p = (this.width - 4) / 100;
    const healthWidth = Math.floor(p * this.value);

    this.bar.fillRect(this.x + 2, this.y + 2, healthWidth, this.height - 4);
  }
}
