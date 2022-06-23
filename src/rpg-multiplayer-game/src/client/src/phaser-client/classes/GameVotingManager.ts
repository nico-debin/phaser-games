import { makeObservable, observable, action, computed, autorun } from 'mobx';
import { objectMap } from '../../utils';
import { gameState } from '../states/GameState';
import { PlayerVotingState } from '../states/PlayerVotingState';
import { VotingZoneValue } from '../types/gameObjectsTypes';
import { PlayerId } from '../types/playerTypes';

interface VotesByPlayers {
  [playerId: PlayerId]: PlayerVotingState;
}

interface GameVotingStats {
  totalVotes: number;
  pendingVotes: number;
}

export interface PlayerVote {
  playerId: PlayerId;
  vote: string;
}

export class GameVotingManager {
  readonly votesByPlayer: VotesByPlayers = {};
  readonly lastVotingResult: PlayerVote[] = [];

  constructor() {
    makeObservable(this, {
      votesByPlayer: observable,
      addPlayer: action,
      removePlayer: action,
      setVote: action,
      totalVotes: computed,
    });
  }

  addPlayer(playerId: PlayerId, vote?: VotingZoneValue): void {
    this.votesByPlayer[playerId] = new PlayerVotingState(playerId);
    if (vote) {
      this.setVote(playerId, vote);
    }
  }

  removePlayer(playerId: PlayerId): void {
    delete this.votesByPlayer[playerId];
  }

  setVote(playerId: PlayerId, newVote: VotingZoneValue): void {
    if (newVote != this.votesByPlayer[playerId].vote) {
      this.votesByPlayer[playerId].setVote(newVote);
    }
  }

  getStats(): GameVotingStats {
    return {
      totalVotes: this.totalVotes,
      pendingVotes: this.pendingVotes,
    };
  }

  get totalVotes(): number {
    let votesCount = 0;
    for (const playerId in this.votesByPlayer) {
      this.votesByPlayer[playerId].vote && votesCount++;
    }
    return votesCount;
  }

  get pendingVotes(): number {
    return gameState.votingPlayersCount - this.totalVotes;
  }

  get pendingVoters(): PlayerId[] {
    const pendingVoters: PlayerId[] = [];
    for (const playerId in this.votesByPlayer) {
      !this.votesByPlayer[playerId].vote && pendingVoters.push(playerId);
    }
    return pendingVoters;
  }

  get votingIsClosed(): boolean {
    return this.totalVotes >= 1 && this.pendingVotes === 0;
  }

  saveLastVotingResult(): void {
    if (!this.votingIsClosed) return;

    // @ts-ignore
    this.lastVotingResult = Object.values(
      objectMap(
        gameVotingManager.votesByPlayer,
        (voteByPlayer: PlayerVotingState): PlayerVote => ({
          vote: voteByPlayer.vote as string,
          playerId: voteByPlayer.playerId,
        }),
      ),
    );
  }
}

export const gameVotingManager = new GameVotingManager();

// Save last voting result each time the voting has closed
autorun(() => {
  if (gameVotingManager.votingIsClosed) {
    gameVotingManager.saveLastVotingResult();
  }
});
