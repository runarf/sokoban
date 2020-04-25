import Phaser from "phaser";
import { create } from "./create/create";
import { update } from "./update";
import { preload } from "./preload";

export class Jumpy extends Phaser.Scene {
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  player?: Phaser.Physics.Arcade.Sprite;

  constructor() {
    super("Jumpy");
  }
  preload = () => {
    const { load } = this;
    preload(load);
  };
  create = () => {
    const {
      physics,
      anims,
      add
    }: {
      physics: Phaser.Physics.Arcade.ArcadePhysics;
      anims: Phaser.Animations.AnimationManager;
      add: Phaser.GameObjects.GameObjectFactory;
    } = this;
    const player = create(physics, anims, add);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.player = player;
  };
  update = () => {
    const cursors = this.cursors!;
    const player = this.player!;
    update(cursors, player);
  };
}
