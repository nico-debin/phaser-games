import { makeAutoObservable } from 'mobx'
import { VotingZoneValue } from "../types/gameObjectsTypes"

class PlayerVotingState {
  vote: VotingZoneValue = undefined

  constructor() {
    makeAutoObservable(this)
  }
}

export const playerVotingState = new PlayerVotingState()
