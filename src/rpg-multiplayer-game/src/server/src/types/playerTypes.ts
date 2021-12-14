export type MovementInput = {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
}

export type PlayerId = string;

export interface PlayerState {
  x: number
  y: number
  playerId: PlayerId
  movementInput: MovementInput
}

export interface PlayersStates {
  [playerId: PlayerId]: PlayerState
}
