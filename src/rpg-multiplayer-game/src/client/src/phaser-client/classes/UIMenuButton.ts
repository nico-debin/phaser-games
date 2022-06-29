import Phaser from 'phaser';
import FontKeys from '../consts/FontKeys';
import TextureKeys from '../consts/TextureKeys';

export default class UIMenuButton extends Phaser.GameObjects.Container {
  protected button!: Phaser.GameObjects.Image;
  protected label!: Phaser.GameObjects.BitmapText;
  protected onInteraction: () => void;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    label: string = '',
    onInteraction?: () => void,
  ) {
    super(scene, x, y);

    this.createButton();
    this.createLabel(label);

    this.onInteraction = onInteraction || (() => {});
    this.setInteraction();
  }

  protected createButton(
  ): void {
    // Create button
    this.button = this.scene.make
      .image({
        key: TextureKeys.UIMenu1,
        frame: 'green-wood-button',
      })
      .setScale(0.3)
      .setOrigin(0.5);

    // Add image to container
    this.add(this.button);
  }

  protected createLabel(label: string): void {
    this.label = this.scene.add
      .bitmapText(this.button.x, this.button.y, FontKeys.GEM, label, 16)
      .setOrigin(0.5);

    // Add text to container
    this.add(this.label);
  }

  protected setInteraction(): void {
    const hitArea = new Phaser.Geom.Rectangle(
      0 - this.button.displayWidth / 2,
      0 - this.button.displayHeight / 2,
      this.button.displayWidth,
      this.button.displayHeight,
    );

    this.setInteractive({
      hitArea,
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      useHandCursor: true,
    })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
        this.button.setTint(0xdedede);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
        this.button.setTint(0xffffff);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        this.button.setTint(0xffffff);
        this.onInteraction();
      });
  }
}
