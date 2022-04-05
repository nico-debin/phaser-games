import Phaser from "phaser";
import { autorun } from "mobx";

import AbstractMenu from "./AbstractMenu";
import { gameState } from "../states/GameState";
import CheckboxInput from "./CheckboxInput";

export default class SettingsMenu extends AbstractMenu {
  voterCheckbox: CheckboxInput;
  hidePlayersWhileVotingCheckbox: CheckboxInput;
  showPlayersUsernamesCheckbox: CheckboxInput;
  disableRainCheckbox: CheckboxInput;
  disableBloodCheckbox: CheckboxInput;

  constructor(scene: Phaser.Scene) {
    super(scene);

    this.menuTitle.setText("SETTINGS");

    const menuBoardScaledPositionX =
      this.menuBoard.x - this.menuBoard.displayWidth * this.menuBoard.originX;
    const menuBoardScaledPositionY =
      this.menuBoard.y - this.menuBoard.displayHeight * this.menuBoard.originY;

    this.voterCheckbox = new CheckboxInput(
      scene,
      menuBoardScaledPositionX + 60,
      menuBoardScaledPositionY + 110,
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
      menuBoardScaledPositionX + 60,
      menuBoardScaledPositionY + 150,
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
      menuBoardScaledPositionX + 60,
      menuBoardScaledPositionY + 190,
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

    this.disableRainCheckbox = new CheckboxInput(
      scene,
      menuBoardScaledPositionX + 60,
      menuBoardScaledPositionY + 230,
      "Disable rain",
      !gameState.rainFlagEnabled
    )
      .setScale(0.2)
      .setOrigin(0.5, 0.5)
      .setVisible(false)
      .onCheck(() => {
        gameState.disableRainFlag()
        console.log(`gameState.rainFlagEnabled: ${gameState.rainFlagEnabled}`)
      })
      .onUncheck(() => {
        gameState.enableRainFlag()
        console.log(`gameState.rainFlagEnabled: ${gameState.rainFlagEnabled}`)
      });

    this.disableBloodCheckbox = new CheckboxInput(
      scene,
      menuBoardScaledPositionX + 60,
      menuBoardScaledPositionY + 270,
      "Disable blood",
      !gameState.bloodFlagEnabled
    )
      .setScale(0.2)
      .setOrigin(0.5, 0.5)
      .setVisible(false)
      .onCheck(() => {
        gameState.disableBloodFlag()
        console.log(`gameState.bloodFlagEnabled: ${gameState.bloodFlagEnabled}`)
      })
      .onUncheck(() => {
        gameState.enableBloodFlag()
        console.log(`gameState.bloodFlagEnabled: ${gameState.bloodFlagEnabled}`)
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
    this.voterCheckbox.setVisible(true);
    this.hidePlayersWhileVotingCheckbox.setVisible(true);
    this.showPlayersUsernamesCheckbox.setVisible(true);
    this.disableRainCheckbox.setVisible(true);
    this.disableBloodCheckbox.setVisible(true);
  }

  closeMenu() {
    if (!this.menuIsOpen) return;
    super.closeMenu();
    this.voterCheckbox.setVisible(false);
    this.hidePlayersWhileVotingCheckbox.setVisible(false);
    this.showPlayersUsernamesCheckbox.setVisible(false);
    this.disableRainCheckbox.setVisible(false);
    this.disableBloodCheckbox.setVisible(false);
  }
}
