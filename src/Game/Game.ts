import Phaser from "phaser";
import { GameScene } from "../GameScene/GameScene";

var config = {
  type: Phaser.AUTO,
  width: 640,
  height: 512,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: GameScene
};

const game = new Phaser.Game(config);

export default game;
