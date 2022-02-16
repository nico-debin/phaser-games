import Phaser from "phaser";
import { autorun } from "mobx";

import AbstractMenu from "./AbstractMenu";
import { gameState } from "../states/GameState";
import CheckboxInput from "./CheckboxInput";

export default class SettingsMenu extends AbstractMenu {
  voterCheckbox: CheckboxInput;
  hidePlayersWhileVotingCheckbox: CheckboxInput;

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

    // wait until the current player state is built to set the according settings
    autorun((reaction) => {
      const { currentPlayer, hidePlayersWhileVoting } = gameState;
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
    super.openMenu();
    this.voterCheckbox.setVisible(true);
    this.hidePlayersWhileVotingCheckbox.setVisible(true);
  }

  closeMenu() {
    super.closeMenu();
    this.voterCheckbox.setVisible(false);
    this.hidePlayersWhileVotingCheckbox.setVisible(false);
  }
}
