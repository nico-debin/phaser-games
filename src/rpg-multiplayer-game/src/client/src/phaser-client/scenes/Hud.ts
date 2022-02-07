import Phaser from 'phaser'

import { autorun } from 'mobx'
import { gameVotingManager } from '../classes/GameVotingManager'
import SceneKeys from '../consts/SceneKeys'
import Game from './Game'
import { gameState } from "../states/GameState";

export default class Hud extends Phaser.Scene {
  private votingLabel!: Phaser.GameObjects.Text
  private votingStatsLabel!: Phaser.GameObjects.Text

  constructor() {
    super('hud')
  }

  create() {
    this.votingLabel = this.add.text(10, 50, '', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#333333'
    })

    this.votingStatsLabel = this.add.text(10, 10, '', {
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