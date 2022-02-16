import Phaser from 'phaser'

import { autorun } from 'mobx'
import { gameVotingManager } from '../classes/GameVotingManager'
import { gameState } from "../states/GameState";
import TextureKeys from '../consts/TextureKeys';
import SettingsMenu from '../classes/SettingsMenu';
import FontKeys from '../consts/FontKeys';
import EndOfVotingMenu from '../classes/EndOfVotingMenu';

export default class Hud extends Phaser.Scene {
  private votingLabel!: Phaser.GameObjects.Text
  private votingStatsLabel!: Phaser.GameObjects.BitmapText
  private settingsMenu!: SettingsMenu;
  private endOfVotingMenu!: EndOfVotingMenu;

  constructor() {
    super('hud')
  }

  create() {
    this.add.image(10, 10, TextureKeys.UIMenu1, 'wood-small').setOrigin(0, 0).setScale(0.4)

    this.votingStatsLabel = this.add.bitmapText(25, 30, FontKeys.GEM, '', 16).setTint(0x000000);
    
    this.votingLabel = this.add.text(10, 100, '', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#333333'
    })

    const { width } = this.scale

    const settingsButton = this.add.image(width - 10, 10, TextureKeys.UIMenu1, 'yellow-button').setScale(0.20).setOrigin(1, 0);
    const settingsWheelIcon = this.add.image(width - 17, 17, TextureKeys.UIMenu1, 'wheel-icon').setScale(0.20).setOrigin(1, 0);

    settingsButton.setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
        settingsButton.setTint(0xdedede)
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
        settingsButton.setTint(0xffffff)
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
        settingsButton.setTint(0xf4bf19)
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        settingsButton.setTint(0xffffff)
        this.settingsMenu.toggleMenu()
      })
    
    this.settingsMenu = new SettingsMenu(this);
    this.endOfVotingMenu = new EndOfVotingMenu(this);
    this.endOfVotingMenu.onOpen(() => {
      settingsButton.setVisible(false)
      settingsWheelIcon.setVisible(false)
      gameState.playerCanMove = false
    }).onClose(() => {
      settingsButton.setVisible(true)
      settingsWheelIcon.setVisible(true)
      gameState.playerCanMove = true
    })

    // Update labels
    autorun(() => {
      this.setVotingLabel()
      this.setVotingStatsLabel()
    })

    // Show/hide voting results menu
    autorun(() => {
      gameVotingManager.votingIsClosed ? this.endOfVotingMenu.openMenu() : this.endOfVotingMenu.closeMenu()
    })
  }

  setVotingLabel() {
    const labels: string[] = [];
    for (const playerId in gameVotingManager.votesByPlayer) {
      const vote = gameVotingManager.votesByPlayer[playerId].vote
      if (!vote) continue;
      
      const player = gameState.getPlayer(playerId)
      if (!player) continue;

      if (player.isCurrentPlayer) {
        labels.unshift(`You estimated ${vote}`)
      } else {
        labels.push(`${player.username} estimated: ${vote}`)
      }
    }

    this.votingLabel.setText(labels.join('\n'))
  }

  setVotingStatsLabel() {
    const votingStats = gameVotingManager.getStats()
    const votingStatsTextArray = [
      `Total votes: ${votingStats.totalVotes}`,
      `Pending votes: ${votingStats.pendingVotes}`,
    ]
    this.votingStatsLabel.setText(votingStatsTextArray.join('\n'))
  }
}