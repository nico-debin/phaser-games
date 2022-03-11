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
import TextureKeys from "../consts/TextureKeys";

type VotingResultRow = {
  vote: VotingZoneValue;
  player?: PlayerSettings;
};

export default class EndOfVotingMenu extends AbstractMenu {
  private votingResultsRows: VotingResultRowContainer;
  private uiButtonsContainer: Phaser.GameObjects.Container;
  private showFightButton = true;

  constructor(scene: Phaser.Scene) {
    super(scene, {
      disableCloseButton: true,
    });

    // Make the board larger on height
    this.menuBoard.setScale(this.menuBoard.scaleX, 0.98);
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

    this.uiButtonsContainer = this.scene.add.container();
    this.createButtons();
  }

  private createButtons() {
    this.uiButtonsContainer.setVisible(false);

    const fightButtonOffset = this.showFightButton ? 55 : 0;

    // CHANGE MY VOTE BUTTON
    const changeMyVoteButton = this.scene.add
      .image(
        this.menuBoard.x - this.menuBoard.displayWidth / 5 - fightButtonOffset,
        this.menuBoard.y + this.menuBoard.displayHeight / 2 - 50,
        TextureKeys.UIMenu1,
        "red-wood-button"
      )
      .setOrigin(0.5)
      .setScale(0.3)
      .setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
        changeMyVoteButton.setTint(0xdedede);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
        changeMyVoteButton.setTint(0xffffff);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        gameState.enableRespawnFlag();
        this.closeMenu()
      });

    const changeMyVoteLabel = this.scene.add
      .bitmapText(
        changeMyVoteButton.x,
        changeMyVoteButton.y,
        FontKeys.GEM,
        "CHANGE MY\nVOTE",
        16,
        Phaser.GameObjects.BitmapText.ALIGN_CENTER
      )
      .setOrigin(0.5);

    // RESTART BUTTON
    const restartButton = this.scene.add
      .image(
        this.menuBoard.x + this.menuBoard.displayWidth / 5 + fightButtonOffset,
        changeMyVoteButton.y,
        TextureKeys.UIMenu1,
        "green-wood-button"
      )
      .setOrigin(0.5)
      .setScale(0.3)
      .setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
        restartButton.setTint(0xdedede);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
        restartButton.setTint(0xffffff);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        gameState.enableRestartGameFlag();
        this.closeMenu()
      });

    const restartButtonLabel = this.scene.add
      .bitmapText(restartButton.x, restartButton.y, FontKeys.GEM, "RESTART", 16)
      .setOrigin(0.5);

    this.uiButtonsContainer.add([
      changeMyVoteButton,
      changeMyVoteLabel,
      restartButton,
      restartButtonLabel,
    ]);

    // FIGHT FOR YOUR VOTE BUTTON
    if (this.showFightButton) {
      const fightButton = this.scene.add
        .image(
          this.menuBoard.x,
          changeMyVoteButton.y + changeMyVoteButton.displayHeight * 0.5 + 5,
          TextureKeys.UIMenu1,
          "yellow-wood-button"
        )
        .setOrigin(0.5)
        .setScale(0.6, 0.4)
        .setInteractive({ useHandCursor: true })
        .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
          fightButton.setTint(0xdedede);
        })
        .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
          fightButton.setTint(0xffffff);
        })
        .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
          gameState.gameFight.playerWantsToFight = true;
        });
      const fightButtonLabel = this.scene.add
        .bitmapText(
          fightButton.x,
          fightButton.y,
          FontKeys.GEM,
          "FIGHT FOR YOUR VOTE",
          16
        )
        .setOrigin(0.5);

      this.uiButtonsContainer.add([fightButton, fightButtonLabel]);
    }
  }

  private generateVotingResultsRows(): VotingResultRow[] {
    // @ts-ignore
    const votingResults: VotingResultRow[] = Object.values(
      objectMap(
        gameVotingManager.votesByPlayer,
        (voteByPlayer: PlayerVotingState): VotingResultRow => ({
          vote: voteByPlayer.vote,
          player: gameState.getPlayer(voteByPlayer.playerId),
        })
      )
    );
    return votingResults;
  }

  private sortVotingResultsRows(votingResults: VotingResultRow[]): VotingResultRow[] {
    return votingResults.sort((a: VotingResultRow, b: VotingResultRow) => {
      const vote1 = a.vote ? parseInt(a.vote) : NaN;
      const vote2 = b.vote ? parseInt(b.vote) : NaN;

      // Send NaN to the bottom
      if (isNaN(vote1) && isNaN(vote2)) {
        return 0;
      } else if (isNaN(vote1) && !isNaN(vote2)) {
        return 1;
      } else if (!isNaN(vote1) && isNaN(vote2)) {
        return -1
      }

      // Sort by number
      if (vote1 < vote2) {
        return -1;
      }
      if (vote1 > vote2) {
        return 1;
      }

      // Sort by string (username)
      if (a.player?.username && b.player?.username) {
        if (a.player.username < b.player.username) {
          return -1;
        } else if (a.player.username > b.player.username) {
          return 1;
        }
      }
      
      return 0;
    })
  }

  private showVotingResults() {
    const votingResults = this.generateVotingResultsRows();
    this.sortVotingResultsRows(votingResults);
    this.votingResultsRows.addRows(votingResults);
  }

  openMenu() {
    if (this.menuIsOpen) return;
    super.openMenu();
    this.showVotingResults();
    this.uiButtonsContainer.setVisible(true);
  }

  closeMenu() {
    if (!this.menuIsOpen) return;
    super.closeMenu();
    this.votingResultsRows.clearRows();
    this.uiButtonsContainer.setVisible(false);
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
    if (!votingResult.player) return;

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
    votingResults.forEach((votingResult: VotingResultRow) =>
      this.addRow(votingResult)
    );
  }

  clearRows(): void {
    this.rows.map((row: ContainerRow) => {
      row.avatar.destroy();
      row.nameLabel.destroy();
      row.votingLabel.destroy();
    });
    this.rows = [];
    this.currentY = this.initialY;
  }
}
