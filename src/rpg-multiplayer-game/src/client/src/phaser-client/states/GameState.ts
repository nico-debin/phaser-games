import { makeAutoObservable } from 'mobx'
import { PlayerId, PlayerSettings } from "../types/playerTypes";

interface PlayerGameState extends PlayerSettings {
  id: PlayerId
  isCurrentPlayer: boolean
}

class GameState {
  private players: PlayerGameState[] = []

  constructor() {
    makeAutoObservable(this)
  }

  /**
   * Adds a new player
   * @param id 
   * @param settings 
   */
  addPlayer(id: PlayerId, settings: PlayerSettings, isCurrentPlayer = false): void {
    this.players.push({
      ...settings,
      id,
      isCurrentPlayer,
    })
  }

  /**
   * Removes a player.
   * @param id 
   * @returns boolean false if the player doesn't exists
   */
  removePlayer(id: PlayerId): boolean {
    const filteredPlayers = this.players.filter((player: PlayerGameState) => player.id !== id)
    if (filteredPlayers.length < this.players.length) {
      this.players = filteredPlayers
      return true
    }
    return false
  }

  /**
   * Updates a player's settings
   * @param id 
   * @param settings 
   */
  updatePlayerSettings(id: PlayerId, settings: PlayerSettings): void {
    const idx = this.players.findIndex((player: PlayerGameState) => player.id === id)
    if (idx >= 0) {
      this.players[idx] = {
        ...this.players[idx],
        ...settings,
      }
    } else {
      console.error("Couldn't update player settings with playerId " + id)
    }
  }


  /**
   * Get player by id
   * @param id 
   * @returns PlayerSetting if found, undefined if not found
   */
  getPlayer(id: PlayerId): PlayerGameState | undefined {
    return this.players.find((player: PlayerGameState) => player.id === id)
  }

  /**
   * Get current player
   * @param id 
   * @returns PlayerSetting if found, undefined if not found
   */
  get currentPlayer(): PlayerGameState | undefined {
    return this.players.find((player: PlayerGameState) => player.isCurrentPlayer === true)
  }

  get currentPlayerIsVoter(): boolean | undefined {
    return this.currentPlayer?.isVoter
  }

  /**
   * Get the amount of players in the game
   * @returns number amount of players in game
   */
  get playersCount(): number {
    return this.players.length
  }

  /**
   * Get the amount of players in the game
   * @returns number amount of players in game
   */
  get votingPlayersCount(): number {
    return this.players.filter((player: PlayerGameState) => player.isVoter).length
  }

  /**
   * Clear all state
   */
  clear() {
    // Remove all players
    this.players = []
  }
}

export const gameState = new GameState()
