import Phaser from 'phaser'

import { autorun } from 'mobx'
import { gameVotingManager } from '../classes/GameVotingManager'
import { gameState } from "../states/GameState";
import TextureKeys from '../consts/TextureKeys';

export default class Hud extends Phaser.Scene {
  private votingLabel!: Phaser.GameObjects.Text
  private votingStatsLabel!: Phaser.GameObjects.Text

  constructor() {
    super('hud')
  }

  create() {
    this.add.image(10, 10, TextureKeys.UIMenu1, 'wood-small').setOrigin(0, 0).setScale(0.4)

    this.votingStatsLabel = this.add.text(24, 27, '', {
      fontFamily: 'AdvoCut',
      fontSize: '64px',
      color: '#000000',
    }).setScale(0.3)
    
    this.votingLabel = this.add.text(10, 100, '', {
      fontFamily: 'AdvoCut',
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#333333'
    })

    // Update labels
    autorun(() => {
      this.setVotingLabel()
      this.setVotingStatsLabel()
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