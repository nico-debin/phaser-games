import { PlayerId } from "../types/playerTypes";

class GameFightState {
  private _fightMode = false
  private fighters = new Set<PlayerId>();

  set fightMode(newValue: boolean) {
    this._fightMode = newValue;
    if (newValue === false) {
      this.clearFighters();
    }
  }

  get fightMode(): boolean {
    return this._fightMode;
  }

  addFighter(playerId: PlayerId) {
    this.fighters.add(playerId);
  }

  getAllFighters(): PlayerId[] {
    return Array.from(this.fighters);
  }

  get fightersCount(): number {
    return this.fighters.size;
  }

  clearFighters() {
    this.fighters.clear();
  }
}

export const gameFightState = new GameFightState();
