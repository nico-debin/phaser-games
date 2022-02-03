export type VotingZoneValue = string | undefined;

export interface VotingZone {
  zone: Phaser.GameObjects.Rectangle;
  value: VotingZoneValue;
}
