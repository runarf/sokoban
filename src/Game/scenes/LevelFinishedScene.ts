import Phaser from "phaser";

export default class LevelFinishedScene extends Phaser.Scene {
  constructor() {
    super("level-finished");
  }

  create(data: { moves: number } = { moves: 0 }) {
    const { width, height } = this.scale;
    const { add } = this;
    add.text(width * 0.5, height * 0.5, "Level Complete!", {
      fontSize: 48,
    });
    add.text(width * 0.5, height * 0.5, `Moves: ${data.moves}`);
  }
}
