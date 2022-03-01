import { makeAutoObservable } from 'mobx';

class GameFightState {

  private _playerWantsToFight = false
  private _fightMode = false

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
  }

  get fightMode(): boolean {
    return this._fightMode;
  }

  clear(): void {
    this.fightMode = false;
    this.playerWantsToFight = false;
  }
}
export const gameFightState = new GameFightState();
