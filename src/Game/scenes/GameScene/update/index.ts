import { elements, updateUtils } from "../GameScene";
import { BoxToTargetColorMap, BoxColors } from "../../../../consts/Tiles";
import {
  MOVE_LEFT,
  MOVE_RIGHT,
  MOVE_UP,
  MOVE_DOWN,
  Moves,
  Center
} from "./constants";
import { stopPlayerAnimation, movePlayer, movesCount } from "./movePlayer";
import { hasWallAt, getBoxAt, tryMoveBox } from "./tryMoveBox";
import { SCENE_FINISHED_NAME } from "../../LevelFinishedScene";

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
    player: { anims }
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

export const getNewCenter = (
  sprite: Phaser.GameObjects.Sprite,
  moves: Moves
) => {
  const newCenterX = sprite.x + moves.centerMove.x;
  const newCenterY = sprite.y + moves.centerMove.y;
  const newCenter: Center = { x: newCenterX, y: newCenterY };

  return newCenter;
};

const tweenMove = (moves: Moves) => {
  const { player } = elements;
  const newPlayerCenter = getNewCenter(player, moves);
  if (hasWallAt(newPlayerCenter)) {
    return;
  }
  const boxData = getBoxAt(newPlayerCenter);

  const moved: boolean = tryMoveBox(boxData, moves);
  if (!moved) {
    return;
  }
  const { scene } = updateUtils;

  movePlayer(moves).then(() => {
    if (allTargetsCovered()) {
      console.log("you won woho");
      scene.start(SCENE_FINISHED_NAME, {
        moves: movesCount
      });
    }
  });
};

const allTargetsCovered = () => {
  return Object.values(targetsCoveredByColor).every(count => count === 1);
};
