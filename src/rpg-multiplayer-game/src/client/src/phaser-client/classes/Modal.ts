import Phaser from 'phaser';
import FontKeys from '../consts/FontKeys';
import TextureKeys from '../consts/TextureKeys';

export default class Modal {
  protected scene: Phaser.Scene;
  protected _isOpen: boolean = false;
  protected backgroundImage: Phaser.GameObjects.Image;
  protected title: Phaser.GameObjects.BitmapText;
  protected subtitle: Phaser.GameObjects.BitmapText;
  protected bodyText: Phaser.GameObjects.BitmapText;
  protected buttonsContainer!: Phaser.GameObjects.Container;
  protected onCancelCallback!: () => void;
  protected onConfirmCallback!: () => void;
  protected onOpenCallback: () => void;
  protected onCloseCallback: () => void;

  constructor(
    scene: Phaser.Scene,
    title = 'Default Title',
    subtitle = '',
    bodyText = '',
    cancelLabel = 'CANCEL',
    confirmLabel = 'CONFIRM',
  ) {
    const { width, height } = scene.scale;

    this.scene = scene;

    this.backgroundImage = this.scene.add
      .image(width * 0.5, height * 0.5, TextureKeys.Paper)
      .setVisible(this.isOpen);

    this.title = this.scene.add
      .bitmapText(
        this.backgroundImage.x,
        this.backgroundImage.y - this.backgroundImage.displayHeight * 0.2,
        FontKeys.GEM,
        title,
        25,
      )
      .setTint(0x000000)
      .setOrigin(0.5)
      .setVisible(this.isOpen);

    this.subtitle = this.scene.add
      .bitmapText(
        this.backgroundImage.x,
        this.title.y + 30,
        FontKeys.GEM,
        subtitle,
        16,
      )
      .setTint(0x000000)
      .setOrigin(0.5)
      .setVisible(this.isOpen);

    this.bodyText = this.scene.add
      .bitmapText(
        this.backgroundImage.x,
        this.subtitle.y + 40,
        FontKeys.GEM,
        bodyText,
        20,
      )
      .setTint(0x000000)
      .setOrigin(0.5)
      .setVisible(this.isOpen);

    this.onOpenCallback = () => null;
    this.onCloseCallback = () => null;

    this.createButtons(cancelLabel, confirmLabel);
  }

  get isOpen(): boolean {
    return this._isOpen;
  }

  private set isOpen(value: boolean) {
    this._isOpen = value;
  }

  private createButtons(cancelLabel: string, confirmLabel: string) {
    this.onCancelCallback = () => null;
    this.onConfirmCallback = () => null;

    this.buttonsContainer = this.scene.add.container().setVisible(this.isOpen);

    // CANCEL BUTTON
    const cancelButton = this.scene.add
      .image(
        this.backgroundImage.x - this.backgroundImage.displayWidth / 5,
        this.backgroundImage.y + this.backgroundImage.displayHeight / 4,
        TextureKeys.UIMenu1,
        'red-wood-button',
      )
      .setOrigin(0.5)
      .setScale(0.3)
      .setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
        cancelButton.setTint(0xdedede);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
        cancelButton.setTint(0xffffff);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        this.onCancelCallback();
      });

    const cancelButtonLabel = this.scene.add
      .bitmapText(
        cancelButton.x,
        cancelButton.y,
        FontKeys.GEM,
        cancelLabel,
        16,
        Phaser.GameObjects.BitmapText.ALIGN_CENTER,
      )
      .setOrigin(0.5);

    // RESTART BUTTON
    const confirmButton = this.scene.add
      .image(
        this.backgroundImage.x + this.backgroundImage.displayWidth / 5,
        cancelButton.y,
        TextureKeys.UIMenu1,
        'green-wood-button',
      )
      .setOrigin(0.5)
      .setScale(0.3)
      .setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
        confirmButton.setTint(0xdedede);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
        confirmButton.setTint(0xffffff);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        this.onConfirmCallback();
      });

    const confirmButtonLabel = this.scene.add
      .bitmapText(
        confirmButton.x,
        confirmButton.y,
        FontKeys.GEM,
        confirmLabel,
        16,
      )
      .setOrigin(0.5);

    this.buttonsContainer.add([
      cancelButton,
      cancelButtonLabel,
      confirmButton,
      confirmButtonLabel,
    ]);
  }

  onConfirm(fn: () => void): Modal {
    this.onConfirmCallback = fn;
    return this;
  }

  onCancel(fn: () => void): Modal {
    this.onCancelCallback = fn;
    return this;
  }

  onOpen(fn: () => void): Modal {
    this.onOpenCallback = fn;
    return this;
  }

  onClose(fn: () => void): Modal {
    this.onCloseCallback = fn;
    return this;
  }

  open() {
    if (this.isOpen) return;
    this.isOpen = true;
    this.backgroundImage.setVisible(true);
    this.title.setVisible(true);
    this.subtitle.setVisible(true);
    this.bodyText.setVisible(true);
    this.buttonsContainer.setVisible(true);

    this.scene.cameras.main.setBackgroundColor('rgba(51, 51, 51, 0.6)');

    this.onOpenCallback();
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.backgroundImage.setVisible(false);
    this.title.setVisible(false);
    this.subtitle.setVisible(false);
    this.bodyText.setVisible(false);
    this.buttonsContainer.setVisible(false);

    this.scene.cameras.main.setBackgroundColor('rgba(0, 0, 0, 0)');

    this.onCloseCallback();
  }

  hideButtons(): Modal {
    this.buttonsContainer.setVisible(false);
    return this;
  }

  setBodyText(text: string): Modal {
    this.bodyText.setText(text);
    return this;
  }
}
