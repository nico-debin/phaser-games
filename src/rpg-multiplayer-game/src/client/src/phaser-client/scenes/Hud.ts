import Phaser from 'phaser';

import { autorun } from 'mobx';
import { gameVotingManager } from '../classes/GameVotingManager';
import { gameState } from '../states/GameState';
import TextureKeys from '../consts/TextureKeys';
import SettingsMenu from '../classes/SettingsMenu';
import FontKeys from '../consts/FontKeys';
import EndOfVotingMenu from '../classes/EndOfVotingMenu';
import SceneKeys from '../consts/SceneKeys';
import Modal from '../classes/Modal';

export default class Hud extends Phaser.Scene {
  private votingStats!: Phaser.GameObjects.Group;
  private votingStatsLabel!: Phaser.GameObjects.BitmapText;
  private settingsMenu!: SettingsMenu;
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
        settingsWheelIcon.setVisible(false);
        this.votingStats.setVisible(false);
        gameState.playerCanMove = false;
      })
      .onClose(() => {
        settingsButton.setVisible(true);
        settingsWheelIcon.setVisible(true);
        this.votingStats.setVisible(false);
        gameState.playerCanMove = true;
      });

    const settingsButton = this.add
      .image(width - 10, 10, TextureKeys.UIMenu1, 'yellow-button')
      .setScale(0.2)
      .setOrigin(1, 0);
    const settingsWheelIcon = this.add
      .image(width - 17, 17, TextureKeys.UIMenu1, 'wheel-icon')
      .setScale(0.2)
      .setOrigin(1, 0);

    settingsButton
      .setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
        settingsButton.setTint(0xdedede);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
        settingsButton.setTint(0xffffff);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
        settingsButton.setTint(0xf4bf19);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        settingsButton.setTint(0xffffff);
        this.settingsMenu.toggleMenu();
      });

    this.settingsMenu = new SettingsMenu(this);
    this.endOfVotingMenu = new EndOfVotingMenu(this);
    this.endOfVotingMenu
      .onOpen(() => {
        settingsButton.setVisible(false);
        settingsWheelIcon.setVisible(false);
        gameState.playerCanMove = false;
      })
      .onClose(() => {
        settingsButton.setVisible(true);
        settingsWheelIcon.setVisible(true);
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
    if (gameVotingManager.totalVotes === 0 || gameVotingManager.pendingVotes === 0) {
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
