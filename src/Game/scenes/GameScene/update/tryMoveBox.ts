import { elements, updateUtils } from "../GameScene";
import { Tiles, BoxToTargetColorMap } from "../../../../consts/Tiles";
import { Moves } from "./constants";
import { targetsCoveredByColor } from ".";

export interface BoxData {
  box: Phaser.GameObjects.Sprite;
  color: number;
}

export const tryMoveBox = (boxData: BoxData | undefined, moves: Moves) => {
  if (boxData) {
    const { box } = boxData;
    const newBoxCenterX = box.x + moves.centerMove.x;
    const newBoxCenterY = box.y + moves.centerMove.y;
    if (
      hasWallAt(newBoxCenterX, newBoxCenterY) ||
      getBoxAt(newBoxCenterX, newBoxCenterY)
    ) {
      return false;
    }
    moveBox(moves, boxData);
  }
  return true;
};

const moveBox = (moves: Moves, boxData: BoxData) => {
  const { tweens } = updateUtils;
  const { box, color } = boxData;
  const boxTarget = BoxToTargetColorMap[color];
  const coveredTarget = hasTargetAt(box.x, box.y, boxTarget);
  if (coveredTarget) {
    targetsCoveredByColor[color]--;
  }
  tweens.add({
    ...moves.absoluteMove,
    duration: 500,
    targets: box,
  });
};

export const hasTargetAt = (x: number, y: number, tileToFind: Tiles) => {
  const tile = elements.world.getTileAtWorldXY(x, y);
  if (!tile) {
    return false;
  }
  return tile.index === tileToFind;
};

export const getBoxAt = (x: number, y: number) => {
  const { boxesByColor } = elements;
  const boxesByColorArray: [
    string,
    Phaser.GameObjects.Sprite[]
  ][] = Object.entries(boxesByColor);

  for (const [color, boxes] of boxesByColorArray) {
    const box = boxes.find((box) => {
      const rect = box.getBounds();
      const playerIsOnBox = rect.contains(x, y);
      return playerIsOnBox;
    });
    if (box) {
      return { box, color: Number(color) };
    }
  }
  return undefined;
};

export const hasWallAt = (x: number, y: number) => {
  const tile = elements.world.getTileAtWorldXY(x, y);
  if (!tile) {
    return false;
  }
  return tile.index === Tiles.Wall;
};
