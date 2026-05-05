let canvas;
let ctx;
let rafId = 0;
let lastTime = 0;

function bindCanvas() {
  canvas = byId("canvas");
  ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
}

function preloadImages() {
  ALL_IMAGE_PATHS.forEach((path) => getImage(path));
}

function startGame() {
  resetWorld();
  lastTime = 0;
  state.scene = "running";
  byId("menuButtons").classList.add("hidden");
  byId("endScreen").classList.add("hidden");
  showTouchControls();
  rafId = requestAnimationFrame(gameLoop);
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

function applyJump() {
  const onGround = state.player.y >= groundY() - state.player.h - 0.5;
  if (!state.keys.ArrowUp || !onGround) return;
  state.player.vy = -430;
  state.player.idleSince = performance.now();
}

function applyThrow(now) {
  const ready = now - state.lastThrowAt > 450;
  if (!state.keys.KeyD || !ready || state.player.bottles <= 0) return;
  state.lastThrowAt = now;
  state.player.bottles -= 1;
  state.projectiles.push(new Projectile(state.player));
  state.player.idleSince = performance.now();
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
  state.player.x = clamp(state.player.x, 0, WORLD_WIDTH - state.player.w);
}

function updatePlayerAnimation(dt) {
  const rate = state.player.vx === 0 ? 5 : 10;
  if (Math.abs(state.player.vy) > 40) state.player.frame += dt * 12;
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
    enemy.x -= enemy.speed * dt;
    recycleEnemyIfOffscreen(enemy);
    enemy.frame += dt * 8;
  });
}

function recycleEnemyIfOffscreen(enemy) {
  if (enemy.x + enemy.w >= state.cameraX - 220) return;
  const minX = state.cameraX + canvas.width + 220;
  const maxX = Math.min(WORLD_WIDTH - enemy.w, minX + 900);
  enemy.x = randomBetween(minX, maxX);
}

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

function handleBossDead(dt, now) {
  state.boss.mode = "dead";
  state.boss.frame += dt * 6;
  if (!state.boss.deadAt) state.boss.deadAt = now;
  if (state.boss.frame >= ANIM.bossDead.length - 0.1) {
    state.boss.deadFinished = true;
    endGame(true);
  }
}

function handleBossWait(dt) {
  state.boss.x = state.boss.spawnX;
  state.boss.mode = "walk";
  state.boss.frame += dt * 4;
  if (state.player.x >= state.boss.spawnX - 520) state.boss.activated = true;
}

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

function chargeBoss(dt) {
  state.boss.mode = "attack";
  state.boss.frame += dt * 10;
  if (state.boss.x < state.player.x) state.boss.x += 165 * dt;
  else state.boss.x -= 165 * dt;
}

function walkBoss(dt) {
  state.boss.mode = "walk";
  state.boss.frame += dt * 6;
  if (state.boss.x < state.player.x) state.boss.x += 120 * dt;
  else state.boss.x -= 120 * dt;
}

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

function updateSplash(bottle, dt) {
  bottle.splashFrame += dt * 12;
  if (bottle.splashFrame >= ANIM.bottleSplash.length - 0.1)
    bottle.alive = false;
}

function startSplash(bottle) {
  bottle.splash = true;
  bottle.vx = 0;
  bottle.vy = 0;
  bottle.y = groundY() - bottle.h;
  bottle.splashFrame = 0;
}

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

function checkCollisions(now) {
  state.enemies.forEach((enemy) => collideEnemy(enemy, now));
  collideBoss(now);
  collideProjectiles();
  if (state.player.hp <= 0) endGame(false);
  if (state.boss.hp <= 0 && state.boss.deadFinished) endGame(true);
}

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
  state.cameraX = clamp(target, 0, WORLD_WIDTH - canvas.width);
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
