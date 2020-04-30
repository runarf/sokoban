import Phaser from "phaser";
import { primaryButton } from "./PrimaryButton";
import { SCENE_GAME_NAME } from "../GameScene/GameScene";

export const SCENE_FINISHED_NAME = "level-finished";
export default class LevelFinishedScene extends Phaser.Scene {
  constructor() {
    super(SCENE_FINISHED_NAME);
  }

  create(data: { moves: number } = { moves: 0 }) {
    const { width, height } = this.scale;
    const { add } = this;
    const halfWidth = width / 4;
    const halfHeight = height / 4;
    add.text(halfWidth, height * 0.4, "Level Complete!", {
      fontSize: 48
    });
    add.text(halfWidth, halfHeight, `Moves: ${data.moves}`);

    const button = primaryButton("Retry") as HTMLElement;
    add
      .dom(halfWidth, height * 0.6, button)
      .addListener("click")
      .once("click", () => {
        this.scene.start(SCENE_GAME_NAME);
      });
  }
}
