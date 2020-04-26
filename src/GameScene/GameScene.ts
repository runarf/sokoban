import Phaser from "phaser";
import { update } from "./update";
import { create } from "./create";
import { assert } from "../utils/assert";

export interface Elements {
  player: Phaser.GameObjects.Sprite;
  blueBoxes: Phaser.GameObjects.Sprite[];
  layer: Phaser.Tilemaps.StaticTilemapLayer;
}

export class GameScene extends Phaser.Scene {
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  elements?: Elements;
  constructor() {
    super("Scene");
  }
  preload = () => {
    const { load } = this;
    load.spritesheet("tiles", "assets/sokoban_tilesheet.png", {
      frameWidth: 64,
      startFrame: 0
    });

    this.cursors = this.input.keyboard.createCursorKeys();
  };
  create = () => {
    const { make, anims } = this;

    const elements = create(make, anims);

    this.elements = elements;
  };

  update = () => {
    const { cursors, tweens, elements } = this;
    assert(elements);
    update({ cursors, tweens, elements });
  };
}
