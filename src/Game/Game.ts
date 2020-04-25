import Phaser from "phaser";
import { Jumpy } from "../Jumpy/Jumpy";

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: Jumpy
};

const game = new Phaser.Game(config);

export default game;
