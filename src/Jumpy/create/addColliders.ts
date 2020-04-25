export function addColliders(
  physics: Phaser.Physics.Arcade.ArcadePhysics,
  elements: {
    scoreText: Phaser.GameObjects.Text;
    stars: Phaser.Physics.Arcade.Group;
    bombs: Phaser.Physics.Arcade.Group;
    player: Phaser.Physics.Arcade.Sprite;
    platforms: Phaser.Physics.Arcade.StaticGroup;
  }
) {
  const { scoreText, stars, bombs, player, platforms } = elements;
  physics.add.collider(player, platforms);
  physics.add.collider(stars, platforms);
  physics.add.collider(bombs, platforms);

  let score = 0;
  const hitBomb: ArcadePhysicsCallback = (player: any, _bomb: any) => {
    physics.pause();
    player.setTint(0xff0000);
    player.anims.play("turn");
    //   gameOver = true;
  };
  const collectStar: ArcadePhysicsCallback = (playerArg, starArg) => {
    const player = playerArg as Phaser.Physics.Arcade.Sprite;
    const star = starArg as Phaser.Physics.Arcade.Sprite;
    star.disableBody(true, true);
    score += 10;
    scoreText.setText("Score: " + score);
    if (stars.countActive(true) === 0) {
      stars.children.iterate(arg => {
        const child = arg as Phaser.Physics.Arcade.Image;
        child.enableBody(true, child.x, 0, true, true);
      });
      const x =
        player.x < 400
          ? Phaser.Math.Between(400, 800)
          : Phaser.Math.Between(0, 400);
      const bomb = bombs.create(x, 16, "bomb");
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocityY(Phaser.Math.Between(-200, 200), 20);
    }
  };

  physics.add.collider(player, bombs, hitBomb);
  physics.add.overlap(player, stars, collectStar);
  return score;
}
