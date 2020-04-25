import { addColliders } from "./addColliders";
import { createElements } from "./createElements";

export const create = (
  physics: Phaser.Physics.Arcade.ArcadePhysics,
  anims: Phaser.Animations.AnimationManager,
  add: Phaser.GameObjects.GameObjectFactory
) => {
  const elements = createElements(add, physics);
  addColliders(physics, elements);
  animatePlayer(anims);

  return elements.player;
};

export function animatePlayer(anims: Phaser.Animations.AnimationManager) {
  anims.create({
    key: "left",
    frames: anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: "turn",
    frames: [{ key: "dude", frame: 4 }],
    frameRate: 20
  });
  anims.create({
    key: "right",
    frames: anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });
}
