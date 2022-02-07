import { makeObservable, observable, action, computed } from 'mobx'
import { gameState } from '../states/GameState';
import { PlayerVotingState } from "../states/PlayerVotingState";
import { VotingZoneValue } from "../types/gameObjectsTypes";
import { PlayerId } from "../types/playerTypes";

interface VotesByPlayers {
  [playerId: PlayerId]: PlayerVotingState
}

interface GameVotingStats {
  totalVotes: number,
  pendingVotes: number,
}

export class GameVotingManager {

  readonly votesByPlayer: VotesByPlayers = {}

  constructor() {
    makeObservable(this, {
      votesByPlayer: observable,
      addPlayer: action,
      removePlayer: action,
      setVote: action,
      totalVotes: computed,
    })
  }

  addPlayer(playerId: PlayerId, vote?: VotingZoneValue): void {
    this.votesByPlayer[playerId] = new PlayerVotingState(playerId)
    if (vote) {
      this.setVote(playerId, vote)
    }
  }

  removePlayer(playerId: PlayerId): void {
    delete this.votesByPlayer[playerId]
  }

  setVote(playerId: PlayerId, newVote: VotingZoneValue): void {
    if (newVote != this.votesByPlayer[playerId].vote) {
      this.votesByPlayer[playerId].setVote(newVote)
    }
  }

  getStats(): GameVotingStats {
    return {
      totalVotes: this.totalVotes,
      pendingVotes: this.pendingVotes,
    }
  }

  get totalVotes(): number {
    let votesCount = 0
    for (const playerId in this.votesByPlayer) {
      this.votesByPlayer[playerId].vote && votesCount++
    }
    return votesCount
  }

  get pendingVotes(): number {
    return gameState.getPlayersCount() - this.totalVotes
  }
}

export const gameVotingManager = new GameVotingManager()
