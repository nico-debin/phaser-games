import AvatarKeys from "../consts/AvatarKeys";
import { PlayerInitialState } from "../types/playerTypes";
import GenericLpc from "./GenericLpc";
import Player from "./Player";

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

  public static fromPlayerInitialState(scene: Phaser.Scene, playerInitialState: PlayerInitialState): Player {
    if (playerInitialState.avatar.name !== "generic-lpc") {
      console.error('Expecting a generic-lpc');
    }
    const playerData = {
      avatar: playerInitialState.playerSettings.avatarName,
      username: playerInitialState.playerSettings.username,
      playerId: playerInitialState.playerId,
    };
    const player = new GenericLpc(scene, playerInitialState.x, playerInitialState.y, playerData);
    player.health = playerInitialState.health
    return player;
  }
}
