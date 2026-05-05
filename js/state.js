const state = {
  scene: "home",
  muted: false,
  keys: {},
  cameraX: 0,
  lastThrowAt: 0,
  player: {},
  boss: {},
  enemies: [],
  coins: [],
  bottles: [],
  decor: [],
  projectiles: [],
};

function groundY() {
  return canvas.height - 42;
}

function resetWorld() {
  const floor = groundY();
  state.cameraX = 0;
  state.lastThrowAt = 0;
  state.projectiles = [];
  state.decor = [];
  state.player = new Player(floor);
  state.boss = new Boss(floor);
  state.enemies = ENEMY_SPAWN_POSITIONS.map(
    ({ type, x }) => new Enemy(type, x, floor),
  );
  state.coins = COIN_POSITIONS.map(
    ({ x, dy }) => new Coin(x, floor - 150 + dy),
  );
  state.bottles = createGroundBottles(floor);
}

function createGroundBottles(floor) {
  const list = [];
  for (let x = 320; x <= 3420; x += 165) list.push(new GroundBottle(x, floor));
  return list;
}
