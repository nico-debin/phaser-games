import Phaser from "phaser";
import FontKeys from "../consts/FontKeys";
import TextureKeys from "../consts/TextureKeys";

export default class CheckboxInput {
  private isChecked: boolean = false;

  private checkboxOnImage: Phaser.GameObjects.Image;
  private checkboxOffImage: Phaser.GameObjects.Image;
  private checkboxLabel: Phaser.GameObjects.BitmapText;

  private onCheckCallback: () => void = () => null;
  private onUncheckCallback: () => void = () => null;

  constructor(
    scene: Phaser.Scene,
    x: number = 0,
    y: number = 0,
    label: string = "",
    initialValue: boolean = false
  ) {
    this.isChecked = initialValue;

    // Fonts renders blury if x and y aren't integers
    const sanitizedX = Math.round(x);
    const sanitizedY = Math.round(y);

    const doToggle = () => this.toggle();

    this.checkboxOnImage = scene.add
      .image(sanitizedX, sanitizedY, TextureKeys.UIMenu1, "checkbox-on")
      .setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, doToggle);
    this.checkboxOffImage = scene.add
      .image(sanitizedX, sanitizedY, TextureKeys.UIMenu1, "checkbox-off")
      .setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, doToggle);

    this.checkboxLabel = scene.add.bitmapText(sanitizedX, sanitizedY, FontKeys.GEM, label, 16).setTint(0x000000);

    this.isChecked ? this.check() : this.uncheck();
  }

  setOrigin(x: number, y?: number): CheckboxInput {
    this.checkboxOnImage.setOrigin(x, y || x);
    this.checkboxOffImage.setOrigin(x, y || x);
    this.checkboxLabel
      .setOrigin(x, y || x)
      .setPosition(
        this.checkboxOnImage.x + this.checkboxOnImage.displayWidth * x + 10,
        this.checkboxOnImage.y
      );
    return this;
  }

  setScale(x: number, y?: number): CheckboxInput {
    this.checkboxOnImage.setScale(x, y || x);
    this.checkboxOffImage.setScale(x, y || x);
    return this;
  }

  setVisible(visible: boolean): CheckboxInput {
    this.checkboxOnImage.setVisible(visible);
    this.checkboxOffImage.setVisible(visible);
    this.checkboxLabel.setVisible(visible);
    return this;
  }

  onCheck(fn: () => void): CheckboxInput {
    this.onCheckCallback = fn;
    return this;
  }

  onUncheck(fn: () => void): CheckboxInput {
    this.onUncheckCallback = fn;
    return this;
  }

  check(): void {
    this.isChecked = true;
    this.checkboxOnImage.setVisible(this.isChecked);
    this.checkboxOffImage.setVisible(!this.isChecked);
    this.onCheckCallback();
  }

  uncheck(): void {
    this.isChecked = false;
    this.checkboxOnImage.setVisible(this.isChecked);
    this.checkboxOffImage.setVisible(!this.isChecked);
    this.onUncheckCallback();
  }

  toggle(): void {
    this.isChecked ? this.uncheck() : this.check();
  }
}
