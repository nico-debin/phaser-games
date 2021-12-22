import { PlayerState } from "~/types/playerTypes"
import Fauna from "./Fauna"
import Lizard from "./Lizard"

const avatarPlayerMapper = {
  'fauna': Fauna,
  'lizard': Lizard,
}

export default class PlayerFactory {
  static fromPlayerState(scene: Phaser.Scene, playerState: PlayerState) {
    const classname = avatarPlayerMapper[playerState.avatar.name]
    return new classname(scene, playerState.x, playerState.y, playerState.playerId)
  }
}