import Phaser from "phaser";
import { objectMap } from "../../utils";
import { gameState } from "../states/GameState";
import { gameVotingManager } from "./GameVotingManager";
import AbstractMenu from "./AbstractMenu";
import FontKeys from "../consts/FontKeys";
import { VotingZoneValue } from "../types/gameObjectsTypes";
import { PlayerVotingState } from "../states/PlayerVotingState";
import { PlayerSettings } from "../types/playerTypes";
import GenericLpc from "../characters/GenericLpc";

type VotingResultRow = {
  vote: VotingZoneValue;
  player: PlayerSettings;
};

export default class EndOfVotingMenu extends AbstractMenu {
  private votingResultsRows: VotingResultRowContainer;

  constructor(scene: Phaser.Scene) {
    super(scene, {
      disableCloseButton: true,
    });

    // Make the board larger on height
    this.menuBoard.setScale(this.menuBoard.scaleX, 0.25);
    this.menuTitle.setY(
      this.menuBoard.y -
        this.menuBoard.displayHeight * this.menuBoard.originY +
        40
    );

    this.menuTitle.setText("ESTIMATION RESULTS").setFontSize(20);

    const menuBoardScaledPositionX =
      this.menuBoard.x - this.menuBoard.displayWidth * this.menuBoard.originX;
    const menuBoardScaledPositionY =
      this.menuBoard.y - this.menuBoard.displayHeight * this.menuBoard.originY;

    this.votingResultsRows = new VotingResultRowContainer(
      this.scene,
      menuBoardScaledPositionX + 60,
      menuBoardScaledPositionY + 60
    );

    scene.add.existing(this.votingResultsRows);
  }

  private generateVotingResultsRows(): VotingResultRow[] {
    // @ts-ignore
    const votingResults: VotingResultRow[] = Object.values(
      objectMap(
        gameVotingManager.votesByPlayer,
        (voteByPlayer: PlayerVotingState): VotingResultRow => ({
          vote: voteByPlayer.vote,
          player: gameState.getPlayer(voteByPlayer.playerId)!,
        })
      )
    );
    return votingResults;
  }

  private showVotingResults() {
    const votingResults = this.generateVotingResultsRows();
    this.votingResultsRows.addRows(votingResults);
  }

  openMenu() {
    super.openMenu();
    this.showVotingResults();
  }

  closeMenu() {
    super.closeMenu();
    this.votingResultsRows.clearRows();
  }
}

type ContainerRow = {
  avatar: Phaser.GameObjects.Sprite;
  nameLabel: Phaser.GameObjects.BitmapText;
  votingLabel: Phaser.GameObjects.BitmapText;
};

class VotingResultRowContainer extends Phaser.GameObjects.Container {
  scene: Phaser.Scene;
  x: number;
  initialY: number;
  currentY: number;
  rows: ContainerRow[] = [];

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.scene = scene;
    this.x = x;
    this.initialY = y;
    this.currentY = y;
  }

  addRow(votingResult: VotingResultRow): void {
    const playerData = {
      avatar: votingResult.player.avatarName,
      playerId: "VOTING-RESULT-SPRITE",
    };

    const avatar = new GenericLpc(
      this.scene,
      0,
      this.currentY,
      playerData,
      0
    ).setOrigin(0.5);

    const nameLabel = this.scene.add
      .bitmapText(
        avatar.x + avatar.displayWidth * 0.5 + 0,
        this.currentY,
        FontKeys.GEM,
        votingResult.player.avatarName,
        16
      )
      .setTint(0x000000)
      .setOrigin(0, 0.5);

    const votingLabel = this.scene.add
      .bitmapText(
        nameLabel.x + nameLabel.width + 10,
        this.currentY,
        FontKeys.GEM,
        votingResult.vote,
        16
      )
      .setTint(0x000000)
      .setOrigin(0, 0.5);

    this.currentY += avatar.displayHeight - 5;

    this.rows.push({
      avatar,
      nameLabel,
      votingLabel,
    });

    this.add([avatar, nameLabel, votingLabel]);
  }

  addRows(votingResults: VotingResultRow[]): void {
    votingResults.forEach((votingResult: VotingResultRow) => this.addRow(votingResult));
  }

  clearRows(): void {
    this.rows.map((row: ContainerRow) => {
      row.avatar.destroy();
      row.nameLabel.destroy();
      row.votingLabel.destroy();
    });
    this.rows = [];
  }
}
