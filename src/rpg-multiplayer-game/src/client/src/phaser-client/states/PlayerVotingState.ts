import { makeAutoObservable } from 'mobx'
import { VotingZoneValue } from "../types/gameObjectsTypes"

class PlayerVotingState {
  vote: VotingZoneValue = undefined

  constructor() {
    makeAutoObservable(this)
  }

  setVote(newVote: VotingZoneValue) {
    this.vote = newVote
  }
}

export const playerVotingState = new PlayerVotingState()
