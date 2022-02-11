import Phaser from "phaser";
import TextureKeys from "../consts/TextureKeys";
export default class SettingsMenu {
  scene: Phaser.Scene;
  menuIsOpen: boolean = false;
  settingsBoard: Phaser.GameObjects.Image;
  closeButton: Phaser.GameObjects.Image;
  baseBackgroundColor: Phaser.Display.Color;

  constructor(scene: Phaser.Scene) {
    const { width, height } = scene.scale;
    this.scene = scene;
    this.settingsBoard = scene.add
      .image(width * 0.5, height * 0.5, TextureKeys.SettingsBoard)
      .setOrigin(0.5, 0.5)
      .setScale(0.2)
      .setVisible(false);
    this.closeButton = scene.add
      .image(
        width * 0.5 + this.settingsBoard.displayWidth * 0.5 - 30,
        height * 0.5 - this.settingsBoard.displayHeight * 0.5 + 88,
        TextureKeys.UIMenu1,
        "close-button"
      )
      .setOrigin(0.5, 0.5)
      .setScale(0.2)
      .setVisible(false)
      .setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
        this.closeButton.setTint(0xdedede)
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
        this.closeButton.setTint(0xffffff)
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        this.closeMenu()
      })
    this.baseBackgroundColor = scene.cameras.main.backgroundColor;
  }

  toggleMenu() {
    this.menuIsOpen ? this.closeMenu() : this.openMenu();
  }

  openMenu() {
    this.menuIsOpen = true;
    this.settingsBoard.setVisible(true);
    this.closeButton.setVisible(true);
    this.scene.cameras.main.setBackgroundColor("rgba(51, 51, 51, 0.6)");
  }

  closeMenu() {
    this.menuIsOpen = false;
    this.settingsBoard.setVisible(false);
    this.closeButton.setVisible(false);
    this.scene.cameras.main.setBackgroundColor("rgba(0, 0, 0, 0)");
  }
}
