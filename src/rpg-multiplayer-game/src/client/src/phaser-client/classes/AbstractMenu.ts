import Phaser from 'phaser';
import FontKeys from '../consts/FontKeys';

import TextureKeys from '../consts/TextureKeys';

type MenuOptions = {
  disableCloseButton?: boolean;
};
export default abstract class AbstractMenu {
  protected scene: Phaser.Scene;
  protected menuIsOpen: boolean = false;
  protected menuBoard: Phaser.GameObjects.Image;
  protected closeButton?: Phaser.GameObjects.Image;
  protected baseBackgroundColor: Phaser.Display.Color;
  protected menuTitle: Phaser.GameObjects.BitmapText;
  protected onOpenCallback: () => void;
  protected onCloseCallback: () => void;

  constructor(scene: Phaser.Scene, options: MenuOptions = {}) {
    const { width, height } = scene.scale;

    this.scene = scene;

    this.menuBoard = scene.add
      .image(width * 0.5, height * 0.5, TextureKeys.SettingsBoard)
      .setOrigin(0.5, 0.5)
      .setScale(0.8)
      .setVisible(false);

    if (options.disableCloseButton !== true) {
      this.closeButton = scene.add
        .image(
          width * 0.5 + this.menuBoard.displayWidth * 0.5 - 30,
          height * 0.5 - this.menuBoard.displayHeight * 0.5 + 88,
          TextureKeys.UIMenu1,
          'close-button',
        )
        .setOrigin(0.5, 0.5)
        .setScale(0.2)
        .setVisible(false)
        .setInteractive({ useHandCursor: true })
        .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
          this.closeButton?.setTint(0xdedede);
        })
        .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
          this.closeButton?.setTint(0xffffff);
        })
        .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
          this.closeMenu();
        });
    }

    this.baseBackgroundColor = scene.cameras.main.backgroundColor;

    this.menuTitle = scene.add
      .bitmapText(
        this.menuBoard.x,
        this.menuBoard.y -
          this.menuBoard.displayHeight * this.menuBoard.originY +
          30,
        FontKeys.GOTHIC,
        'ABSTRACT MENU',
        28,
      )
      .setTint(0xffffff)
      .setOrigin(0.5, 0.5)
      .setVisible(false);

    this.onOpenCallback = () => null;
    this.onCloseCallback = () => null;
  }

  toggleMenu(): void {
    this.menuIsOpen ? this.closeMenu() : this.openMenu();
  }

  openMenu(): void {
    if (this.menuIsOpen) return;
    this.menuIsOpen = true;
    this.menuBoard.setVisible(true);
    this.closeButton?.setVisible(true);
    this.menuTitle.setVisible(true);

    this.scene.cameras.main.setBackgroundColor('rgba(51, 51, 51, 0.6)');
    this.onOpenCallback();
  }

  closeMenu(): void {
    if (!this.menuIsOpen) return;
    this.menuIsOpen = false;
    this.menuBoard.setVisible(false);
    this.closeButton?.setVisible(false);
    this.menuTitle.setVisible(false);

    this.scene.cameras.main.setBackgroundColor('rgba(0, 0, 0, 0)');
    this.onCloseCallback();
  }

  onOpen(fn: () => void): AbstractMenu {
    this.onOpenCallback = fn;
    return this;
  }

  onClose(fn: () => void): AbstractMenu {
    this.onCloseCallback = fn;
    return this;
  }
}
