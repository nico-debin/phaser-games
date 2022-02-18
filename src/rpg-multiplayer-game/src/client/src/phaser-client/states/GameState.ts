import { action, computed, makeAutoObservable, makeObservable, observable } from 'mobx'
import { PlayerId, PlayerSettings } from "../types/playerTypes";

interface PlayerGameState extends PlayerSettings {
  id: PlayerId
  isCurrentPlayer: boolean
}

class GameState {
  private players: PlayerGameState[] = []

  // Y position threshold dividing main island vs voting islands
  votingFrontierY?: number

  // Flag to enable/disable current player movment
  _playerCanMove = true

  // Flag to send back player to main island
  // _playerWantsToRespawn = false
  _playerWantsToRespawn = false

  // Flag to restart game
  _restartGame = false

  constructor() {
    makeAutoObservable(this, {
      _playerWantsToRespawn: observable,
      enableRespawnFlag: action,
      disableRespawnFlag: action,

      _restartGame: observable,
      enableRestartGameFlag: action,
      disableRestartGameFlag: action,
    })

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

  get hidePlayersWhileVoting(): boolean {
    if (this.currentPlayer) {
      return this.currentPlayer.hidePlayersWhileVoting
    }
    return true
  }

  /**
   * Get the amount of players in the game
   * @returns number amount of players in game
   */
  get playersCount(): number {
    return this.players.length
  }

  /**
   * Get the amount of VOTING players in the game
   * @returns number amount of players in game
   */
  get votingPlayersCount(): number {
    return this.players.filter((player: PlayerGameState) => player.isVoter).length
  }

  set playerCanMove(newValue: boolean) {
    this._playerCanMove = newValue;
  }

  get playerCanMove(): boolean {
    return this._playerCanMove;
  }

  enableRespawnFlag() {
    this._playerWantsToRespawn = true;
  }

  disableRespawnFlag() {
    this._playerWantsToRespawn = false;
  }

  get respawnFlagEnabled() {
    return this._playerWantsToRespawn
  }

  // set playerWantsToRespawn(newValue: boolean) {
  //   this._playerWantsToRespawn = newValue;
  // }

  // get playerWantsToRespawn() {
  //   return this._playerWantsToRespawn;
  // }

  enableRestartGameFlag() {
    this._restartGame = true;
  }

  disableRestartGameFlag() {
    this._restartGame = false;
  }

  get restartGame(): boolean {
    return this._restartGame;
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
