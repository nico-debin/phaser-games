import Phaser from "phaser";
import { autorun } from "mobx";

import FontKeys from "../consts/FontKeys";
import TextureKeys from "../consts/TextureKeys";
import { gameState } from "../states/GameState";
import CheckboxInput from "./CheckboxInput";
export default class SettingsMenu {
  scene: Phaser.Scene;
  menuIsOpen: boolean = false;
  settingsBoard: Phaser.GameObjects.Image;
  closeButton: Phaser.GameObjects.Image;
  baseBackgroundColor: Phaser.Display.Color;
  settingsTitle: Phaser.GameObjects.BitmapText;
  voterCheckbox: CheckboxInput;

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
        this.closeButton.setTint(0xdedede);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
        this.closeButton.setTint(0xffffff);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        this.closeMenu();
      });
    this.baseBackgroundColor = scene.cameras.main.backgroundColor;
    this.settingsTitle = scene.add
      .bitmapText(
        Math.round(this.settingsBoard.x),
        Math.round(this.settingsBoard.y -
          this.settingsBoard.displayHeight * this.settingsBoard.originY +
          30),
        FontKeys.GOTHIC,
        "SETTINGS",
        28
      )
      .setTint(0xffffff)
      .setOrigin(0.5, 0.5)
      .setVisible(false);

    this.voterCheckbox = new CheckboxInput(
      scene,
      this.settingsBoard.x -
        this.settingsBoard.displayWidth * this.settingsBoard.originX +
        60,
      this.settingsBoard.y -
        this.settingsBoard.displayHeight * this.settingsBoard.originY +
        110,
      "I'm a voter",
    )
      .setOrigin(0.5, 0.5)
      .setScale(0.2)
      .setVisible(false)
      .onCheck(() => {
        const currentPlayer = gameState.currentPlayer
        currentPlayer && gameState.updatePlayerSettings(currentPlayer.id, {
          ...currentPlayer,
          isVoter: true
        })
      })
      .onUncheck(() => {
        const currentPlayer = gameState.currentPlayer
        currentPlayer && gameState.updatePlayerSettings(currentPlayer.id, {
          ...currentPlayer,
          isVoter: false
        })
      });

    // wait until the current player state is built to set the according settings
    autorun((reaction) => {
      const currentPlayer = gameState.currentPlayer
      if (currentPlayer) {
        this.voterCheckbox.setInitialValue(currentPlayer.isVoter)
        reaction.dispose(); // Run only once
      }
    })
  }

  toggleMenu() {
    this.menuIsOpen ? this.closeMenu() : this.openMenu();
  }

  openMenu() {
    this.menuIsOpen = true;
    this.settingsBoard.setVisible(true);
    this.closeButton.setVisible(true);
    this.settingsTitle.setVisible(true);
    this.voterCheckbox.setVisible(true);
    this.scene.cameras.main.setBackgroundColor("rgba(51, 51, 51, 0.6)");
  }

  closeMenu() {
    this.menuIsOpen = false;
    this.settingsBoard.setVisible(false);
    this.closeButton.setVisible(false);
    this.settingsTitle.setVisible(false);
    this.voterCheckbox.setVisible(false);
    this.scene.cameras.main.setBackgroundColor("rgba(0, 0, 0, 0)");
  }
}
