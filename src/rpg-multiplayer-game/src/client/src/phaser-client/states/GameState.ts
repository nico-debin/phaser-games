import { action, makeAutoObservable, observable } from 'mobx';
import { PlayerId, PlayerSettings } from '../types/playerTypes';
import { gameFightState } from './GameFightState';

interface PlayerGameState extends PlayerSettings {
  id: PlayerId;
  isCurrentPlayer: boolean;
  health: number;
}

class GameState {
  private players: PlayerGameState[] = [];

  // Y position threshold dividing main island vs voting islands
  votingFrontierY?: number;

  // Flag to enable/disable current player movment
  _playerCanMove = false;

  // Flag to send back player to main island
  // _playerWantsToRespawn = false
  _playerWantsToRespawn = false;

  // Flag to restart game
  _restartGame = false;

  private _showPlayersUsernames = false;
  private _hideLastVotingResults = false;

  private _darkMode = false;

  private _connectingToServer = true;

  readonly gameFight: typeof gameFightState;

  private enableRain = true;
  private enableBlood = true;
  private adminMode = false;
  private playerKickedOut = false;

  constructor() {
    this.gameFight = gameFightState;

    makeAutoObservable(this, {
      _playerWantsToRespawn: observable,
      enableRespawnFlag: action,
      disableRespawnFlag: action,

      _restartGame: observable,
      enableRestartGameFlag: action,
      disableRestartGameFlag: action,
    });
  }

  set darkMode(newValue: boolean) {
    this._darkMode = newValue;
  }

  get darkMode(): boolean {
    return this._darkMode;
  }

  getAllPlayers(): PlayerGameState[] {
    return this.players;
  }

  /**
   * Adds a new player
   * @param id
   * @param settings
   */
  addPlayer(
    id: PlayerId,
    settings: PlayerSettings,
    isCurrentPlayer = false,
    health = 100,
  ): void {
    this.players.push({
      ...settings,
      id,
      isCurrentPlayer,
      health,
    });
  }

  /**
   * Removes a player.
   * @param id
   * @returns boolean false if the player doesn't exists
   */
  removePlayer(id: PlayerId): boolean {
    this.gameFight.removeFighter(id);
    const filteredPlayers = this.players.filter(
      (player: PlayerGameState) => player.id !== id,
    );
    if (filteredPlayers.length < this.players.length) {
      this.players = filteredPlayers;
      return true;
    }
    return false;
  }

  /**
   * Set current player as kicked-out from the game by the server
   */
  kickoutCurrentPlayer(): void {
    this.playerKickedOut = true;
  }

  get playerHasBeenKickedOut(): boolean {
    return this.playerKickedOut;
  }

  /**
   * Updates a player's settings
   * @param id
   * @param settings
   */
  updatePlayerSettings(id: PlayerId, settings: PlayerSettings): void {
    const idx = this.players.findIndex(
      (player: PlayerGameState) => player.id === id,
    );
    if (idx >= 0) {
      this.players[idx] = {
        ...this.players[idx],
        ...settings,
      };
    } else {
      console.error("Couldn't update player settings with playerId " + id);
    }
  }

  /**
   * Get player by id
   * @param id
   * @returns PlayerSetting if found, undefined if not found
   */
  getPlayer(id: PlayerId): PlayerGameState | undefined {
    return this.players.find((player: PlayerGameState) => player.id === id);
  }

  updatePlayerHealth(id: PlayerId, health: number): void {
    const player = this.getPlayer(id);
    if (player) {
      player.health = health;
    }
  }

  getPlayerHealth(id: PlayerId): number | undefined {
    const player = this.getPlayer(id);
    if (player) {
      return player.health;
    }
  }

  /**
   * Restores health to all players
   */
  restorePlayersHealth(): void {
    this.players.forEach((player) => (player.health = 100));
  }

  /**
   * Get current player
   * @param id
   * @returns PlayerSetting if found, undefined if not found
   */
  get currentPlayer(): PlayerGameState | undefined {
    return this.players.find(
      (player: PlayerGameState) => player.isCurrentPlayer === true,
    );
  }

  get currentPlayerIsVoter(): boolean | undefined {
    return this.currentPlayer?.isVoter;
  }

  get hidePlayersWhileVoting(): boolean {
    if (this.currentPlayer) {
      return this.currentPlayer.hidePlayersWhileVoting;
    }
    return true;
  }

  set showPlayersUsernames(newValue: boolean) {
    this._showPlayersUsernames = newValue;
  }

  get showPlayersUsernames(): boolean {
    return this._showPlayersUsernames;
  }

  set hideLastVotingResults(newValue: boolean) {
    this._hideLastVotingResults = newValue;
  }

  get hideLastVotingResults(): boolean {
    return this._hideLastVotingResults;
  }

  /**
   * Get the amount of players in the game
   * @returns number amount of players in game
   */
  get playersCount(): number {
    return this.players.length;
  }

  /**
   * Get the amount of VOTING players in the game
   * @returns number amount of players in game
   */
  get votingPlayersCount(): number {
    return this.players.filter((player: PlayerGameState) => player.isVoter)
      .length;
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
    return this._playerWantsToRespawn;
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

  set connectingToServer(newValue: boolean) {
    this._connectingToServer = newValue;
    this.playerCanMove = !newValue;
  }

  get connectingToServer(): boolean {
    return this._connectingToServer;
  }

  enableRainFlag(): void {
    this.enableRain = true;
  }

  disableRainFlag(): void {
    this.enableRain = false;
  }

  get rainFlagEnabled() {
    return this.enableRain;
  }

  enableBloodFlag(): void {
    this.enableBlood = true;
  }

  disableBloodFlag(): void {
    this.enableBlood = false;
  }

  enableAdminMode(): void {
    this.adminMode = true;
  }

  disableAdminMode(): void {
    this.adminMode = false;
  }

  isAdminMode(): boolean {
    return this.adminMode;
  }

  get bloodFlagEnabled() {
    return this.enableBlood;
  }

  /**
   * Clear all state
   */
  clear() {
    // Remove all players
    this.players = [];
  }
}

export const gameState = new GameState();
