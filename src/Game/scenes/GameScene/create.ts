import Phaser from "phaser";
import { assert } from "../../../utils/assert";
import { Elements, BoxesByColor, CreateUtils } from "./GameScene";
import { Tiles, BoxColors } from "../../../consts/Tiles";

export function create(phaserUtils: CreateUtils): Elements {
  const level = [
    [100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
    [100, 0, 0, 0, 0, 0, 0, 0, 0, 100],
    [
      100,
      Tiles.BoxOrange,
      Tiles.BoxRed,
      Tiles.BoxBlue,
      Tiles.BoxGreen,
      Tiles.BoxGrey,
      0,
      0,
      0,
      100,
    ],
    [
      100,
      Tiles.TargetOrange,
      Tiles.TargetRed,
      Tiles.TargetBlue,
      Tiles.TargetGreen,
      Tiles.TargetGrey,
      Tiles.Player,
      0,
      0,
      100,
    ],
    [100, 0, 0, 0, 0, 0, 0, 0, 0, 100],
    [100, 0, 0, 0, 0, 0, 0, 0, 0, 100],
    [100, 0, 0, 0, 0, 0, 0, 0, 0, 100],
    [100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
  ];
  const { make, add, anims } = phaserUtils;
  const tilemap = make.tilemap({
    data: level,
    tileWidth: 64,
    tileHeight: 64,
  });
  const tiles = tilemap.addTilesetImage("tiles");
  const world = tilemap.createStaticLayer(0, tiles, 0, 0);
  const player = world
    .createFromTiles(Tiles.Player, 0, {
      key: "tiles",
      frame: Tiles.Player,
    })
    .pop();

  assert(player);

  player.setOrigin(0);

  const boxesByColor = extractBoxes(world);

  createPlayerAnimations(anims);

  const movesCountText = add.text(540, 10, "Moves: 0");
  return { player, world, boxesByColor, movesCountText };
}

const extractBoxes = (
  world: Phaser.Tilemaps.StaticTilemapLayer
): BoxesByColor => {
  const boxesByColor = BoxColors.reduce<BoxesByColor>((prev, boxColor) => {
    prev[boxColor] = world
      .createFromTiles(boxColor, 0, { key: "tiles", frame: boxColor })
      .map((box) => box.setOrigin(0));

    return prev;
  }, {});

  return boxesByColor;
};

function createPlayerAnimations(anims: Phaser.Animations.AnimationManager) {
  anims.create({
    key: "idle-down",
    frames: [{ key: "tiles", frame: 52 }],
  });
  anims.create({
    key: "idle-left",
    frames: [{ key: "tiles", frame: 81 }],
  });
  anims.create({
    key: "idle-right",
    frames: [{ key: "tiles", frame: 78 }],
  });
  anims.create({
    key: "idle-up",
    frames: [{ key: "tiles", frame: 55 }],
  });
  anims.create({
    key: "left",
    frames: anims.generateFrameNumbers("tiles", {
      start: 81,
      end: 83,
    }),
    frameRate: 10,
    repeat: -1,
  });
  anims.create({
    key: "right",
    frames: anims.generateFrameNumbers("tiles", {
      start: 78,
      end: 80,
    }),
    frameRate: 10,
    repeat: -1,
  });
  anims.create({
    key: "up",
    frames: anims.generateFrameNumbers("tiles", {
      start: 55,
      end: 57,
    }),
    frameRate: 10,
    repeat: -1,
  });
  anims.create({
    key: "down",
    frames: anims.generateFrameNumbers("tiles", {
      start: 52,
      end: 54,
    }),
    frameRate: 10,
    repeat: -1,
  });
}
