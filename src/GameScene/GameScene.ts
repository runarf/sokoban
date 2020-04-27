import Phaser from "phaser";
import { update } from "./update";
import { create } from "./create";
import { assert } from "../utils/assert";

export interface BoxesByColor {
  [key: string]: Phaser.GameObjects.Sprite[];
}

export interface Elements {
  player: Phaser.GameObjects.Sprite;
  world: Phaser.Tilemaps.StaticTilemapLayer;
  boxesByColor: BoxesByColor;
  movesCountText: Phaser.GameObjects.Text;
}

export interface CreateUtils {
  make: Phaser.GameObjects.GameObjectCreator;
  anims: Phaser.Animations.AnimationManager;
  add: Phaser.GameObjects.GameObjectFactory;
}

export interface UpdateUtils {
  scene: Phaser.Scenes.ScenePlugin;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  tweens: Phaser.Tweens.TweenManager;
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
      startFrame: 0,
    });

    this.cursors = this.input.keyboard.createCursorKeys();
  };
  create = () => {
    const { make, anims, add } = this;
    const phaserUtils: CreateUtils = { make, anims, add };

    const elements = create(phaserUtils);

    this.elements = elements;
  };

  update = () => {
    const { cursors, tweens, elements, scene } = this;
    assert(cursors);
    const updateUtils: UpdateUtils = { cursors, tweens, scene };
    assert(elements);
    update({ updateUtils, elements });
  };
}
