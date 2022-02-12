import AvatarKeys from "../consts/AvatarKeys";
import { VotingZoneValue } from "./gameObjectsTypes";

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
}

export interface PlayerState extends Omit<PlayerInitialState, "avatar"> {
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
}
