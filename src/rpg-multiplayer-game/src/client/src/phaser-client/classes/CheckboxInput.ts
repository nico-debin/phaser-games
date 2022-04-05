import Phaser from 'phaser';
import FontKeys from '../consts/FontKeys';
import TextureKeys from '../consts/TextureKeys';

export default class CheckboxInput {
  private isChecked: boolean = false;
  private isVisible: boolean = true;

  private checkboxOnImage: Phaser.GameObjects.Image;
  private checkboxOffImage: Phaser.GameObjects.Image;
  private checkboxLabel: Phaser.GameObjects.BitmapText;

  private onCheckCallback: () => void = () => null;
  private onUncheckCallback: () => void = () => null;

  constructor(
    scene: Phaser.Scene,
    x: number = 0,
    y: number = 0,
    label: string = '',
    initialValue: boolean = false,
  ) {
    this.setInitialValue(initialValue);

    const doToggle = () => this.toggle();

    this.checkboxOnImage = scene.add
      .image(x, y, TextureKeys.UIMenu1, 'checkbox-on')
      .setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, doToggle);
    this.checkboxOffImage = scene.add
      .image(x, y, TextureKeys.UIMenu1, 'checkbox-off')
      .setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, doToggle);

    this.checkboxLabel = scene.add
      .bitmapText(x, y, FontKeys.GEM, label, 16)
      .setTint(0x000000)
      .setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, doToggle);

    this.isChecked ? this.check() : this.uncheck();
  }

  setInitialValue(initialValue: boolean) {
    this.isChecked = initialValue;
  }

  setOrigin(x: number, y?: number): CheckboxInput {
    this.checkboxOnImage.setOrigin(x, y || x);
    this.checkboxOffImage.setOrigin(x, y || x);
    this.checkboxLabel
      .setOrigin(0, y || x)
      .setPosition(
        this.checkboxOnImage.x + this.checkboxOnImage.displayWidth * x + 7,
        this.checkboxOnImage.y,
      );
    return this;
  }

  get x(): number {
    return this.checkboxOnImage.x;
  }

  get y(): number {
    return this.checkboxOnImage.y;
  }

  setScale(x: number, y?: number): CheckboxInput {
    this.checkboxOnImage.setScale(x, y || x);
    this.checkboxOffImage.setScale(x, y || x);
    return this;
  }

  setVisible(visible: boolean): CheckboxInput {
    this.isVisible = visible;

    if (visible) {
      if (this.isChecked) {
        this.checkboxOnImage.setVisible(true);
        this.checkboxOffImage.setVisible(false);
      } else {
        this.checkboxOnImage.setVisible(false);
        this.checkboxOffImage.setVisible(true);
      }
    } else {
      this.checkboxOnImage.setVisible(false);
      this.checkboxOffImage.setVisible(false);
    }
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
    this.updateRender();
    this.onCheckCallback();
  }

  uncheck(): void {
    this.isChecked = false;
    this.updateRender();
    this.onUncheckCallback();
  }

  toggle(): void {
    this.isChecked ? this.uncheck() : this.check();
  }

  private updateRender(): void {
    this.setVisible(this.isVisible);
  }
}
