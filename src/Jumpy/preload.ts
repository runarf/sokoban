import Phaser from "phaser";
export function preload(load: Phaser.Loader.LoaderPlugin) {
  load.image("sky", "./assets/sky.png");
  load.image("ground", "assets/platform.png");
  load.image("star", "assets/star.png");
  load.image("bomb", "assets/bomb.png");
  load.spritesheet("dude", "assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48
  });
}
