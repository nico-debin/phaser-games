import AvatarKeys from "../consts/AvatarKeys";

export type Orientation = 'left' | 'right' | 'up' | 'down';

export type MovementInput = {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
}

export type PlayerId = string;

export interface AvatarSetting {
  name: string
  body: {
    sizeFactor: number
    size: {
      width: number
      height: number
      center?: boolean | undefined
    }
    offset: {
      x: number
      y: number
    }
  }
}

export interface PlayerInitialState {
  playerId: PlayerId
  x: number
  y: number
  avatar: AvatarSetting
  votingZone: string | undefined
  playerSettings: PlayerSettings
  health: number
}

export interface PlayerState extends Omit<PlayerInitialState, "avatar" | "playerSettings"> {
  movementInput: MovementInput
}

export interface PlayersStates {
  [playerId: PlayerId]: PlayerState
}

export interface PlayersInitialStates {
  [playerId: PlayerId]: PlayerInitialState
}

export interface PlayerSettings {
  id?: PlayerId
  username: string
  avatarName: AvatarKeys
  isVoter: boolean
  hidePlayersWhileVoting: boolean
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
  damage: number;
  orientation: Orientation;
}

export interface PlayerDead {
  playerId: PlayerId;
}

export interface StartFight {
  fighters: PlayerId[];
}
