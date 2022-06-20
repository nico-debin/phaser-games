import Phaser from 'phaser';
import TextureKeys from '../consts/TextureKeys';

export default class UIButton extends Phaser.GameObjects.Container {
  protected button!: Phaser.GameObjects.Image;
  protected icon!: Phaser.GameObjects.Image;
  protected onInteraction: () => void;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    iconTexture: string | Phaser.Textures.Texture,
    iconFrame: string | number | undefined,
    onInteraction?: () => void,
  ) {
    super(scene, x, y);

    this.createButton(iconTexture, iconFrame);

    this.onInteraction = onInteraction || (() => {});
    this.setInteraction();
  }

  protected createButton(
    iconTexture: string | Phaser.Textures.Texture,
    iconFrame: string | number | undefined,
  ): void {
    // Create button
    this.button = this.scene.make
      .image({
        key: TextureKeys.UIMenu1,
        frame: 'yellow-button',
      })
      .setScale(0.2)
      .setOrigin(0, 0);

    // Create Icon
    this.icon = this.scene.make
      .image({
        x: this.button.displayWidth * 0.5,
        y: this.button.displayHeight * 0.5,
        key: iconTexture,
        frame: iconFrame,
      })
      .setScale(0.2)
      .setOrigin(0.5, 0.5);

    // Add images to container
    this.add([this.button, this.icon]);
  }

  protected setInteraction(): void {
    const hitArea = new Phaser.Geom.Circle(
      this.button.displayWidth * 0.5,
      this.button.displayHeight * 0.5,
      this.button.displayWidth * 0.5 - 1,
    );

    this.setInteractive({
      hitArea,
      hitAreaCallback: Phaser.Geom.Circle.Contains,
      useHandCursor: true,
    })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
        this.button.setTint(0xdedede);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
        this.button.setTint(0xffffff);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
        this.button.setTint(0xf4bf19);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        this.button.setTint(0xffffff);
        this.onInteraction();
      });
  }
}
