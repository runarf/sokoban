import Phaser from "phaser";
import { GameScene } from "./scenes/GameScene/GameScene";
import LevelFinishedScene from "./scenes/LevelFinishedScene/index";

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
  dom: {
    createContainer: true,
  },
};

const game = new Phaser.Game(config);

export default game;
