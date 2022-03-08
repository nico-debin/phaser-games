import { AvatarSetting } from "../characters/AvatarSetting";
import Queue from "../classes/queue";

export type Position = {
  x: number;
  y: number;
};

export type Orientation = 'left' | 'right' | 'up' | 'down';

export type MovementInput = {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
};

export type PlayerId = string;

export interface PlayerInitialState {
  playerId: PlayerId;
  x: number;
  y: number;
  avatar: AvatarSetting;
  votingZone: string | undefined;
  playerSettings: PlayerSettings;
  health: number;
}

export interface PlayerState extends Omit<PlayerInitialState, "avatar" | "playerSettings"> {
  movementInput: MovementInput;
}

export interface PlayersStates {
  [playerId: PlayerId]: PlayerState;
}

export interface PlayersInitialStates {
  [playerId: PlayerId]: PlayerInitialState;
}

export interface PlayersInputQueue {
  [playerId: PlayerId]: Queue<MovementInput>;
}

export interface PlayerSettings {
  id?: PlayerId;
  username: string;
  avatarName: string;
  isVoter: boolean;
  hidePlayersWhileVoting: boolean;
}

export interface PlayerFightAction {
  playerId: PlayerId;
  x: number;
  y: number;
  orientation: Orientation;
}

export interface PlayerHurt {
  playerId: PlayerId;
  health: number;
}

export interface PlayerDead {
  playerId: PlayerId;
}
