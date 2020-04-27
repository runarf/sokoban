import { elements, updateUtils } from "../GameScene";
import { Moves } from "./constants";

export let movesCount: number = 0;

export function movePlayer(moves: Moves) {
  return new Promise((resolve) => {
    const { player } = elements;
    const { tweens } = updateUtils;
    const {
      player: { anims },
    } = elements;
    tweens.add({
      ...moves.absoluteMove,
      duration: 500,
      targets: player,
      onComplete: () => {
        stopPlayerAnimation(anims);
        resolve();
      },
      onStart: () => {
        anims.play(moves.direction, true);
      },
    });
    movesCount++;
    updateMovesCountText();
  });
}
const updateMovesCountText = () => {
  const { movesCountText } = elements;
  movesCountText.text = `Moves: ${movesCount}`;
};
export const stopPlayerAnimation = (
  anims: Phaser.GameObjects.Components.Animation
) => {
  const {
    currentAnim: { key },
  } = anims;
  if (!key.startsWith("idle-")) {
    anims.play(`idle-${key}`, true);
  }
};
