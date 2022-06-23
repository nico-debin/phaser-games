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

    // Last Voting Results
    this.renderLastVotingResultsPanel();

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

    // Show message when player has been kicked-out from the game by the server
    autorun(() => {
      if (gameState.playerHasBeenKickedOut) {
        // Overlay
        this.cameras.main.setBackgroundColor('rgba(51, 51, 51, 0.6)');

        // Hide buttons
        settingsButton.setVisible(false);
        adminSettingsButton.setVisible(false);
        this.votingStats.setVisible(false);

        // Show message
        this.rexUI.add
          .sizer({
            x: this.scale.width / 2,
            y: this.scale.height / 2,
            width: 500,
            height: 50,
          })
          .add(
            this.rexUI.add.label({
              background: this.add.image(
                0,
                0,
                TextureKeys.UIMenu1,
                'wood-medium',
              ),
              text: this.add
                .bitmapText(
                  0,
                  0,
                  FontKeys.GEM,
                  'You have been kicked-out from the game by the server.',
                  24,
                )
                .setTint(0xa30000),
              align: 'center',
              space: {
                left: 60,
                right: 60,
                top: 70,
                bottom: 70,
                icon: 0,
              },
            }),
            {
              proportion: 1,
              align: 'center',
            },
          )
          .layout();

        this.scene.pause();
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

  private renderLastVotingResultsPanel(): void {
    const COLOR_PRIMARY = 0x8a5142;
    const COLOR_LIGHT = 0xd48d5d;
    const COLOR_DARK = 0x4e2623;
    const alpha = 0.7;

    const textArea = this.rexUI.add
      .textArea({
        width: 300,
        height: 150,
        x: this.scale.width - 150 - 5,
        y: this.scale.height - 75 - 5,
        draggable: false,
        background: this.rexUI.add.roundRectangle(
          0,
          0,
          2,
          2,
          2,
          COLOR_PRIMARY,
          0.5,
        ),
        slider: {
          track: this.rexUI.add.roundRectangle(
            0,
            0,
            20,
            10,
            10,
            COLOR_DARK,
            alpha,
          ),
          thumb: this.rexUI.add.roundRectangle(
            0,
            0,
            0,
            0,
            13,
            COLOR_LIGHT,
            alpha,
          ),
        },
        header: this.rexUI.add.label({
          height: 30,
          orientation: 'horizontal',
          background: this.rexUI.add.roundRectangle(
            0,
            0,
            20,
            20,
            0,
            COLOR_DARK,
            alpha,
          ),
          text: this.add.text(0, 0, 'Last voting results'),
          align: 'center',
        }),
        text: this.add.text(0, 0, ''),
        content:
          'pepito: 1\njuanito: 2\npepito: 1\njuanito: 2\npepito: 1\njuanito: 2\npepito: 1\njuanito: 2',
        space: {
          header: 0,
          text: { left: 5, right: 5 },
        },
      })
      .layout();

    textArea.setChildVisible(
      textArea.getElement('slider') as Phaser.GameObjects.GameObject,
      textArea.isOverflow,
    );
  }
}
