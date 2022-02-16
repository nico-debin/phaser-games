import Phaser from "phaser";
import AbstractMenu from "./AbstractMenu";

export default class EndOfVotingMenu extends AbstractMenu {
  constructor(scene: Phaser.Scene) {
    super(scene, {
      disableCloseButton: true,
    });

    this.menuTitle.setText("ESTIMATION RESULTS").setFontSize(20);
  }
}
