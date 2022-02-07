import { makeObservable, observable, action } from 'mobx'
import { VotingZoneValue } from "../types/gameObjectsTypes"
import { PlayerId } from '../types/playerTypes'

export class PlayerVotingState {
  playerId: PlayerId
  vote: VotingZoneValue = undefined

  constructor(playerId: PlayerId) {
    this.playerId = playerId

    makeObservable(this, {
      vote: observable,
      setVote: action,
    })
  }

  setVote(newVote: VotingZoneValue) {
    this.vote = newVote
  }
}
