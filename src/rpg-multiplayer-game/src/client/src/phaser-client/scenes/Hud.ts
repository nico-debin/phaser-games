import Phaser from 'phaser'

import { autorun } from 'mobx'
import { gameVotingManager } from '../classes/GameVotingManager'
import SceneKeys from '../consts/SceneKeys'
import Game from './Game'
import { gameState } from "../states/GameState";

export default class Hud extends Phaser.Scene {
  private gameScene!: Game

  constructor() {
    super('hud')
  }

  create() {
    // Save reference to the Game scene
    this.gameScene = this.scene.manager.getScene(SceneKeys.Game) as Game

    const votingLabel = this.add.text(10, 10, '', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#333333'
    })

    // Update voting label
    autorun(() => {
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

      votingLabel.setText(labels.join('\n'))
    })
  }
}