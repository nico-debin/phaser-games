import Phaser from 'phaser';
import BaseScene from '../scenes/BaseScene';

import { autorun } from 'mobx';
import { gameState } from '../states/GameState';
import { PlayerSettings } from '../types/playerTypes';

import AbstractMenu from './AbstractMenu';
import GridTable from 'phaser3-rex-plugins/templates/ui/gridtable/GridTable';
import GridTableCore from 'phaser3-rex-plugins/plugins/gridtable';
import GenericLpc from '../characters/GenericLpc';
import TextureKeys from '../consts/TextureKeys';

export default class AdminDashboardMenu extends AbstractMenu {
  private gridTable!: GridTable;

  constructor(scene: BaseScene) {
    super(scene);
    console.log('creating AdminDashboardMenu');
    this.menuTitle.setText('Admin Dashboard').setFontSize(20);
    this.buildGridTable();
    this.gridTable.setVisible(false);

    autorun(() => {
      this.updateGridTableItems();
    });
  }

  private buildGridTable(): void {
    // @ts-ignore
    this.gridTable = this.scene.rexUI.add
      .gridTable({
        x: 400,
        y: 310,
        width: 300,
        height: 310,
        table: {
          cellWidth: 250,
          cellHeight: 70,
          columns: 1,
        },
        items: gameState.getAllPlayers(),
        createCellContainerCallback: (
          cell: GridTableCore.CellData,
          cellContainer: Phaser.GameObjects.GameObject | null,
        ): Phaser.GameObjects.GameObject => {
          const playerSettings: PlayerSettings = cell.item as PlayerSettings;

          if (cellContainer === null) {
            // const background = this.scene.rexUI.add
            //   .roundRectangle(0, 0, 250, 70)
            //   .setStrokeStyle(2, COLOR_DARK);

            const avatar = new GenericLpc(
              this.scene,
              0,
              0,
              {
                avatar: playerSettings.avatarName,
                playerId: 'ADMIN-DASHBOARD-SPRITE',
              },
              0,
            ).setOrigin(0.5);
            this.scene.add.existing(avatar);

            const text = this.scene.add.text(0, 0, playerSettings.username, {
              fontSize: '18px',
              color: '#000000',
              wordWrap: {
                width: 185,
                useAdvancedWrap: true,
              },
            });

            const kickOutIcon = this.scene.add
              .image(0, 0, TextureKeys.UIMenu1, 'cross-icon')
              .setScale(0.2)
              .setTint(0xd9534f)
              .setInteractive({ useHandCursor: true })
              .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                kickOutIcon.setTint(0xae423f);
              })
              .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                kickOutIcon.setTint(0xd9534f);
              })
              .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                kickOutIcon.setTint(0xc34b47);
              })
              .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                kickOutIcon.setTint(0xd9534f);

                // TODO: send kickout event
                console.log(
                  `Kicking-out player with id ${playerSettings.id} (${playerSettings.username})`,
                );
              });

            // Disable kickOutIcon to my own player
            if (gameState.currentPlayer?.id === playerSettings.id) {
              kickOutIcon.destroy();
            }

            const sizer = this.scene.rexUI.add
              .sizer({
                orientation: 'horizontal',
                space: {
                  left: 3,
                  right: 3,
                  top: 3,
                  bottom: 3,
                  item: 8,
                },
              })
              .add(avatar)
              .add(text)
              .add(kickOutIcon, {
                padding: { left: 10 },
              });
            // .addBackground(background);

            cellContainer = sizer;
          }

          return cellContainer;
        },
      })
      .layout();
  }

  openMenu(): void {
    if (this.menuIsOpen) return;
    super.openMenu();
    // this.updateGridTableItems();
    this.gridTable.setVisible(true);
  }

  closeMenu(): void {
    if (!this.menuIsOpen) return;
    super.closeMenu();
    this.gridTable.setVisible(false);
  }

  private updateGridTableItems(): void {
    this.gridTable.setItems(gameState.getAllPlayers());
  }
}
