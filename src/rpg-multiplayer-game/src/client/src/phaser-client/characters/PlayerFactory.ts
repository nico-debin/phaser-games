import AvatarKeys from "../consts/AvatarKeys";
import { PlayerState } from "../types/playerTypes";
import Fauna from "./Fauna";
import GenericLpc from "./GenericLpc";
import Lizard from "./Lizard";
import Player from "./Player";

const avatarPlayerMapper = {
  fauna: Fauna,
  lizard: Lizard,
};

const getRandomAvatarKey = (): AvatarKeys => {
  const avatars = [
    AvatarKeys.ADRIAN_TOMKINS,
    AvatarKeys.CALVIN_KOEPKE,
    AvatarKeys.JOEL_BOWEN,
    AvatarKeys.JOHN_GEIGER,
    AvatarKeys.LAKSHMI_VEGESNA,
    AvatarKeys.MICHAEL_KANTOR,
    AvatarKeys.NICK_TAYLOR,
    AvatarKeys.NICOLAS_DEBIN,
    AvatarKeys.RYAN_MCKAY,
  ];
  const randomIndex = Phaser.Math.Between(0, avatars.length - 1)
  return avatars[randomIndex]
};
export default class PlayerFactory {
  private static players: Set<AvatarKeys> = new Set();

  private static getRandomAvatarKey = (): AvatarKeys => {
    const avatars = [
      AvatarKeys.ADRIAN_TOMKINS,
      AvatarKeys.CALVIN_KOEPKE,
      AvatarKeys.JOEL_BOWEN,
      AvatarKeys.JOHN_GEIGER,
      AvatarKeys.LAKSHMI_VEGESNA,
      AvatarKeys.MICHAEL_KANTOR,
      AvatarKeys.NICK_TAYLOR,
      AvatarKeys.NICOLAS_DEBIN,
      AvatarKeys.RYAN_MCKAY,
    ];

    for (let i = 0; i< avatars.length; i++) {
      if (!PlayerFactory.players.has(avatars[i])) {
        PlayerFactory.players.add(avatars[i])
        return avatars[i]
      }
    }
    return AvatarKeys.NICOLAS_DEBIN
  };

  public static fromPlayerState(scene: Phaser.Scene, playerState: PlayerState): Player {
    if (playerState.avatar.name === "generic-lpc") {
      const playerData = {
        avatar: this.getRandomAvatarKey(),
        playerId: playerState.playerId,
      };
      return new GenericLpc(scene, playerState.x, playerState.y, playerData);
    }
    const classname = avatarPlayerMapper[playerState.avatar.name];
    return new classname(
      scene,
      playerState.x,
      playerState.y,
      playerState.playerId
    );
  }
}
