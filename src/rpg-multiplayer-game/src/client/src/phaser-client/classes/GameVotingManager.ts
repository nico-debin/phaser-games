import { makeObservable, observable, action } from 'mobx'
import { PlayerVotingState } from "../states/PlayerVotingState";
import { VotingZoneValue } from "../types/gameObjectsTypes";
import { PlayerId } from "../types/playerTypes";

interface VotesByPlayers {
  [playerId: PlayerId]: PlayerVotingState
}

export class GameVotingManager {

  readonly votesByPlayer: VotesByPlayers = {}

  constructor() {
    makeObservable(this, {
      votesByPlayer: observable,
      addPlayer: action,
      removePlayer: action,
      setVote: action,
    })
  }

  addPlayer(playerId: PlayerId) {
    this.votesByPlayer[playerId] = new PlayerVotingState(playerId)
  }

  removePlayer(playerId: PlayerId) {
    delete this.votesByPlayer[playerId]
  }

  setVote(playerId: PlayerId, newVote: VotingZoneValue) {
    if (newVote != this.votesByPlayer[playerId].vote) {
      this.votesByPlayer[playerId].setVote(newVote)
    }
  }
}

export const gameVotingManager = new GameVotingManager()
