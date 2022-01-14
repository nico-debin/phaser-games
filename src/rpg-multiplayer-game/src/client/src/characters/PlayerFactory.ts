import AvatarKeys from "../consts/AvatarKeys"
import { PlayerState } from "../types/playerTypes"
import Fauna from "./Fauna"
import GenericLpc from "./GenericLpc"
import Lizard from "./Lizard"

const avatarPlayerMapper = {
  'fauna': Fauna,
  'lizard': Lizard,
}

export default class PlayerFactory {
  static fromPlayerState(scene: Phaser.Scene, playerState: PlayerState) {
    if (playerState.avatar.name === 'generic-lpc') {
      const playerData = {
        avatar: AvatarKeys.NICO,
        playerId: playerState.playerId,
      }
      return new GenericLpc(scene, playerState.x, playerState.y, playerData)
    }
    const classname = avatarPlayerMapper[playerState.avatar.name]
    return new classname(scene, playerState.x, playerState.y, playerState.playerId)
  }
}