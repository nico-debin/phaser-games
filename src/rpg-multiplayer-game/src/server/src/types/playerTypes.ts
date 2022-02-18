import { AvatarSetting } from "../characters/AvatarSetting";
import Queue from "../classes/queue";

export type Position = {
  x: number;
  y: number;
};

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
}

export interface PlayerState extends Omit<PlayerInitialState, "avatar"> {
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
