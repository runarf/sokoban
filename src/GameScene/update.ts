import { assert } from "../utils/assert";
import { Elements } from "./GameScene";

export const update = ({
  elements,
  cursors,
  tweens
}: {
  elements: Elements;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  tweens: Phaser.Tweens.TweenManager;
}) => {
  assert(cursors);

  move(elements, cursors, tweens);
};

const move = (
  elements: Elements,
  cursors: Phaser.Types.Input.Keyboard.CursorKeys,
  tweens: Phaser.Tweens.TweenManager
) => {
  const {
    player: { anims }
  } = elements;
  const { JustDown } = Phaser.Input.Keyboard;
  const justLeft = JustDown(cursors.left!);
  const justRight = JustDown(cursors.right!);
  const justUp = JustDown(cursors.up!);
  const justDown = JustDown(cursors.down!);

  const tweenMove = tweenMoveCurry(tweens, elements);
  if (justLeft) {
    const baseTween = {
      x: "-=64"
    };
    const nx = -32;
    const ny = +32;
    tweenMove(nx, ny, baseTween, "left");
  } else if (justRight) {
    const baseTween = {
      x: "+=64"
    };
    const nx = +96;
    const ny = +32;
    tweenMove(nx, ny, baseTween, "right");
  } else if (justUp) {
    const nx = +32;
    const ny = -32;

    const baseTween = {
      y: "-=64"
    };
    tweenMove(nx, ny, baseTween, "up");
  } else if (justDown) {
    const baseTween = {
      y: "+=64"
    };
    const nx = +32;
    const ny = +96;
    tweenMove(nx, ny, baseTween, "down");
  } else if (anims.currentAnim) {
    stopPlayerAnimation(anims);
  }
};

const getBoxAt = (boxes: Phaser.GameObjects.Sprite[], x: number, y: number) => {
  return boxes.find(box => {
    const rect = box.getBounds();

    return rect.contains(x, y);
  });
};

const hasWallAt = (
  layer: Phaser.Tilemaps.StaticTilemapLayer,
  x: number,
  y: number
) => {
  const tile = layer.getTileAtWorldXY(x, y);
  if (!tile) {
    return false;
  }

  return tile.index === 100;
};

const hasTarget = (
  layer: Phaser.Tilemaps.StaticTilemapLayer,
  x: number,
  y: number
) => {};

const stopPlayerAnimation = (
  anims: Phaser.GameObjects.Components.Animation
) => {
  const {
    currentAnim: { key }
  } = anims;
  if (!key.startsWith("idle-")) {
    anims.play(`idle-${key}`, true);
  }
};

const tweenMoveCurry = (
  tweens: Phaser.Tweens.TweenManager,
  elements: Elements
) => {
  const { player, layer, blueBoxes: boxes } = elements;
  const { anims } = player;
  return (nx: number, ny: number, baseTween: object, onStart: string) => {
    const x = player.x + nx;
    const y = player.y + ny;
    if (tweens.isTweening(player)) {
      return;
    }
    if (hasWallAt(layer, x, y)) {
      return;
    }
    const box = getBoxAt(boxes, x, y);
    if (box) {
      tweens.add({
        ...baseTween,
        duration: 500,
        targets: box,
        onComplete: () => {}
      });
    }

    tweens.add({
      ...baseTween,
      duration: 500,
      targets: player,
      onComplete: () => {
        stopPlayerAnimation(anims);
      },
      onStart: () => {
        anims.play(onStart, true);
      }
    });
  };
};
