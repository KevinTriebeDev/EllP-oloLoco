function drawFrame() {
  drawBackgroundLayers();
  drawWorldItems();
  drawEnemies();
  drawBoss();
  drawPlayer();
  drawProjectiles();
  drawStatusBars();
}

function drawBackgroundLayers() {
  drawLayerSet([BG.air], 0);
  drawAlternatingLayer(BG.cloud1, BG.cloud2, 0.2);
  drawAlternatingLayer(BG.third1, BG.third2, 0.45);
  drawAlternatingLayer(BG.second1, BG.second2, 0.65);
  drawAlternatingLayer(BG.first1, BG.first2, 1);
}

function drawAlternatingLayer(path1, path2, factor) {
  const imgs = [getImage(path1), getImage(path2)].filter(
    (i) => i.complete && i.naturalWidth,
  );
  if (!imgs.length) return;
  const tileW = calcTileW(imgs[0]);
  const parallaxX = state.cameraX * factor;
  const start = Math.floor(parallaxX / tileW) - 1;
  const end = Math.ceil((parallaxX + canvas.width) / tileW) + 1;
  for (let t = start; t <= end; t++) {
    const img = imgs[((t % imgs.length) + imgs.length) % imgs.length];
    ctx.drawImage(
      img,
      Math.round(t * tileW - parallaxX),
      0,
      tileW,
      canvas.height,
    );
  }
}

function drawLayerSet(paths, factor) {
  const imgs = paths.map(getImage).filter((i) => i.complete && i.naturalWidth);
  if (!imgs.length) return;
  const tileW = calcTileW(imgs[0]);
  const parallaxX = state.cameraX * factor;
  const start = Math.floor(parallaxX / tileW) - 1;
  const end = Math.ceil((parallaxX + canvas.width) / tileW) + 1;
  for (let t = start; t <= end; t++) {
    const img = imgs[((t % imgs.length) + imgs.length) % imgs.length];
    ctx.drawImage(
      img,
      Math.round(t * tileW - parallaxX),
      0,
      tileW,
      canvas.height,
    );
  }
}

function calcTileW(img) {
  return Math.round(img.naturalWidth * (canvas.height / img.naturalHeight));
}

function drawWorldItems() {
  state.coins.forEach(drawCoin);
  state.bottles.forEach(drawGroundBottle);
}

function drawCoin(coin) {
  if (coin.taken) return;
  coin.frame += 0.15;
  const path =
    coin.frame % 2 > 1
      ? "assets/img/8_coin/coin_2.png"
      : "assets/img/8_coin/coin_1.png";
  const img = getImage(path);
  if (!img.complete) return;
  ctx.drawImage(img, coin.x - state.cameraX, coin.y, coin.w, coin.h);
}

function drawGroundBottle(bottle) {
  if (bottle.taken) return;
  const path =
    bottle.frame > 0.5
      ? "assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png"
      : "assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png";
  const img = getImage(path);
  if (!img.complete) return;
  ctx.drawImage(img, bottle.x - state.cameraX, bottle.y, bottle.w, bottle.h);
}

function drawEnemies() {
  state.enemies.forEach((enemy) => {
    if (enemy.hidden) return;
    const dead = !enemy.alive;
    const frames = dead
      ? enemy.type === "small"
        ? ANIM.chickDead
        : ANIM.chickenDead
      : enemy.type === "small"
        ? ANIM.chickWalk
        : ANIM.chickenWalk;
    drawSprite(frames, enemy.frame, enemy, false);
  });
}

function drawBoss() {
  const frames = getBossFrames();
  const faceLeft = state.boss.x < state.player.x;
  drawSprite(frames, state.boss.frame, state.boss, faceLeft);
}

function getBossFrames() {
  if (state.boss.mode === "dead") return ANIM.bossDead;
  if (state.boss.mode === "hurt") return ANIM.bossHurt;
  if (state.boss.mode === "attack") return ANIM.bossAttack;
  return ANIM.bossWalk;
}

function drawPlayer() {
  const frames = getPlayerFrames();
  drawSprite(frames, state.player.frame, state.player, state.player.dir < 0);
}

function getPlayerFrames() {
  const now = performance.now();
  if (now < state.player.hurtUntil) return ANIM.pepeHurt;
  if (Math.abs(state.player.vy) > 40) return ANIM.pepeJump;
  if (Math.abs(state.player.vx) > 5) return ANIM.pepeWalk;
  if (now - state.player.idleSince >= 3000) return ANIM.pepeSleep;
  return ANIM.pepeIdle;
}

function drawProjectiles() {
  state.projectiles.forEach((bottle) => {
    const x = bottle.x - state.cameraX;
    if (bottle.splash) {
      drawFrameAt(
        ANIM.bottleSplash,
        bottle.splashFrame,
        x,
        bottle.y,
        bottle.w,
        bottle.h,
      );
      return;
    }
    drawFrameAt(ANIM.bottleRot, bottle.frame, x, bottle.y, bottle.w, bottle.h);
  });
}

function drawSprite(paths, frame, entity, flipX) {
  const x = entity.x - state.cameraX;
  const idx = Math.floor(frame) % paths.length;
  const img = getImage(paths[idx]);
  if (!img.complete) return;
  if (!flipX) {
    ctx.drawImage(img, x, entity.y, entity.w, entity.h);
    return;
  }
  ctx.save();
  ctx.scale(-1, 1);
  ctx.drawImage(img, -x - entity.w, entity.y, entity.w, entity.h);
  ctx.restore();
}

function drawFrameAt(paths, frame, x, y, w, h) {
  const img = getImage(paths[Math.floor(frame) % paths.length]);
  if (img.complete) ctx.drawImage(img, x, y, w, h);
}

function drawStatusBars() {
  drawStatusBar("health", state.player.hp, 16, 14);
  drawStatusBar("coin", playerCoinsPercent(), 16, 48);
  drawStatusBar("bottle", (state.player.bottles / MAX_BOTTLES) * 100, 16, 82);
  if (state.boss.activated) drawBossStatusBar();
}

function drawStatusBar(kind, value, x, y) {
  const step = nearestBarValue(value);
  const img = getImage(STATUS_PATHS[kind](step));
  if (img.complete) ctx.drawImage(img, x, y, 170, 38);
}

function drawBossStatusBar() {
  const step = nearestBarValue(state.boss.hp);
  const img = getImage(STATUS_PATHS.boss(step));
  if (img.complete) ctx.drawImage(img, canvas.width - 196, 14, 170, 38);
}

function nearestBarValue(value) {
  return clamp(Math.round(clamp(value, 0, 100) / 20) * 20, 0, 100);
}

function playerCoinsPercent() {
  return (state.player.coins / (state.coins.length || 1)) * 100;
}

function drawScreenImage(path) {
  const img = getImage(path);
  if (!img.complete) {
    if (path === SCREENS.start && !img.homeRedrawBound) {
      img.homeRedrawBound = true;
      img.addEventListener("load", () => {
        if (state.scene === "home") drawHome();
      });
    }
    drawLayerSet([BG.air], 0);
    drawOverlayText("El Pollo Loco", 58);
    drawOverlayText("Druecke Start", 98);
    return;
  }
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}

function drawHome() {
  drawScreenImage(SCREENS.start);
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
