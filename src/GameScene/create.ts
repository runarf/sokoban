import Phaser from "phaser";
import { assert } from "../utils/assert";
import { Elements } from "./GameScene";

export function create(
  make: Phaser.GameObjects.GameObjectCreator,
  anims: Phaser.Animations.AnimationManager
): Elements {
  const level = [
    [100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
    [100, 0, 0, 0, 0, 0, 0, 0, 0, 100],
    [100, 0, 0, 0, 0, 0, 0, 0, 0, 100],
    [100, 0, 0, 51, 8, 52, 0, 0, 0, 100],
    [100, 0, 0, 0, 0, 0, 0, 0, 0, 100],
    [100, 0, 0, 0, 0, 0, 0, 0, 0, 100],
    [100, 0, 0, 0, 0, 0, 0, 0, 0, 100],
    [100, 100, 100, 100, 100, 100, 100, 100, 100, 100]
  ];
  const map = make.tilemap({
    data: level,
    tileWidth: 64,
    tileHeight: 64
  });
  const tiles = map.addTilesetImage("tiles");
  const layer = map.createStaticLayer(0, tiles, 0, 0);
  const player = layer
    .createFromTiles(52, 0, {
      key: "tiles",
      frame: 52
    })
    .pop();

  assert(player);

  player.setOrigin(0);
  const blueBoxes = layer
    .createFromTiles(50, 0, { key: "tiles", frame: 8 })
    .map(box => box.setOrigin(0));

  createPlayerAnimations(anims);

  return { blueBoxes, player, layer };
}
function createPlayerAnimations(anims: Phaser.Animations.AnimationManager) {
  anims.create({
    key: "idle-down",
    frames: [{ key: "tiles", frame: 52 }]
  });
  anims.create({
    key: "idle-left",
    frames: [{ key: "tiles", frame: 81 }]
  });
  anims.create({
    key: "idle-right",
    frames: [{ key: "tiles", frame: 78 }]
  });
  anims.create({
    key: "idle-up",
    frames: [{ key: "tiles", frame: 55 }]
  });
  anims.create({
    key: "left",
    frames: anims.generateFrameNumbers("tiles", {
      start: 81,
      end: 83
    }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: "right",
    frames: anims.generateFrameNumbers("tiles", {
      start: 78,
      end: 80
    }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: "up",
    frames: anims.generateFrameNumbers("tiles", {
      start: 55,
      end: 57
    }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: "down",
    frames: anims.generateFrameNumbers("tiles", {
      start: 52,
      end: 54
    }),
    frameRate: 10,
    repeat: -1
  });
}
