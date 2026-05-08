let canvas;
let ctx;
let rafId = 0;
let lastTime = 0;

/** Binds and prepares the game canvas context. */
function bindCanvas() {
  canvas = byId("canvas");
  ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
}

/** Preloads all configured image assets into cache. */
function preloadImages() {
  ALL_IMAGE_PATHS.forEach((path) => getImage(path));
}

/** Starts a new game session from a fresh world state. */
function startGame() {
  resetWorld();
  lastTime = 0;
  state.scene = "running";
  byId("menuButtons").classList.add("hidden");
  byId("endScreen").classList.add("hidden");
  showTouchControls();
  rafId = requestAnimationFrame(gameLoop);
}

/** Runs one animation frame with update and render steps. */
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

/** Converts timestamps into a clamped frame delta in seconds. */
function getDeltaSeconds(time) {
  if (!lastTime) {
    lastTime = time;
    return 0;
  }
  const dt = (time - lastTime) / 1000;
  lastTime = time;
  return Math.min(dt, 0.033);
}

/** Updates player movement, actions, gravity, and animation state. */
function updatePlayer(dt, now) {
  movePlayer(dt);
  applyJump();
  applyThrow(now);
  applyGravity(dt);
  clampPlayerX();
  updatePlayerAnimation(dt);
}

/** Moves player horizontally based on current key input. */
function movePlayer(dt) {
  let vx = 0;
  if (state.keys.ArrowLeft) vx = -210;
  if (state.keys.ArrowRight) vx = 210;
  state.player.vx = vx;
  state.player.x += vx * dt;
  if (vx !== 0) {
    state.player.dir = vx > 0 ? 1 : -1;
    state.player.idleSince = performance.now();
  }
}

/** Applies jump impulse when jump input is pressed on ground. */
function applyJump() {
  const onGround = state.player.y >= groundY() - state.player.h - 0.5;
  if (!state.keys.ArrowUp || !onGround) return;
  state.player.vy = -430;
  state.player.idleSince = performance.now();
}

/** Throws a bottle if cooldown and inventory allow it. */
function applyThrow(now) {
  const ready = now - state.lastThrowAt > 450;
  if (!state.keys.KeyD || !ready || state.player.bottles <= 0) return;
  state.lastThrowAt = now;
  state.player.bottles -= 1;
  state.projectiles.push(new Projectile(state.player));
  state.player.idleSince = performance.now();
}

/** Applies gravity and resolves floor collision for the player. */
function applyGravity(dt) {
  state.player.vy += 980 * dt;
  state.player.y += state.player.vy * dt;
  const floor = groundY() - state.player.h;
  if (state.player.y > floor) {
    state.player.y = floor;
    state.player.vy = 0;
  }
}

/** Keeps player within world horizontal boundaries. */
function clampPlayerX() {
  state.player.x = clamp(state.player.x, 0, WORLD_WIDTH - state.player.w);
}

/** Advances player animation frame based on movement state. */
function updatePlayerAnimation(dt) {
  const rate = state.player.vx === 0 ? 5 : 10;
  if (Math.abs(state.player.vy) > 40) state.player.frame += dt * 12;
  else state.player.frame += dt * rate;
}

/** Updates enemies and boss behavior for the current frame. */
function updateEnemies(dt) {
  const now = performance.now();
  updateBossAI(dt, now);
  state.enemies.forEach((enemy) => {
    if (!enemy.alive) {
      if (now > enemy.deadUntil) enemy.hidden = true;
      return;
    }
    enemy.x -= enemy.speed * dt;
    recycleEnemyIfOffscreen(enemy);
    enemy.frame += dt * 8;
  });
}

/** Repositions enemies that moved far behind the camera view. */
function recycleEnemyIfOffscreen(enemy) {
  if (enemy.x + enemy.w >= state.cameraX - 220) return;
  const minX = state.cameraX + canvas.width + 220;
  const maxX = Math.min(WORLD_WIDTH - enemy.w, minX + 900);
  enemy.x = randomBetween(minX, maxX);
}

/** Routes boss behavior between dead, waiting, and active states. */
function updateBossAI(dt, now) {
  if (state.boss.deadFinished) return;
  if (state.boss.hp <= 0) {
    handleBossDead(dt, now);
    return;
  }
  if (!state.boss.activated) {
    handleBossWait(dt);
    return;
  }
  moveBoss(dt, now);
}

/** Plays boss death animation and finishes the game when done. */
function handleBossDead(dt, now) {
  state.boss.mode = "dead";
  state.boss.frame += dt * 6;
  if (!state.boss.deadAt) state.boss.deadAt = now;
  if (state.boss.frame >= ANIM.bossDead.length - 0.1) {
    state.boss.deadFinished = true;
    endGame(true);
  }
}

/** Keeps boss at spawn until player reaches activation range. */
function handleBossWait(dt) {
  state.boss.x = state.boss.spawnX;
  state.boss.mode = "walk";
  state.boss.frame += dt * 4;
  if (state.player.x >= state.boss.spawnX - 520) state.boss.activated = true;
}

/** Selects boss movement mode based on distance and hurt state. */
function moveBoss(dt, now) {
  const dist = Math.abs(state.player.x - state.boss.x);
  if (now < state.boss.hurtUntil) {
    state.boss.mode = "hurt";
    state.boss.frame += dt * 8;
    return;
  }
  if (dist < 180) {
    chargeBoss(dt);
    return;
  }
  walkBoss(dt);
}

