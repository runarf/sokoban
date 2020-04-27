import { elements, updateUtils } from "../GameScene";
import { BoxToTargetColorMap, BoxColors } from "../../consts/Tiles";
import { MOVE_LEFT, MOVE_RIGHT, MOVE_UP, MOVE_DOWN, Moves } from "./constants";
import { stopPlayerAnimation, movePlayer, movesCount } from "./movePlayer";
import {
  hasWallAt,
  getBoxAt,
  tryMoveBox,
  hasTargetAt,
  BoxData,
} from "./tryMoveBox";

export const targetsCoveredByColor = BoxColors.reduce<{
  [boxColor: number]: number;
}>((prev, color) => {
  prev[color] = 0;
  return prev;
}, {});

export const move = () => {
  if (updateUtils.tweens.isTweening(elements.player)) {
    return;
  }
  handleArrowPress();
};

function handleArrowPress() {
  const { cursors } = updateUtils;
  const {
    player: { anims },
  } = elements;
  const { JustDown } = Phaser.Input.Keyboard;
  const justLeft = JustDown(cursors.left!);
  const justRight = JustDown(cursors.right!);
  const justUp = JustDown(cursors.up!);
  const justDown = JustDown(cursors.down!);
  if (justLeft) {
    tweenMove(MOVE_LEFT);
  } else if (justRight) {
    tweenMove(MOVE_RIGHT);
  } else if (justUp) {
    tweenMove(MOVE_UP);
  } else if (justDown) {
    tweenMove(MOVE_DOWN);
  } else if (anims.currentAnim) {
    stopPlayerAnimation(anims);
  }
}

const tweenMove = (moves: Moves) => {
  const { player } = elements;
  const newPlayerCenterX = player.x + moves.centerMove.x;
  const newPlayerCenterY = player.y + moves.centerMove.y;
  if (hasWallAt(newPlayerCenterX, newPlayerCenterY)) {
    return;
  }
  const boxData = getBoxAt(newPlayerCenterX, newPlayerCenterY);

  const moved: boolean = tryMoveBox(boxData, moves);
  if (!moved) {
    return;
  }
  const { scene } = updateUtils;
  const finished = checkIfFinished(boxData);
  if (finished) {
    console.log("you won woho");
    scene.start("level-finished", {
      moves: movesCount,
    });
  }
  movePlayer(moves);
};

const checkIfFinished = (boxData?: BoxData): boolean => {
  if (boxData) {
    const { box, color } = boxData;
    const boxTarget = BoxToTargetColorMap[color];
    const coveredTarget = hasTargetAt(box.x, box.y, boxTarget);
    if (coveredTarget) {
      targetsCoveredByColor[color]++;
      if (allTargetsCovered()) {
        return true;
      }
    }
  }
  return false;
};

const allTargetsCovered = () => {
  return Object.values(targetsCoveredByColor).every((count) => count === 1);
};
