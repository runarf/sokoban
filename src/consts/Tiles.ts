export enum Tiles {
  BoxOrange = 6,
  BoxRed = 7,
  BoxBlue = 8,
  BoxGreen = 9,
  BoxGrey = 10,

  Player = 52,

  TargetOrange = 25,
  TargetRed = 38,
  TargetBlue = 51,
  TargetGreen = 64,
  TargetGrey = 77,

  Wall = 100,
}

export const BoxToTargetColorMap: { [key: string]: Tiles } = {
  [Tiles.BoxOrange]: Tiles.TargetOrange,
  [Tiles.BoxRed]: Tiles.TargetRed,
  [Tiles.BoxBlue]: Tiles.TargetBlue,
  [Tiles.BoxGreen]: Tiles.TargetGreen,
  [Tiles.BoxGrey]: Tiles.TargetGrey,
};

export const BoxColors = [
  Tiles.BoxOrange,
  Tiles.BoxRed,
  Tiles.BoxBlue,
  Tiles.BoxGreen,
  Tiles.BoxGrey,
];

export const TILE_SIZE = 64;
export const TILE_CENTER = TILE_SIZE / 2;
export const TILE_CENTER_AFTER_MOVE = TILE_SIZE + TILE_CENTER;
