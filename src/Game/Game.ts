import Phaser from "phaser";
import { GameScene } from "../GameScene/GameScene";
import LevelFinishedScene from "./scenes/LevelFinishedScene";

var config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 640,
  height: 512,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: [GameScene, LevelFinishedScene],
  parent: "phaser",
};

const game = new Phaser.Game(config);

export default game;
