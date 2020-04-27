import { assert } from "../utils/assert";
import { Elements, BoxesByColor } from "./GameScene";
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

export const update = ({
  elements,
  cursors,
  tweens,
}: {
  elements: Elements;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  tweens: Phaser.Tweens.TweenManager;
}) => {
  assert(cursors);

  move(elements, cursors, tweens);
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
}

const move = (
  elements: Elements,
  cursors: Phaser.Types.Input.Keyboard.CursorKeys,
  tweens: Phaser.Tweens.TweenManager
) => {
  const {
    player: { anims },
  } = elements;
  const { JustDown } = Phaser.Input.Keyboard;
  const justLeft = JustDown(cursors.left!);
  const justRight = JustDown(cursors.right!);
  const justUp = JustDown(cursors.up!);
  const justDown = JustDown(cursors.down!);

  const tweenMove = tweenMoveCurry(tweens, elements);
  if (justLeft) {
    const moves: Moves = {
      absoluteMove: { x: "-=" + TILE_SIZE },
      centerMove: { x: -TILE_CENTER, y: TILE_CENTER },
    };
    tweenMove(moves, "left");
  } else if (justRight) {
    const moves: Moves = {
      absoluteMove: { x: `+=${TILE_SIZE}` },
      centerMove: { x: TILE_CENTER_AFTER_MOVE, y: TILE_CENTER },
    };
    tweenMove(moves, "right");
  } else if (justUp) {
    const moves: Moves = {
      absoluteMove: { y: "-=" + TILE_SIZE },
      centerMove: { x: TILE_CENTER, y: -TILE_CENTER },
    };
    tweenMove(moves, "up");
  } else if (justDown) {
    const moves: Moves = {
      absoluteMove: { y: "+=" + TILE_SIZE },
      centerMove: { x: TILE_CENTER, y: TILE_CENTER_AFTER_MOVE },
    };
    tweenMove(moves, "down");
  } else if (anims.currentAnim) {
    stopPlayerAnimation(anims);
  }
};

const tweenMoveCurry = (
  tweens: Phaser.Tweens.TweenManager,
  elements: Elements
) => {
  const { player, world, boxesByColor } = elements;
  const { anims } = player;
  const getBoxAt = getBoxAtCurry(boxesByColor);
  const hasWallAt = hasWallAtCurry(world);
  const hasTargetAt = hasTargetAtCurry(world);
  return (moves: Moves, onStart: string) => {
    const newPlayerCenterX = player.x + moves.centerMove.x;
    const newPlayerCenterY = player.y + moves.centerMove.y;
    if (tweens.isTweening(player)) {
      return;
    }
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

      tweens.add({
        ...moves.absoluteMove,
        duration: 500,
        targets: box,
        onComplete: () => {
          const coveredTarget = hasTargetAt(box.x, box.y, boxTarget);
          if (coveredTarget) {
            changeTargetCoveredCountForColor(color, 1);
            if (allTargetsCovered()) {
              console.log("you won woho");
            }
          }
        },
      });
    }

    tweens.add({
      ...moves.absoluteMove,
      duration: 500,
      targets: player,
      onComplete: () => {
        stopPlayerAnimation(anims);
      },
      onStart: () => {
        anims.play(onStart, true);
      },
    });
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
