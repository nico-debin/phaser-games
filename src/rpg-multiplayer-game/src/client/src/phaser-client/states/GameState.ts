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
   * Get player by id
   * @param id 
   * @returns PlayerSetting if found, undefined if not found
   */
  getPlayer(id: PlayerId): PlayerGameState | undefined {
    return this.players.find((player: PlayerGameState) => player.id === id)
  }

  /**
   * Get the amount of players in the game
   * @returns number amount of players in game
   */
  getPlayersCount(): number {
    return this.players.length
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
