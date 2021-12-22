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
