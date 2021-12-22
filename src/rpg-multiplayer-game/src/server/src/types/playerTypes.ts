import { AvatarSetting } from "~/characters/AvatarSetting";

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
  avatar: AvatarSetting
}

export interface PlayersStates {
  [playerId: PlayerId]: PlayerState
}
