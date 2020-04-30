import Phaser from "phaser";
import { create } from "./create";
import { assert } from "../../../utils/assert";
import { move } from "./update";

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

export const SCENE_GAME_NAME = "game";
export const SPRITESHEET_TILES_KEY = "tiles";

export let elements: Elements;
export let updateUtils: UpdateUtils;

export class GameScene extends Phaser.Scene {
  constructor() {
    super(SCENE_GAME_NAME);
  }
  preload = () => {
    const { load } = this;
    load.spritesheet(SPRITESHEET_TILES_KEY, "assets/sokoban_tilesheet.png", {
      frameWidth: 64,
      startFrame: 0
    });

    const cursors = this.input.keyboard.createCursorKeys();
    updateUtils = {
      cursors,
      scene: this.scene,
      tweens: this.tweens
    };
  };
  create = () => {
    const { make, anims, add } = this;
    const phaserUtils: CreateUtils = { make, anims, add };

    elements = create(phaserUtils);
  };

  update = () => {
    move();
  };
}
