import { Elements, BoxesByColor, UpdateUtils } from "./GameScene";
import {
  Tiles,
  BoxToTargetColorMap,
  TILE_SIZE,
  TILE_CENTER,
  TILE_CENTER_AFTER_MOVE,
  BoxColors,
} from "../consts/Tiles";

const targetsCoveredByColor = BoxColors.reduce<{ [boxColor: number]: number }>(
  (prev, color) => {
    prev[color] = 0;
    return prev;
  },
  {}
);

let movesCount: number = 0;

export const update = ({
  elements,
  updateUtils,
}: {
  elements: Elements;
  updateUtils: UpdateUtils;
}) => {
  if (updateUtils.tweens.isTweening(elements.player)) {
    return;
  }
  move(elements, updateUtils);
};

interface CenterMove {
  x: number;
  y: number;
}

interface AbsoluteMove {
  x?: string;
  y?: string;
}

interface Moves {
  absoluteMove: AbsoluteMove;
  centerMove: CenterMove;
  direction: string;
}

const move = (elements: Elements, updateUtils: UpdateUtils) => {
  const {
    player: { anims },
  } = elements;
  const tweenMove = tweenMoveCurry(elements, updateUtils);

  handleArrowPress(updateUtils.cursors, tweenMove, anims);
};

const MOVE_LEFT: Moves = {
  absoluteMove: { x: "-=" + TILE_SIZE },
  centerMove: { x: -TILE_CENTER, y: TILE_CENTER },
  direction: "left",
};
const MOVE_RIGHT: Moves = {
  absoluteMove: { x: `+=${TILE_SIZE}` },
  centerMove: { x: TILE_CENTER_AFTER_MOVE, y: TILE_CENTER },
  direction: "right",
};
const MOVE_UP: Moves = {
  absoluteMove: { y: "-=" + TILE_SIZE },
  centerMove: { x: TILE_CENTER, y: -TILE_CENTER },
  direction: "up",
};
const MOVE_DOWN: Moves = {
  absoluteMove: { y: "+=" + TILE_SIZE },
  centerMove: { x: TILE_CENTER, y: TILE_CENTER_AFTER_MOVE },
  direction: "down",
};

function handleArrowPress(
  this: any,
  cursors: Phaser.Types.Input.Keyboard.CursorKeys,
  tweenMove: (moves: Moves) => void,
  anims: Phaser.GameObjects.Components.Animation
) {
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

interface BoxData {
  box: Phaser.GameObjects.Sprite;
  color: number;
}

const tweenMoveCurry = (elements: Elements, updateUtils: UpdateUtils) => {
  const { player, world, boxesByColor } = elements;
  const { tweens, scene } = updateUtils;

  const getBoxAt = getBoxAtCurry(boxesByColor);
  const hasWallAt = hasWallAtCurry(world);
  const hasTargetAt = hasTargetAtCurry(world);

  return (moves: Moves) => {
    const newPlayerCenterX = player.x + moves.centerMove.x;
    const newPlayerCenterY = player.y + moves.centerMove.y;

    if (hasWallAt(newPlayerCenterX, newPlayerCenterY)) {
      return;
    }
    const boxData = getBoxAt(newPlayerCenterX, newPlayerCenterY);
    if (boxData) {
      const { box, color } = boxData;
      const newBoxCenterX = box.x + moves.centerMove.x;
      const newBoxCenterY = box.y + moves.centerMove.y;
      if (
        hasWallAt(newBoxCenterX, newBoxCenterY) ||
        getBoxAt(newBoxCenterX, newBoxCenterY)
      ) {
        return;
      }
      const boxTarget = BoxToTargetColorMap[color];
      const coveredTarget = hasTargetAt(box.x, box.y, boxTarget);
      if (coveredTarget) {
        changeTargetCoveredCountForColor(color, -1);
      }

      const onCompleteBoxMove = (boxData: BoxData) => {
        const { box, color } = boxData;
        const boxTarget = BoxToTargetColorMap[color];
        const coveredTarget = hasTargetAt(box.x, box.y, boxTarget);
        if (coveredTarget) {
          changeTargetCoveredCountForColor(color, 1);
          if (allTargetsCovered()) {
            console.log("you won woho");
            scene.start("level-finished", {
              moves: movesCount,
            });
          }
        }
      };

      tweens.add({
        ...moves.absoluteMove,
        duration: 500,
        targets: box,
        onComplete: () => {
          onCompleteBoxMove(boxData);
        },
      });
    }

    movePlayer(elements, tweens, moves);
  };
};

const getBoxAtCurry = (boxesByColor: BoxesByColor) => (
  x: number,
  y: number
): undefined | { box: Phaser.GameObjects.Sprite; color: number } => {
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

const hasWallAtCurry = (world: Phaser.Tilemaps.StaticTilemapLayer) => (
  x: number,
  y: number
) => {
  const tile = world.getTileAtWorldXY(x, y);
  if (!tile) {
    return false;
  }

  return tile.index === Tiles.Wall;
};

const hasTargetAtCurry = (world: Phaser.Tilemaps.StaticTilemapLayer) => (
  x: number,
  y: number,
  tileToFind: Tiles
) => {
  const tile = world.getTileAtWorldXY(x, y);
  if (!tile) {
    return false;
  }

  return tile.index === tileToFind;
};

const updateMovesCountText = (countText: Phaser.GameObjects.Text) => {
  countText.text = `Moves: ${movesCount}`;
};

const stopPlayerAnimation = (
  anims: Phaser.GameObjects.Components.Animation
) => {
  const {
    currentAnim: { key },
  } = anims;
  if (!key.startsWith("idle-")) {
    anims.play(`idle-${key}`, true);
  }
};

const changeTargetCoveredCountForColor = (color: Tiles, change: number) => {
  targetsCoveredByColor[color] += change;
};

const allTargetsCovered = () => {
  return Object.values(targetsCoveredByColor).every((count) => count === 1);
};
function movePlayer(
  elements: Elements,
  tweens: Phaser.Tweens.TweenManager,
  moves: Moves
) {
  const { player } = elements;
  const {
    player: { anims },
  } = elements;
  tweens.add({
    ...moves.absoluteMove,
    duration: 500,
    targets: player,
    onComplete: () => {
      stopPlayerAnimation(anims);
      movesCount++;
      updateMovesCountText(elements.movesCountText);
    },
    onStart: () => {
      anims.play(moves.direction, true);
    },
  });
}
