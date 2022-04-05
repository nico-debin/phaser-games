import { PlayerId } from '../types/playerTypes';

class GameFightState {
  private _fightMode = false;
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

  addFighter(playerId: PlayerId): void {
    this.fighters.add(playerId);
  }

  removeFighter(playerId: PlayerId): boolean {
    return this.fighters.delete(playerId);
  }

  getAllFighters(): PlayerId[] {
    return Array.from(this.fighters);
  }

  isFighter(playerId: PlayerId): boolean {
    return this.fighters.has(playerId);
  }

  get fightersCount(): number {
    return this.fighters.size;
  }

  clearFighters(): void {
    this.fighters.clear();
  }
}

export const gameFightState = new GameFightState();
