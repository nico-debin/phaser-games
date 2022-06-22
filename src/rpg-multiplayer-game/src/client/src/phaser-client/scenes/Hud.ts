import Phaser from 'phaser';
import BaseScene from './BaseScene';

import { autorun } from 'mobx';
import { gameVotingManager } from '../classes/GameVotingManager';
import { gameState } from '../states/GameState';
import TextureKeys from '../consts/TextureKeys';
import SettingsMenu from '../classes/SettingsMenu';
import FontKeys from '../consts/FontKeys';
import EndOfVotingMenu from '../classes/EndOfVotingMenu';
import SceneKeys from '../consts/SceneKeys';
import Modal from '../classes/Modal';
import UIButton from '../classes/UIButton';
import UIAdminButton from '../classes/UIAdminButton';
import AdminDashboardMenu from '../classes/AdminDashboardMenu';


export default class Hud extends BaseScene {
  private votingStats!: Phaser.GameObjects.Group;
  private votingStatsLabel!: Phaser.GameObjects.BitmapText;
  private settingsMenu!: SettingsMenu;
  private adminDashboardMenu?: AdminDashboardMenu;
  private endOfVotingMenu!: EndOfVotingMenu;
  private newFightModal!: Modal;
  private pendingVotersLabel!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: SceneKeys.Hud });
  }

  create() {
    this.cameras.main.setRoundPixels(true);
    const { height, width } = this.scale;

    const votingLabelBackground = this.add
      .image(10, 10, TextureKeys.UIMenu1, 'wood-small')
      .setOrigin(0, 0)
      .setScale(0.4);

    this.votingStatsLabel = this.add
      .bitmapText(25, 30, FontKeys.GEM, '', 16)
      .setTint(0x000000);

    this.votingStats = this.add.group();
    this.votingStats.add(votingLabelBackground);
    this.votingStats.add(this.votingStatsLabel);

    this.pendingVotersLabel = this.add
      .text(10, height - 50, '', {
        fontSize: '16px',
        color: '#ffffff',
        backgroundColor: '#333333',
        padding: { left: 5, right: 5, top: 5, bottom: 5 },
        wordWrap: { width, useAdvancedWrap: true },
      })
      .setAlpha(0.8);

    this.newFightModal = new Modal(
      this,
      'A NEW FIGHT IS ABOUT TO BEGIN',
      'Waiting other players to join...',
      '10',
      "DON'T FIGHT",
      'JOIN FIGHT!',
    )
      .onConfirm(() => {
        gameState.gameFight.playerWantsToFight = true;
        this.newFightModal.hideButtons();
      })
      .onCancel(() => this.newFightModal.hideButtons())
      .onOpen(() => {
        settingsButton.setVisible(false);
        adminSettingsButton.setVisible(false);
        this.votingStats.setVisible(false);
        gameState.playerCanMove = false;
      })
      .onClose(() => {
        settingsButton.setVisible(true);
        adminSettingsButton.setVisible(true);
        this.votingStats.setVisible(false);
        gameState.playerCanMove = true;
      });

    const settingsButton = new UIButton(
      this,
      width - 55,
      10,
      TextureKeys.UIMenu1,
      'wheel-icon',
      () => this.settingsMenu.toggleMenu(),
    );
    this.add.existing(settingsButton);

    const adminSettingsButton = new UIAdminButton(
      this,
      width - 110,
      10,
      TextureKeys.UIMenu1,
      'people-icon',
      () => this.adminDashboardMenu?.toggleMenu(),
    );
    this.add.existing(adminSettingsButton);

    this.settingsMenu = new SettingsMenu(this);
    if (gameState.isAdminMode()) {
      this.adminDashboardMenu = new AdminDashboardMenu(this);
    }
    this.endOfVotingMenu = new EndOfVotingMenu(this);
    this.endOfVotingMenu
      .onOpen(() => {
        settingsButton.setVisible(false);
        adminSettingsButton.setVisible(false);
        gameState.playerCanMove = false;
      })
      .onClose(() => {
        settingsButton.setVisible(true);
        adminSettingsButton.setVisible(true);
        gameState.playerCanMove = true;
      });

    // Update labels
    autorun(() => {
      this.setPendingVotersLabel();
      this.setVotingStatsLabel();
    });

    // Show/hide voting results menu
    autorun(() => {
      gameVotingManager.votingIsClosed
        ? this.endOfVotingMenu.openMenu()
        : this.endOfVotingMenu.closeMenu();
    });

    // Handle endOfVotingMenu to newFightModal switch
    autorun(() => {
      if (gameState.gameFight.fightMode || gameState.gameFight.onWaitingRoom) {
        this.votingStats.setVisible(false);
      } else {
        this.votingStats.setVisible(true);
      }

      if (gameState.gameFight.onWaitingRoom && !this.newFightModal.isOpen) {
        this.endOfVotingMenu.closeMenu();
        this.newFightModal.open();

        if (gameState.gameFight.playerWantsToFight) {
          this.newFightModal.hideButtons();
        }

        // Set time countdown
        let secondsToWait = 10; // TODO: Remove hardcoded value
        this.newFightModal.setBodyText(`${secondsToWait}`);
        const timedEvent = this.time.addEvent({
          delay: 1000,
          callback: () => {
            --secondsToWait === 0
              ? timedEvent.remove()
              : this.newFightModal.setBodyText(`${secondsToWait}`);
          },
          callbackScope: this,
          loop: true,
        });
      } else if (!gameState.gameFight.onWaitingRoom) {
        this.newFightModal.close();
      }
    });

    // Hide modal buttons when player wants to fight
    autorun(() => {
      if (gameState.gameFight.playerWantsToFight) {
        this.newFightModal.hideButtons();
      }
    });
  }

  setPendingVotersLabel() {
    const labels: string[] = [];
    if (
      gameVotingManager.totalVotes === 0 ||
      gameVotingManager.pendingVotes === 0
    ) {
      this.pendingVotersLabel.setText('').setVisible(false);
      return;
    }

    for (const playerId of gameVotingManager.pendingVoters) {
      const player = gameState.getPlayer(playerId);
      if (!player) continue;

      labels.push(`${player.username}`);
    }

    this.pendingVotersLabel
      .setText('Waiting votes from: ' + labels.join(', '))
      .setVisible(true);
  }

  setVotingStatsLabel() {
    const votingStats = gameVotingManager.getStats();
    const votingStatsTextArray = [
      `Total votes: ${votingStats.totalVotes}`,
      `Pending votes: ${votingStats.pendingVotes}`,
    ];
    this.votingStatsLabel.setText(votingStatsTextArray.join('\n'));
  }

  closeMenus() {
    this.settingsMenu.closeMenu();
    this.endOfVotingMenu.closeMenu();
  }
}
