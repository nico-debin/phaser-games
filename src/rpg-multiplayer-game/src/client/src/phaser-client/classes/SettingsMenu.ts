import Phaser from "phaser";
import { autorun } from "mobx";

import AbstractMenu from "./AbstractMenu";
import { gameState } from "../states/GameState";
import CheckboxInput from "./CheckboxInput";
import FontKeys from "../consts/FontKeys";

export default class SettingsMenu extends AbstractMenu {
  voterCheckbox: CheckboxInput;
  hidePlayersWhileVotingCheckbox: CheckboxInput;
  showPlayersUsernamesCheckbox: CheckboxInput;
  disableRainCheckbox: CheckboxInput;
  disableBloodCheckbox: CheckboxInput;
  sectionHeader1: Phaser.GameObjects.BitmapText;
  sectionHeader2: Phaser.GameObjects.BitmapText;

  constructor(scene: Phaser.Scene) {
    super(scene);

    this.menuTitle.setText("SETTINGS");

    const menuBoardScaledPositionX =
      this.menuBoard.x - this.menuBoard.displayWidth * this.menuBoard.originX;
    const menuBoardScaledPositionY =
      this.menuBoard.y - this.menuBoard.displayHeight * this.menuBoard.originY;
    
    const lineHeight = 40;
    const sectionHeight = lineHeight + 12;

    this.sectionHeader1 = scene.add
      .bitmapText(
        menuBoardScaledPositionX + 55,
        menuBoardScaledPositionY + 110,
        FontKeys.GOTHIC,
        "Game Settings",
        20
      )
      .setTint(0x000000)
      .setOrigin(0)
      .setVisible(false);

    this.voterCheckbox = new CheckboxInput(
      scene,
      menuBoardScaledPositionX + 70,
      this.sectionHeader1.y + sectionHeight,
      "I'm a voter"
    )
      .setScale(0.2)
      .setOrigin(0.5, 0.5)
      .setVisible(false)
      .onCheck(() => {
        const currentPlayer = gameState.currentPlayer;
        currentPlayer &&
          gameState.updatePlayerSettings(currentPlayer.id, {
            ...currentPlayer,
            isVoter: true,
          });
      })
      .onUncheck(() => {
        const currentPlayer = gameState.currentPlayer;
        currentPlayer &&
          gameState.updatePlayerSettings(currentPlayer.id, {
            ...currentPlayer,
            isVoter: false,
          });
      });

    this.hidePlayersWhileVotingCheckbox = new CheckboxInput(
      scene,
      this.voterCheckbox.x,
      this.voterCheckbox.y + lineHeight,
      "Hide players while voting",
      gameState.hidePlayersWhileVoting
    )
      .setScale(0.2)
      .setOrigin(0.5, 0.5)
      .setVisible(false)
      .onCheck(() => {
        const currentPlayer = gameState.currentPlayer;
        currentPlayer &&
          gameState.updatePlayerSettings(currentPlayer.id, {
            ...currentPlayer,
            hidePlayersWhileVoting: true,
          });
      })
      .onUncheck(() => {
        const currentPlayer = gameState.currentPlayer;
        currentPlayer &&
          gameState.updatePlayerSettings(currentPlayer.id, {
            ...currentPlayer,
            hidePlayersWhileVoting: false,
          });
      });

    this.showPlayersUsernamesCheckbox = new CheckboxInput(
      scene,
      this.hidePlayersWhileVotingCheckbox.x,
      this.hidePlayersWhileVotingCheckbox.y + lineHeight,
      "Show players' usernames",
      gameState.showPlayersUsernames
    )
      .setScale(0.2)
      .setOrigin(0.5, 0.5)
      .setVisible(false)
      .onCheck(() => {
        gameState.showPlayersUsernames = true;
      })
      .onUncheck(() => {
        gameState.showPlayersUsernames = false;
      });

    this.sectionHeader2 = scene.add
    .bitmapText(
      this.sectionHeader1.x,
      this.showPlayersUsernamesCheckbox.y + lineHeight,
      FontKeys.GOTHIC,
      "VFX Settings",
      20
    )
    .setTint(0x000000)
    .setOrigin(0)
    .setVisible(false);

    this.disableRainCheckbox = new CheckboxInput(
      scene,
      this.showPlayersUsernamesCheckbox.x,
      this.sectionHeader2.y + sectionHeight,
      "Disable rain",
      !gameState.rainFlagEnabled
    )
      .setScale(0.2)
      .setOrigin(0.5, 0.5)
      .setVisible(false)
      .onCheck(() => {
        gameState.disableRainFlag()
      })
      .onUncheck(() => {
        gameState.enableRainFlag()
      });

    this.disableBloodCheckbox = new CheckboxInput(
      scene,
      this.disableRainCheckbox.x,
      this.disableRainCheckbox.y + lineHeight,
      "Disable blood",
      !gameState.bloodFlagEnabled
    )
      .setScale(0.2)
      .setOrigin(0.5, 0.5)
      .setVisible(false)
      .onCheck(() => {
        gameState.disableBloodFlag()
      })
      .onUncheck(() => {
        gameState.enableBloodFlag()
      });

    // wait until the current player state is built to set the according settings
    autorun((reaction) => {
      const { currentPlayer } = gameState;
      if (currentPlayer) {
        this.voterCheckbox.setInitialValue(currentPlayer.isVoter);
        this.hidePlayersWhileVotingCheckbox.setInitialValue(
          currentPlayer.hidePlayersWhileVoting
        );
        reaction.dispose(); // Run only once
      }
    });
  }

  openMenu() {
    if (this.menuIsOpen) return;
    super.openMenu();
    this.sectionHeader1.setVisible(true);
    this.voterCheckbox.setVisible(true);
    this.hidePlayersWhileVotingCheckbox.setVisible(true);
    this.showPlayersUsernamesCheckbox.setVisible(true);
    this.sectionHeader2.setVisible(true);
    this.disableRainCheckbox.setVisible(true);
    this.disableBloodCheckbox.setVisible(true);
  }

  closeMenu() {
    if (!this.menuIsOpen) return;
    super.closeMenu();
    this.sectionHeader1.setVisible(false);
    this.voterCheckbox.setVisible(false);
    this.hidePlayersWhileVotingCheckbox.setVisible(false);
    this.showPlayersUsernamesCheckbox.setVisible(false);
    this.sectionHeader2.setVisible(false);
    this.disableRainCheckbox.setVisible(false);
    this.disableBloodCheckbox.setVisible(false);
  }
}
