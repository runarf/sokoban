export function createElements(
  add: Phaser.GameObjects.GameObjectFactory,
  physics: Phaser.Physics.Arcade.ArcadePhysics
) {
  add.image(400, 300, "sky");
  const player = createPlayer(physics);
  const platforms = createPlatforms(physics);
  const stars = makeStars(physics);
  const bombs = physics.add.group();
  const scoreText = add.text(16, 16, "score: 0", {
    fontSize: "32px",
    fill: "#000"
  });
  return { scoreText, stars, bombs, player, platforms };
}

export function createPlayer(physics: Phaser.Physics.Arcade.ArcadePhysics) {
  const player = physics.add.sprite(100, 450, "dude");
  player.setBounce(0.2);
  // player.body.setGravityY(300);
  player.setCollideWorldBounds(true);
  return player;
}

function createPlatforms(physics: Phaser.Physics.Arcade.ArcadePhysics) {
  const platforms = physics.add.staticGroup();
  platforms
    .create(400, 568, "ground")
    .setScale(2)
    .refreshBody();
  platforms.create(600, 400, "ground");
  platforms.create(50, 250, "ground");
  platforms.create(720, 220, "ground");
  return platforms;
}
function makeStars(physics: Phaser.Physics.Arcade.ArcadePhysics) {
  const stars = physics.add.group({
    key: "star",
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
  });
  stars.children.iterate(arg => {
    const child = arg as Phaser.Physics.Arcade.Image;
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });
  return stars;
}
