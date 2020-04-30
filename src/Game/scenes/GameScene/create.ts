import Phaser from "phaser"
import { assert } from "../../../utils/assert"
import {
  Elements,
  BoxesByColor,
  CreateUtils,
  SPRITESHEET_TILES_KEY,
} from "./GameScene"
import { Tiles, BoxColors } from "../../../consts/Tiles"

export function create(phaserUtils: CreateUtils): Elements {
  const level = [
    [
      Tiles.Wall,
      Tiles.Wall,
      Tiles.Wall,
      Tiles.Wall,
      Tiles.Wall,
      Tiles.Wall,
      Tiles.Wall,
      Tiles.Wall,
      Tiles.Wall,
      Tiles.Wall,
    ],
    [Tiles.Wall, 0, 0, 0, 0, 0, 0, 0, 0, Tiles.Wall],
    [
      Tiles.Wall,
      Tiles.BoxOrange,
      Tiles.BoxRed,
      Tiles.BoxBlue,
      Tiles.BoxGreen,
      Tiles.BoxGrey,
      0,
      0,
      0,
      Tiles.Wall,
    ],
    [
      Tiles.Wall,
      Tiles.TargetOrange,
      Tiles.TargetRed,
      Tiles.TargetBlue,
      Tiles.TargetGreen,
      Tiles.TargetGrey,
      Tiles.Player,
      0,
      0,
      Tiles.Wall,
    ],
    [Tiles.Wall, 0, 0, 0, 0, 0, 0, 0, 0, Tiles.Wall],
    [Tiles.Wall, 0, 0, 0, 0, 0, 0, 0, 0, Tiles.Wall],
    [Tiles.Wall, 0, 0, 0, 0, 0, 0, 0, 0, Tiles.Wall],
    [
      Tiles.Wall,
      Tiles.Wall,
      Tiles.Wall,
      Tiles.Wall,
      Tiles.Wall,
      Tiles.Wall,
      Tiles.Wall,
      Tiles.Wall,
      Tiles.Wall,
      Tiles.Wall,
    ],
  ]
  const { make, add, anims } = phaserUtils
  const tilemap = make.tilemap({
    data: level,
    tileWidth: 64,
    tileHeight: 64,
  })
  const tiles = tilemap.addTilesetImage(SPRITESHEET_TILES_KEY)
  const world = tilemap.createStaticLayer(0, tiles, 0, 0)
  const player = world
    .createFromTiles(Tiles.Player, 0, {
      key: SPRITESHEET_TILES_KEY,
      frame: Tiles.Player,
    })
    .pop()

  assert(player)

  player.setOrigin(0)

  const boxesByColor = getBoxesByColor(world)

  createPlayerAnimations(anims)

  const movesCountText = add.text(540, 10, "Moves: 0")
  return { player, world, boxesByColor, movesCountText }
}

const getBoxesByColor = (
  world: Phaser.Tilemaps.StaticTilemapLayer,
): BoxesByColor => {
  const boxesByColor = BoxColors.reduce<BoxesByColor>(
    (boxesByColor, boxColor) => {
      boxesByColor[boxColor] = world
        .createFromTiles(boxColor, 0, {
          key: SPRITESHEET_TILES_KEY,
          frame: boxColor,
        })
        .map((box) => box.setOrigin(0))

      return boxesByColor
    },
    {},
  )

  return boxesByColor
}

function createPlayerAnimations(anims: Phaser.Animations.AnimationManager) {
  anims.create({
    key: "idle-down",
    frames: [{ key: SPRITESHEET_TILES_KEY, frame: 52 }],
  })
  anims.create({
    key: "idle-left",
    frames: [{ key: SPRITESHEET_TILES_KEY, frame: 81 }],
  })
  anims.create({
    key: "idle-right",
    frames: [{ key: SPRITESHEET_TILES_KEY, frame: 78 }],
  })
  anims.create({
    key: "idle-up",
    frames: [{ key: SPRITESHEET_TILES_KEY, frame: 55 }],
  })
  anims.create({
    key: "left",
    frames: anims.generateFrameNumbers(SPRITESHEET_TILES_KEY, {
      start: 81,
      end: 83,
    }),
    frameRate: 10,
    repeat: -1,
  })
  anims.create({
    key: "right",
    frames: anims.generateFrameNumbers(SPRITESHEET_TILES_KEY, {
      start: 78,
      end: 80,
    }),
    frameRate: 10,
    repeat: -1,
  })
  anims.create({
    key: "up",
    frames: anims.generateFrameNumbers(SPRITESHEET_TILES_KEY, {
      start: 55,
      end: 57,
    }),
    frameRate: 10,
    repeat: -1,
  })
  anims.create({
    key: "down",
    frames: anims.generateFrameNumbers(SPRITESHEET_TILES_KEY, {
      start: 52,
      end: 54,
    }),
    frameRate: 10,
    repeat: -1,
  })
}
