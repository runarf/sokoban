import Phaser from "phaser";
export function update(
  cursors: Phaser.Types.Input.Keyboard.CursorKeys,
  player: Phaser.Physics.Arcade.Sprite
) {
  const left: Phaser.Input.Keyboard.Key | undefined = cursors.left;
  if (cursors.left!.isDown) {
    player.setVelocityX(-160);
    player.anims.play("left", true);
  } else if (cursors.right!.isDown) {
    player.setVelocityX(160);
    player.anims.play("right", true);
  } else {
    player.setVelocityX(0);
    player.anims.play("turn");
  }
  if (cursors.up!.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }
}