/** Moves boss quickly toward player during attack range. */
function chargeBoss(dt) {
  state.boss.mode = "attack";
  state.boss.frame += dt * 10;
  if (state.boss.x < state.player.x) state.boss.x += 165 * dt;
  else state.boss.x -= 165 * dt;
}

/** Moves boss toward player in normal walking mode. */
function walkBoss(dt) {
  state.boss.mode = "walk";
  state.boss.frame += dt * 6;
  if (state.boss.x < state.player.x) state.boss.x += 120 * dt;
  else state.boss.x -= 120 * dt;
}

/** Updates projectile movement, gravity, and lifecycle. */
function updateProjectiles(dt) {
  state.projectiles.forEach((bottle) => {
    if (!bottle.alive) return;
    if (bottle.splash) {
      updateSplash(bottle, dt);
      return;
    }
    bottle.x += bottle.vx * dt;
    bottle.y += bottle.vy * dt;
    bottle.vy += 980 * dt;
    bottle.frame += dt * 12;
    if (bottle.y + bottle.h >= groundY()) startSplash(bottle);
    if (bottle.x < -80 || bottle.x > WORLD_WIDTH + 80) bottle.alive = false;
  });
  state.projectiles = state.projectiles.filter((b) => b.alive);
}

/** Advances splash animation and removes finished splash bottles. */
function updateSplash(bottle, dt) {
  bottle.splashFrame += dt * 12;
  if (bottle.splashFrame >= ANIM.bottleSplash.length - 0.1)
    bottle.alive = false;
}

/** Switches a flying bottle into splash state on impact. */
function startSplash(bottle) {
  bottle.splash = true;
  bottle.vx = 0;
  bottle.vy = 0;
  bottle.y = groundY() - bottle.h;
  bottle.splashFrame = 0;
}

/** Handles player pickup collection for coins and bottles. */
function collectItems() {
  const pp = hitbox(state.player, "player");
  state.coins.forEach((coin) => {
    if (coin.taken || !isHit(pp, hitbox(coin, "coin"))) return;
    coin.taken = true;
    state.player.coins += 1;
  });
  state.bottles.forEach((bottle) => {
    if (bottle.taken || !isHit(pp, hitbox(bottle, "pickup"))) return;
    bottle.taken = true;
    state.player.bottles = Math.min(MAX_BOTTLES, state.player.bottles + 1);
  });
}

/** Resolves all collision systems for current frame. */
function checkCollisions(now) {
  state.enemies.forEach((enemy) => collideEnemy(enemy, now));
  collideBoss(now);
  collideProjectiles();
  if (state.player.hp <= 0) endGame(false);
  if (state.boss.hp <= 0 && state.boss.deadFinished) endGame(true);
}

/** Resolves player collision with one regular enemy. */
function collideEnemy(enemy, now) {
  if (!enemy.alive || enemy.hidden) return;
  if (!isHit(hitbox(state.player, "player"), hitbox(enemy, "enemy"))) return;
  if (isStompHit(state.player, enemy)) {
    killEnemy(enemy, now);
    state.player.vy = -310;
    return;
  }
  hurtPlayer(now, 8);
}

/** Resolves player collision interactions with the boss. */
function collideBoss(now) {
  if (state.boss.hp <= 0) return;
  if (!isHit(hitbox(state.player, "player"), hitbox(state.boss, "boss")))
    return;
  if (isStompHit(state.player, state.boss)) {
    state.boss.hp = Math.max(0, state.boss.hp - 8);
    state.boss.hurtUntil = now + 420;
    state.boss.frame = 0;
    state.player.vy = -330;
    return;
  }
  hurtPlayer(now, state.boss.mode === "attack" ? 18 : 12);
}

/** Resolves projectile hits against enemies and boss. */
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

/** Marks an enemy as dead and schedules hide timing. */
function killEnemy(enemy, now) {
  enemy.alive = false;
  enemy.hidden = false;
  enemy.deadUntil = now + 700;
  state.player.bottles = Math.min(MAX_BOTTLES, state.player.bottles + 3);
}

/** Applies damage to player with temporary hurt cooldown. */
function hurtPlayer(now, damage) {
  if (now < state.player.hurtUntil) return;
  state.player.hurtUntil = now + 700;
  state.player.hp = Math.max(0, state.player.hp - damage);
}

/** Returns true when player stomped an enemy from above. */
function isStompHit(player, enemy) {
  return player.vy > 70 && player.y + player.h - 8 < enemy.y + 24;
}

/** Centers camera around player while clamping world bounds. */
function updateCamera() {
  const target = state.player.x - canvas.width * 0.35;
  state.cameraX = clamp(target, 0, WORLD_WIDTH - canvas.width);
}

/** Builds a tuned collision hitbox for an entity type. */
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

/** Creates a rectangle object used for collision checks. */
function box(x, y, w, h) {
  return { x, y, w, h };
}

/** Performs axis-aligned rectangle overlap test. */
function isHit(a, b) {
  return (
    a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
  );
}

document.addEventListener("DOMContentLoaded", () => {
  bindCanvas();
  bindMenu();
  bindKeyboard();
  bindTouch();
  loadMuteSetting();
  setupOrientationCheck();
  preloadImages();
  showHomeScreen();
});
