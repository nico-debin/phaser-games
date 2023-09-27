import Phaser from 'phaser';
import BaseScene from '../scenes/BaseScene';

import { autorun } from 'mobx';
import { gameState } from '../states/GameState';

import AbstractMenu from './AbstractMenu';
import FontKeys from '../consts/FontKeys';
import SettingsCheckboxInput from './SettingsCheckboxInput';

export default class SettingsMenu extends AbstractMenu {
  voterCheckbox: SettingsCheckboxInput;
  hidePlayersWhileVotingCheckbox: SettingsCheckboxInput;
  showPlayersUsernamesCheckbox: SettingsCheckboxInput;
  hideLastVotingResultsCheckbox: SettingsCheckboxInput;
  disableRainCheckbox: SettingsCheckboxInput;
  disableBloodCheckbox: SettingsCheckboxInput;
  sectionHeader1: Phaser.GameObjects.BitmapText;
  sectionHeader2: Phaser.GameObjects.BitmapText;

  constructor(scene: BaseScene) {
    super(scene);

    this.menuTitle.setText('SETTINGS');

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
        'Game Settings',
        20,
      )
      .setTint(0x000000)
      .setOrigin(0)
      .setVisible(false);

    this.voterCheckbox = new SettingsCheckboxInput(
      scene,
      menuBoardScaledPositionX + 70,
      this.sectionHeader1.y + sectionHeight,
      "I'm a voter",
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

    this.hidePlayersWhileVotingCheckbox = new SettingsCheckboxInput(
      scene,
      this.voterCheckbox.x,
      this.voterCheckbox.y + lineHeight,
      'Hide players while voting',
      gameState.hidePlayersWhileVoting,
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

    this.showPlayersUsernamesCheckbox = new SettingsCheckboxInput(
      scene,
      (gameState.isAdminMode()
        ? this.hidePlayersWhileVotingCheckbox
        : this.voterCheckbox
      ).x,
      (gameState.isAdminMode()
        ? this.hidePlayersWhileVotingCheckbox
        : this.voterCheckbox
      ).y + lineHeight,
      "Show players' usernames",
      gameState.showPlayersUsernames,
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

    this.hideLastVotingResultsCheckbox = new SettingsCheckboxInput(
      scene,
      this.showPlayersUsernamesCheckbox.x,
      this.showPlayersUsernamesCheckbox.y + lineHeight,
      'Hide last voting results',
      gameState.hideLastVotingResults,
    )
      .setScale(0.2)
      .setOrigin(0.5, 0.5)
      .setVisible(false)
      .onCheck(() => {
        gameState.hideLastVotingResults = true;
      })
      .onUncheck(() => {
        gameState.hideLastVotingResults = false;
      });

    this.sectionHeader2 = scene.add
      .bitmapText(
        this.sectionHeader1.x,
        this.hideLastVotingResultsCheckbox.y + lineHeight,
        FontKeys.GOTHIC,
        'VFX Settings',
        20,
      )
      .setTint(0x000000)
      .setOrigin(0)
      .setVisible(false);

    this.disableRainCheckbox = new SettingsCheckboxInput(
      scene,
      this.showPlayersUsernamesCheckbox.x,
      this.sectionHeader2.y + sectionHeight,
      'Disable rain',
      !gameState.rainFlagEnabled,
    )
      .setScale(0.2)
      .setOrigin(0.5, 0.5)
      .setVisible(false)
      .onCheck(() => {
        gameState.disableRainFlag();
      })
      .onUncheck(() => {
        gameState.enableRainFlag();
      });

    this.disableBloodCheckbox = new SettingsCheckboxInput(
      scene,
      this.disableRainCheckbox.x,
      this.disableRainCheckbox.y + lineHeight,
      'Disable blood',
      !gameState.bloodFlagEnabled,
    )
      .setScale(0.2)
      .setOrigin(0.5, 0.5)
      .setVisible(false)
      .onCheck(() => {
        gameState.disableBloodFlag();
      })
      .onUncheck(() => {
        gameState.enableBloodFlag();
      });

    // wait until the current player state is built to set the according settings
    autorun((reaction) => {
      const { currentPlayer } = gameState;
      if (currentPlayer) {
        this.voterCheckbox.setInitialValue(currentPlayer.isVoter);
        this.hidePlayersWhileVotingCheckbox.setInitialValue(
          currentPlayer.hidePlayersWhileVoting,
        );
        reaction.dispose(); // Run only once
      }
    });
  }

  openMenu(): void {
    if (this.menuIsOpen) return;
    super.openMenu();
    this.sectionHeader1.setVisible(true);
    this.voterCheckbox.setVisible(true);
    this.hidePlayersWhileVotingCheckbox.setVisible(gameState.isAdminMode());
    this.showPlayersUsernamesCheckbox.setVisible(true);
    this.hideLastVotingResultsCheckbox.setVisible(true);
    this.sectionHeader2.setVisible(true);
    this.disableRainCheckbox.setVisible(true);
    this.disableBloodCheckbox.setVisible(true);
  }

  closeMenu(): void {
    if (!this.menuIsOpen) return;
    super.closeMenu();
    this.sectionHeader1.setVisible(false);
    this.voterCheckbox.setVisible(false);
    this.hidePlayersWhileVotingCheckbox.setVisible(false);
    this.showPlayersUsernamesCheckbox.setVisible(false);
    this.hideLastVotingResultsCheckbox.setVisible(false);
    this.sectionHeader2.setVisible(false);
    this.disableRainCheckbox.setVisible(false);
    this.disableBloodCheckbox.setVisible(false);
  }
}
