import { elements, updateUtils } from "../GameScene";
import { Tiles, BoxToTargetColorMap } from "../../../../consts/Tiles";
import { Moves, Center } from "./constants";
import { targetsCoveredByColor, getNewCenter } from ".";

export interface BoxData {
  box: Phaser.GameObjects.Sprite;
  color: number;
}

export const tryMoveBox = (boxData: BoxData | undefined, moves: Moves) => {
  if (boxData) {
    const { box } = boxData;
    const newBoxCenter: Center = getNewCenter(box, moves);
    if (hasWallAt(newBoxCenter) || getBoxAt(newBoxCenter)) {
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
  const coveredTarget = hasTargetAt({ x: box.x, y: box.y }, boxTarget);
  if (coveredTarget) {
    targetsCoveredByColor[color]--;
  }
  tweens.add({
    ...moves.absoluteMove,
    duration: 500,
    targets: box,
    onComplete: () => {
      checkIfBoxOnTarget(boxData);
    },
  });
};

const checkIfBoxOnTarget = (boxData: BoxData) => {
  const { box, color } = boxData;
  const boxTarget = BoxToTargetColorMap[color];
  const coveredTarget = hasTargetAt({ x: box.x, y: box.y }, boxTarget);
  if (coveredTarget) {
    targetsCoveredByColor[color]++;
  }
};

export const hasTargetAt = (center: Center, tileToFind: Tiles) => {
  console.log(center);
  const { x, y } = center;
  const tile = elements.world.getTileAtWorldXY(x, y);
  if (!tile) {
    return false;
  }
  return tile.index === tileToFind;
};

export const getBoxAt = (center: Center) => {
  const { boxesByColor } = elements;
  const boxesByColorArray: [
    string,
    Phaser.GameObjects.Sprite[]
  ][] = Object.entries(boxesByColor);

  const { x, y } = center;
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

export const hasWallAt = (newCenter: Center) => {
  const { x, y } = newCenter;
  const tile = elements.world.getTileAtWorldXY(x, y);
  if (!tile) {
    return false;
  }
  return tile.index === Tiles.Wall;
};
