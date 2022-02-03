import Phaser from 'phaser'

import { autorun } from 'mobx'
import { playerVotingState } from '../states/PlayersState'

export default class Hud extends Phaser.Scene {
  constructor() {
    super('hud')
  }

  create() {
    const votingLabel = this.add.text(10, 10, '', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#333333'
    })

    // Update voting label
    autorun(() => {
      if (playerVotingState.vote) {
        votingLabel.setText(`Your estimation: ${playerVotingState.vote}`)
      } else {
        votingLabel.setText('')
      }
    })
  }
}