import { makeAutoObservable } from 'mobx';
import { PlayerId } from '../types/playerTypes';
import { gameState } from './GameState';

class GameFightState {

  private _playerWantsToFight = false
  private _fightMode = false
  private _onWaitingRoom = false
  private fighters: PlayerId[] = []

  constructor() {
    makeAutoObservable(this);
  }

  set playerWantsToFight(newValue: boolean) {
    this._playerWantsToFight = newValue;
  }

  get playerWantsToFight(): boolean {
    return this._playerWantsToFight;
  }

  set fightMode(newValue: boolean) {
    this._fightMode = newValue;
    if (newValue === true) {
      this.onWaitingRoom = false;
    }
    gameState.darkMode = newValue;
  }

  get fightMode(): boolean {
    return this._fightMode;
  }

  set onWaitingRoom(newValue: boolean) {
    this._onWaitingRoom = newValue;
  }

  get onWaitingRoom(): boolean {
    return this._onWaitingRoom;
  }

  addFighters(ids: PlayerId[]): void {
    this.fighters = [
      ...this.fighters,
      ...ids,
    ];
  }

  removeFighter(playerId: PlayerId): boolean {
    const filteredFighters = this.fighters.filter(id => id !== playerId);
    if (filteredFighters.length < this.fighters.length) {
      this.fighters = filteredFighters
      return true
    }
    return false
  }

  getAllFighters(): PlayerId[] {
    return this.fighters;
  }

  clear(): void {
    this.fightMode = false;
    this.playerWantsToFight = false;
    this.onWaitingRoom = false;
    this.fighters = [];
  }
}
export const gameFightState = new GameFightState();
