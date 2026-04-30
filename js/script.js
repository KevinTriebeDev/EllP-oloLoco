let canvas;
let ctx;
let rafId = 0;
let lastTime = 0;
const MAX_BOTTLES = 15;

const state = {
  scene: "home",
  muted: false,
  keys: {},
  worldWidth: 3600,
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

const imageCache = {};

const anim = {
  pepeIdle: range("assets/img/2_character_pepe/1_idle/idle/I-", 1, 10),
  pepeSleep: range("assets/img/2_character_pepe/1_idle/long_idle/I-", 11, 20),
  pepeWalk: range("assets/img/2_character_pepe/2_walk/W-", 21, 26),
  pepeJump: range("assets/img/2_character_pepe/3_jump/J-", 31, 39),
  pepeHurt: range("assets/img/2_character_pepe/4_hurt/H-", 41, 43),
  chickenWalk: range(
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/",
    1,
    3,
    "_w.png",
  ),
  chickWalk: range(
    "assets/img/3_enemies_chicken/chicken_small/1_walk/",
    1,
    3,
    "_w.png",
  ),
  chickenDead: ["assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png"],
  chickDead: ["assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png"],
  bossWalk: range("assets/img/4_enemie_boss_chicken/1_walk/G", 1, 4),
  bossAttack: range("assets/img/4_enemie_boss_chicken/3_attack/G", 13, 20),
  bossHurt: range("assets/img/4_enemie_boss_chicken/4_hurt/G", 21, 23),
  bossDead: range("assets/img/4_enemie_boss_chicken/5_dead/G", 24, 26),
  bottleRot: range(
    "assets/img/6_salsa_bottle/bottle_rotation/",
    1,
    4,
    "_bottle_rotation.png",
  ),
  bottleSplash: range(
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/",
    1,
    6,
    "_bottle_splash.png",
  ),
};

const bg = {
  air: "assets/img/5_background/layers/air.png",
  cloud: "assets/img/5_background/layers/4_clouds/full.png",
  third: "assets/img/5_background/layers/3_third_layer/full.png",
  second: "assets/img/5_background/layers/2_second_layer/full.png",
  first: "assets/img/5_background/layers/1_first_layer/full.png",
  bush1: "assets/img/5_background/layers/1_first_layer/1.png",
  bush2: "assets/img/5_background/layers/1_first_layer/2.png",
};

const icons = {
  health: "assets/img/7_statusbars/3_icons/icon_health.png",
  coin: "assets/img/7_statusbars/3_icons/icon_coin.png",
  bottle: "assets/img/7_statusbars/3_icons/icon_salsa_bottle.png",
  boss: "assets/img/7_statusbars/3_icons/icon_health_endboss.png",
};

const screens = {
  start: "assets/img/9_intro_outro_screens/start/startscreen_1.png",
  won: "assets/img/You won, you lost/You won A.png",
  lost: "assets/img/9_intro_outro_screens/game_over/game over.png",
};

document.addEventListener("DOMContentLoaded", init);

function init() {
  bindCanvas();
  bindMenu();
  bindKeyboard();
  bindTouch();
  loadMuteSetting();
  setupOrientationCheck();
  preloadImages();
  showHomeScreen();
}

function bindCanvas() {
  canvas = byId("canvas");
  ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
}

function bindMenu() {
  byId("startButton").addEventListener("click", startGame);
  byId("optionsButton").addEventListener("click", openOptions);
  byId("closeModalButton").addEventListener("click", closeOptions);
  byId("modalBackdrop").addEventListener("click", closeOptions);
  byId("restartButton").addEventListener("click", startGame);
  byId("homeButton").addEventListener("click", showHomeScreen);
  byId("muteButton").addEventListener("click", toggleMute);
}

function bindKeyboard() {
  window.addEventListener("keydown", (e) => (state.keys[e.code] = true));
  window.addEventListener("keyup", (e) => (state.keys[e.code] = false));
}

function bindTouch() {
  document.querySelectorAll(".touch-button").forEach(addTouchEvents);
}

function addTouchEvents(button) {
  const key = button.dataset.key;
  button.addEventListener("contextmenu", (e) => e.preventDefault());
  button.addEventListener("touchstart", (e) => setTouchKey(e, key, true), {
    passive: false,
  });
  button.addEventListener("touchend", (e) => setTouchKey(e, key, false), {
    passive: false,
  });
  button.addEventListener("mousedown", () => (state.keys[key] = true));
  button.addEventListener("mouseup", () => (state.keys[key] = false));
  button.addEventListener("mouseleave", () => (state.keys[key] = false));
}

function setTouchKey(e, key, pressed) {
  e.preventDefault();
  state.keys[key] = pressed;
}

function preloadImages() {
  const allPaths = [
    ...Object.values(bg),
    ...Object.values(icons),
    ...anim.pepeIdle,
    ...anim.pepeSleep,
    ...anim.pepeWalk,
    ...anim.pepeJump,
    ...anim.pepeHurt,
    ...anim.chickenWalk,
    ...anim.chickWalk,
    ...anim.chickenDead,
    ...anim.chickDead,
    ...anim.bossWalk,
    ...anim.bossAttack,
    ...anim.bossHurt,
    ...anim.bossDead,
    ...anim.bottleRot,
    ...anim.bottleSplash,
    "assets/img/8_coin/coin_1.png",
    "assets/img/8_coin/coin_2.png",
    "assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
    "assets/img/6_salsa_bottle/salsa_bottle.png",
    screens.start,
    screens.won,
    screens.lost,
  ];
  allPaths.forEach((path) => getImage(path));
}

function loadMuteSetting() {
  state.muted = localStorage.getItem("epl-muted") === "true";
  updateMuteButtonText();
}

function toggleMute() {
  state.muted = !state.muted;
  localStorage.setItem("epl-muted", String(state.muted));
  updateMuteButtonText();
}

function updateMuteButtonText() {
  byId("muteButton").textContent = state.muted ? "Sound: Aus" : "Sound: An";
}

function setupOrientationCheck() {
  const watcher = () => setOrientationMessage();
  watcher();
  window.addEventListener("resize", watcher);
  window.addEventListener("orientationchange", watcher);
}

function setOrientationMessage() {
  const mobile = window.innerWidth <= 900;
  const portrait = window.innerHeight > window.innerWidth;
  byId("orientationOverlay").classList.toggle("hidden", !(mobile && portrait));
}

function showHomeScreen() {
  state.scene = "home";
  cancelAnimationFrame(rafId);
  byId("menuButtons").classList.remove("hidden");
  byId("endScreen").classList.add("hidden");
  byId("touchControls").classList.add("hidden");
  drawHome();
}

function drawHome() {
  drawScreenImage(screens.start);
}

function startGame() {
  resetWorld();
  lastTime = 0;
  state.scene = "running";
  byId("menuButtons").classList.add("hidden");
  byId("endScreen").classList.add("hidden");
  if (window.innerWidth <= 900)
    byId("touchControls").classList.remove("hidden");
  rafId = requestAnimationFrame(gameLoop);
}

function resetWorld() {
  const floor = groundY();
  state.cameraX = 0;
  state.lastThrowAt = 0;
  state.projectiles = [];
  state.player = {
    x: 80,
    y: floor - 140,
    w: 88,
    h: 140,
    vx: 0,
    vy: 0,
    dir: 1,
    hp: 100,
    coins: 0,
    bottles: 0,
    frame: 0,
    hurtUntil: 0,
    idleSince: performance.now(),
  };
  state.boss = {
    x: state.worldWidth - 260,
    y: floor - 170,
    w: 150,
    h: 170,
    hp: 100,
    frame: 0,
    mode: "walk",
    hurtUntil: 0,
    attackUntil: 0,
    deadAt: 0,
    deadFinished: false,
  };
  state.enemies = createEnemies(floor);
  state.coins = createCoins(floor);
  state.bottles = createGroundBottles(floor);
  state.decor = createDecorations(floor);
}

function createEnemies(floor) {
  return [
    spawnEnemy("chicken", 500, floor),
    spawnEnemy("small", 840, floor),
    spawnEnemy("chicken", 1180, floor),
    spawnEnemy("small", 1540, floor),
    spawnEnemy("chicken", 1900, floor),
    spawnEnemy("small", 2250, floor),
    spawnEnemy("chicken", 2600, floor),
  ];
}

function spawnEnemy(type, x, floor) {
  const isSmall = type === "small";
  const w = isSmall ? 66 : 82;
  const h = isSmall ? 66 : 82;
  return {
    type,
    x,
    y: floor - h,
    w,
    h,
    frame: 0,
    alive: true,
    dir: 1,
    patrolDir: 1,
    speed: isSmall ? 90 : 65,
    minX: x - (isSmall ? 170 : 110),
    maxX: x + (isSmall ? 170 : 120),
    attackUntil: 0,
    nextAttackAt: 0,
    attackDir: 1,
    deadUntil: 0,
  };
}

function createCoins(floor) {
  const y = floor - 150;
  return [
    coinAt(360, y),
    coinAt(430, y - 20),
    coinAt(500, y),
    coinAt(920, y),
    coinAt(990, y - 30),
    coinAt(1060, y),
    coinAt(1650, y),
    coinAt(1720, y - 15),
    coinAt(1790, y),
    coinAt(2440, y),
    coinAt(2510, y - 25),
    coinAt(2580, y),
  ];
}

function coinAt(x, y) {
  return {
    x,
    y,
    w: 38,
    h: 38,
    taken: false,
    frame: Math.random() > 0.5 ? 1 : 0,
  };
}

function createGroundBottles(floor) {
  const list = [];
  for (let x = 320; x <= 3420; x += 165) list.push(bottleAt(x, floor));
  return list;
}

function createDecorations(floor) {
  return [
    decorAt("bottle", 260, floor - 108, 78, 108),
    decorAt("bush1", 620, floor - 170, 220, 170),
    decorAt("bottle", 890, floor - 112, 82, 112),
    decorAt("bush2", 1250, floor - 176, 230, 176),
    decorAt("bottle", 1600, floor - 118, 86, 118),
    decorAt("bush1", 2050, floor - 172, 225, 172),
    decorAt("bottle", 2460, floor - 112, 82, 112),
    decorAt("bush2", 2940, floor - 178, 235, 178),
  ];
}

function decorAt(type, x, y, w, h) {
  return { type, x, y, w, h };
}

function bottleAt(x, floor) {
  return {
    x,
    y: floor - 64,
    w: 48,
    h: 64,
    taken: false,
    frame: Math.random() > 0.5 ? 1 : 0,
  };
}

function groundY() {
  return canvas.height - 42;
}

function gameLoop(time) {
  const dt = getDeltaSeconds(time);
  updatePlayer(dt, time);
  updateEnemies(dt);
  updateProjectiles(dt);
  collectItems();
  checkCollisions(time);
  updateCamera();
  drawFrame();
  if (state.scene === "running") rafId = requestAnimationFrame(gameLoop);
}

function getDeltaSeconds(time) {
  if (!lastTime) {
    lastTime = time;
    return 0;
  }
  const dt = (time - lastTime) / 1000;
  lastTime = time;
  return Math.min(dt, 0.033);
}

function updatePlayer(dt, now) {
  movePlayer(dt);
  applyJump();
  applyThrow(now);
  applyGravity(dt);
  clampPlayerX();
  updatePlayerAnimation(dt);
}

function movePlayer(dt) {
  const speed = 210;
  let vx = 0;
  if (state.keys.ArrowLeft) vx = -speed;
  if (state.keys.ArrowRight) vx = speed;
  state.player.vx = vx;
  state.player.x += vx * dt;
  if (vx !== 0) state.player.dir = vx > 0 ? 1 : -1;
  if (vx !== 0) state.player.idleSince = performance.now();
}

function applyJump() {
  const onGround = state.player.y >= groundY() - state.player.h - 0.5;
  if (!state.keys.ArrowUp || !onGround) return;
  state.player.vy = -430;
  state.player.idleSince = performance.now();
}

function applyThrow(now) {
  const cooldownOk = now - state.lastThrowAt > 450;
  if (!state.keys.KeyD || !cooldownOk || state.player.bottles <= 0) return;
  state.lastThrowAt = now;
  state.player.bottles -= 1;
  state.projectiles.push(createProjectile());
  state.player.idleSince = performance.now();
}

function createProjectile() {
  const dir = state.player.dir;
  return {
    x: state.player.x + (dir === 1 ? state.player.w - 10 : -10),
    y: state.player.y + 46,
    w: 38,
    h: 38,
    vx: dir * 380,
    vy: -190,
    frame: 0,
    alive: true,
    splash: false,
    splashFrame: 0,
  };
}

function applyGravity(dt) {
  state.player.vy += 980 * dt;
  state.player.y += state.player.vy * dt;
  const floor = groundY() - state.player.h;
  if (state.player.y > floor) {
    state.player.y = floor;
    state.player.vy = 0;
  }
}

function clampPlayerX() {
  state.player.x = clamp(state.player.x, 0, state.worldWidth - state.player.w);
}

function updatePlayerAnimation(dt) {
  const rate = state.player.vx === 0 ? 5 : 10;
  if (state.player.vy < -30 || state.player.vy > 40)
    state.player.frame += dt * 12;
  else state.player.frame += dt * rate;
}

function updateEnemies(dt) {
  const now = performance.now();
  updateBossAI(dt, now);
  state.enemies.forEach((enemy) => {
    if (!enemy.alive) {
      if (now > enemy.deadUntil) enemy.hidden = true;
      return;
    }
    updateEnemyAttack(enemy, now);
    const attacking = enemy.attackUntil > now;
    const activeDir = attacking ? enemy.attackDir : enemy.patrolDir;
    const speed = attacking ? enemy.speed * 2 : enemy.speed;
    enemy.x += speed * activeDir * dt;
    if (enemy.x <= enemy.minX) {
      enemy.x = enemy.minX;
      enemy.patrolDir = 1;
    }
    if (enemy.x >= enemy.maxX) {
      enemy.x = enemy.maxX;
      enemy.patrolDir = -1;
    }
    enemy.dir = attacking ? activeDir : enemy.patrolDir;
    enemy.frame += dt * 8;
  });
}

function updateBossAI(dt, now) {
  if (state.boss.deadFinished) return;
  if (state.boss.hp <= 0) {
    state.boss.mode = "dead";
    state.boss.frame += dt * 6;
    if (!state.boss.deadAt) state.boss.deadAt = now;
    if (state.boss.frame >= anim.bossDead.length - 0.1) {
      state.boss.deadFinished = true;
      endGame(true);
    }
    return;
  }
  const distance = Math.abs(state.player.x - state.boss.x);
  if (now < state.boss.hurtUntil) {
    state.boss.mode = "hurt";
    state.boss.frame += dt * 8;
    return;
  }
  if (distance < 180) {
    state.boss.mode = "attack";
    state.boss.attackUntil = now + 350;
    state.boss.frame += dt * 10;
    if (state.boss.x < state.player.x) state.boss.x += 70 * dt;
    else state.boss.x -= 70 * dt;
    return;
  }
  state.boss.mode = "walk";
  state.boss.frame += dt * 6;
  if (state.boss.x < state.player.x) state.boss.x += 55 * dt;
  else state.boss.x -= 55 * dt;
}

function updateEnemyAttack(enemy, now) {
  if (enemy.type !== "small") return;
  if (now < enemy.nextAttackAt) return;
  const distance = Math.abs(enemy.x - state.player.x);
  if (distance > 240) return;
  enemy.attackUntil = now + 500;
  enemy.nextAttackAt = now + 1700;
  enemy.attackDir = state.player.x > enemy.x ? 1 : -1;
}

function updateProjectiles(dt) {
  state.projectiles.forEach((bottle) => {
    if (!bottle.alive) return;
    if (bottle.splash) {
      bottle.splashFrame += dt * 12;
      if (bottle.splashFrame >= anim.bottleSplash.length - 0.1)
        bottle.alive = false;
      return;
    }
    bottle.x += bottle.vx * dt;
    bottle.y += bottle.vy * dt;
    bottle.vy += 980 * dt;
    bottle.frame += dt * 12;
    if (bottle.y + bottle.h >= groundY()) startSplash(bottle);
    if (bottle.x < -80 || bottle.x > state.worldWidth + 80)
      bottle.alive = false;
  });
  state.projectiles = state.projectiles.filter((bottle) => bottle.alive);
}

function startSplash(bottle) {
  bottle.splash = true;
  bottle.vx = 0;
  bottle.vy = 0;
  bottle.y = groundY() - bottle.h;
  bottle.splashFrame = 0;
}

function collectItems() {
  state.coins.forEach((coin) => {
    if (
      coin.taken ||
      !isHit(hitbox(state.player, "player"), hitbox(coin, "coin"))
    )
      return;
    coin.taken = true;
    state.player.coins += 1;
  });
  state.bottles.forEach((bottle) => {
    if (
      bottle.taken ||
      !isHit(hitbox(state.player, "player"), hitbox(bottle, "pickup"))
    )
      return;
    bottle.taken = true;
    state.player.bottles = Math.min(MAX_BOTTLES, state.player.bottles + 1);
  });
}

function checkCollisions(now) {
  state.enemies.forEach((enemy) => collideEnemy(enemy, now));
  collideBoss(now);
  collideProjectiles();
  if (state.player.hp <= 0) endGame(false);
  if (state.boss.hp <= 0) endGame(true);
}

function collideEnemy(enemy, now) {
  if (!enemy.alive || enemy.hidden) return;
  const p = hitbox(state.player, "player");
  const e = hitbox(enemy, "enemy");
  if (!isHit(p, e)) return;
  if (isStompHit(state.player, enemy)) {
    killEnemy(enemy, now);
    state.player.vy = -310;
    return;
  }
  hurtPlayer(now, 8);
}

function collideBoss(now) {
  if (state.boss.hp <= 0) return;
  const p = hitbox(state.player, "player");
  const b = hitbox(state.boss, "boss");
  if (!isHit(p, b)) return;
  if (isStompHit(state.player, state.boss)) {
    state.boss.hp = Math.max(0, state.boss.hp - 8);
    state.boss.hurtUntil = now + 420;
    state.boss.frame = 0;
    state.player.vy = -330;
    return;
  }
  const damage = state.boss.mode === "attack" ? 18 : 12;
  hurtPlayer(now, damage);
}

function collideProjectiles() {
  const now = performance.now();
  state.projectiles.forEach((bottle) => {
    if (!bottle.alive || bottle.splash) return;
    const shot = hitbox(bottle, "projectile");
    state.enemies.forEach((enemy) => {
      if (!enemy.alive || enemy.hidden || !isHit(shot, hitbox(enemy, "enemy")))
        return;
      killEnemy(enemy, now);
      startSplash(bottle);
    });
    if (state.boss.hp > 0 && isHit(shot, hitbox(state.boss, "boss"))) {
      state.boss.hp = Math.max(0, state.boss.hp - 10);
      state.boss.hurtUntil = now + 420;
      state.boss.frame = 0;
      startSplash(bottle);
    }
  });
}

function killEnemy(enemy, now) {
  enemy.alive = false;
  enemy.hidden = false;
  enemy.deadUntil = now + 700;
  state.player.bottles = Math.min(MAX_BOTTLES, state.player.bottles + 3);
}

function hurtPlayer(now, damage) {
  if (now < state.player.hurtUntil) return;
  state.player.hurtUntil = now + 700;
  state.player.hp = Math.max(0, state.player.hp - damage);
}

function isStompHit(player, enemy) {
  return player.vy > 70 && player.y + player.h - 8 < enemy.y + 24;
}

function updateCamera() {
  const target = state.player.x - canvas.width * 0.35;
  state.cameraX = clamp(target, 0, state.worldWidth - canvas.width);
}

function drawFrame() {
  drawBackgroundLayers();
  drawWorldItems();
  drawDecor();
  drawEnemies();
  drawBoss();
  drawPlayer();
  drawProjectiles();
  drawStatusBars();
}

function drawBackgroundLayers() {
  drawLayer(bg.air, 0);
  drawLayer(bg.cloud, 0.2);
  drawLayer(bg.third, 0.45);
  drawLayer(bg.second, 0.65);
  drawLayer(bg.first, 1);
}

function drawLayer(path, factor) {
  const image = getImage(path);
  if (!image.complete) return;
  const tileW = 720;
  const offset = (state.cameraX * factor) % tileW;
  for (let x = -offset - tileW; x < canvas.width + tileW; x += tileW) {
    ctx.drawImage(image, x, 0, tileW, canvas.height);
  }
}

function drawWorldItems() {
  state.coins.forEach((coin) => drawCoin(coin));
  state.bottles.forEach((bottle) => drawGroundBottle(bottle));
}

function drawCoin(coin) {
  if (coin.taken) return;
  coin.frame += 0.15;
  const path =
    coin.frame % 2 > 1
      ? "assets/img/8_coin/coin_2.png"
      : "assets/img/8_coin/coin_1.png";
  const image = getImage(path);
  if (!image.complete) return;
  ctx.drawImage(image, coin.x - state.cameraX, coin.y, coin.w, coin.h);
}

function drawGroundBottle(bottle) {
  if (bottle.taken) return;
  const path =
    bottle.frame > 0.5
      ? "assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png"
      : "assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png";
  const image = getImage(path);
  if (!image.complete) return;
  ctx.drawImage(image, bottle.x - state.cameraX, bottle.y, bottle.w, bottle.h);
}

function drawDecor() {
  state.decor.forEach((item) => {
    const x = item.x - state.cameraX;
    const path = decorPath(item.type);
    const image = getImage(path);
    if (!image.complete) return;
    ctx.drawImage(image, x, item.y, item.w, item.h);
  });
}

function decorPath(type) {
  if (type === "bottle") return "assets/img/6_salsa_bottle/salsa_bottle.png";
  if (type === "bush1") return bg.bush1;
  return bg.bush2;
}

function drawEnemies() {
  state.enemies.forEach((enemy) => {
    if (enemy.hidden) return;
    const dead = !enemy.alive;
    const frames = dead
      ? enemy.type === "small"
        ? anim.chickDead
        : anim.chickenDead
      : enemy.type === "small"
        ? anim.chickWalk
        : anim.chickenWalk;
    const flipX = enemy.type === "small" ? enemy.dir > 0 : enemy.dir > 0;
    drawSprite(frames, enemy.frame, enemy, flipX);
  });
}

function drawBoss() {
  const frames = getBossFrames();
  const faceLeft = state.boss.x > state.player.x;
  drawSprite(frames, state.boss.frame, state.boss, faceLeft);
}

function getBossFrames() {
  if (state.boss.mode === "dead") return anim.bossDead;
  if (state.boss.mode === "hurt") return anim.bossHurt;
  if (state.boss.mode === "attack") return anim.bossAttack;
  return anim.bossWalk;
}

function drawPlayer() {
  const frames = getPlayerFrames();
  drawSprite(frames, state.player.frame, state.player, state.player.dir < 0);
}

function getPlayerFrames() {
  const now = performance.now();
  if (now < state.player.hurtUntil) return anim.pepeHurt;
  if (Math.abs(state.player.vy) > 40) return anim.pepeJump;
  if (Math.abs(state.player.vx) > 5) return anim.pepeWalk;
  if (now - state.player.idleSince >= 3000) return anim.pepeSleep;
  return anim.pepeIdle;
}

function drawProjectiles() {
  state.projectiles.forEach((bottle) => {
    const x = bottle.x - state.cameraX;
    const y = bottle.y;
    if (bottle.splash) {
      drawFrameByIndex(
        anim.bottleSplash,
        bottle.splashFrame,
        x,
        y,
        bottle.w,
        bottle.h,
      );
      return;
    }
    drawFrameByIndex(anim.bottleRot, bottle.frame, x, y, bottle.w, bottle.h);
  });
}

function drawSprite(paths, frame, entity, flipX) {
  const x = entity.x - state.cameraX;
  const y = entity.y;
  const idx = Math.floor(frame) % paths.length;
  const image = getImage(paths[idx]);
  if (!image.complete) return;
  if (!flipX) {
    ctx.drawImage(image, x, y, entity.w, entity.h);
    return;
  }
  ctx.save();
  ctx.scale(-1, 1);
  ctx.drawImage(image, -x - entity.w, y, entity.w, entity.h);
  ctx.restore();
}

function drawFrameByIndex(paths, frame, x, y, w, h) {
  const idx = Math.floor(frame) % paths.length;
  const image = getImage(paths[idx]);
  if (!image.complete) return;
  ctx.drawImage(image, x, y, w, h);
}

function drawStatusBars() {
  drawStatusBar("health", state.player.hp, 16, 14);
  drawStatusBar("coin", playerCoinsPercent(), 16, 48);
  drawStatusBar("bottle", (state.player.bottles / MAX_BOTTLES) * 100, 16, 82);
  drawBossStatusBar();
}

function drawStatusBar(kind, value, x, y) {
  const step = nearestBarValue(value);
  const path = statusPath(kind, step);
  const bar = getImage(path);
  if (bar.complete) ctx.drawImage(bar, x + 28, y, 170, 38);
  const icon = getImage(icons[kind]);
  if (icon.complete) ctx.drawImage(icon, x, y + 2, 28, 28);
}

function drawBossStatusBar() {
  const step = nearestBarValue(state.boss.hp);
  const bar = getImage(
    `assets/img/7_statusbars/2_statusbar_endboss/orange/orange${step}.png`,
  );
  const icon = getImage(icons.boss);
  if (bar.complete) ctx.drawImage(bar, canvas.width - 226, 14, 170, 38);
  if (icon.complete) ctx.drawImage(icon, canvas.width - 254, 16, 28, 28);
}

function playerCoinsPercent() {
  const total = state.coins.length || 1;
  return (state.player.coins / total) * 100;
}

function nearestBarValue(value) {
  const clamped = clamp(value, 0, 100);
  const rounded = Math.round(clamped / 20) * 20;
  return clamp(rounded, 0, 100);
}

function statusPath(kind, value) {
  if (kind === "health")
    return `assets/img/7_statusbars/1_statusbar/2_statusbar_health/orange/${value}.png`;
  if (kind === "coin")
    return `assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/${value}.png`;
  return `assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/${value}.png`;
}

function hitbox(entity, type) {
  if (type === "player")
    return box(entity.x + 18, entity.y + 16, entity.w - 36, entity.h - 20);
  if (type === "boss")
    return box(entity.x + 24, entity.y + 20, entity.w - 38, entity.h - 26);
  if (type === "enemy")
    return box(entity.x + 10, entity.y + 12, entity.w - 20, entity.h - 16);
  if (type === "projectile")
    return box(entity.x + 6, entity.y + 6, entity.w - 12, entity.h - 12);
  if (type === "coin")
    return box(entity.x + 7, entity.y + 7, entity.w - 14, entity.h - 14);
  return box(entity.x + 8, entity.y + 8, entity.w - 16, entity.h - 16);
}

function box(x, y, w, h) {
  return { x, y, w, h };
}

function isHit(a, b) {
  return (
    a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
  );
}

function drawOverlayText(text, y) {
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.fillRect(160, y - 34, 400, 44);
  ctx.fillStyle = "white";
  ctx.font = "bold 30px Trebuchet MS";
  ctx.textAlign = "center";
  ctx.fillText(text, canvas.width / 2, y);
  ctx.textAlign = "left";
}

function endGame(won) {
  state.scene = "end";
  cancelAnimationFrame(rafId);
  byId("touchControls").classList.add("hidden");
  byId("endTitle").textContent = won ? "Gewonnen!" : "Verloren!";
  byId("endScreen").style.backgroundImage =
    `url("${won ? screens.won : screens.lost}")`;
  byId("endScreen").style.backgroundColor = "transparent";
  byId("endScreen").classList.remove("hidden");
}

function drawScreenImage(path) {
  const image = getImage(path);
  if (!image.complete) {
    drawBackgroundLayers();
    drawOverlayText("El Pollo Loco", 58);
    drawOverlayText("Druecke Start", 98);
    return;
  }
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
}

function openOptions() {
  byId("optionsModal").classList.remove("hidden");
}

function closeOptions() {
  byId("optionsModal").classList.add("hidden");
}

function byId(id) {
  return document.getElementById(id);
}

function getImage(path) {
  if (imageCache[path]) return imageCache[path];
  const image = new Image();
  image.src = path;
  imageCache[path] = image;
  return image;
}

function range(prefix, min, max, suffix = ".png") {
  const result = [];
  for (let i = min; i <= max; i++) result.push(`${prefix}${i}${suffix}`);
  return result;
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}
