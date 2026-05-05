class Player {
  constructor(floor) {
    this.x = 80;
    this.y = floor - 140;
    this.w = 88;
    this.h = 140;
    this.vx = 0;
    this.vy = 0;
    this.dir = 1;
    this.hp = 100;
    this.coins = 0;
    this.bottles = 0;
    this.frame = 0;
    this.hurtUntil = 0;
    this.idleSince = performance.now();
  }
}

class Enemy {
  constructor(type, x, floor) {
    const small = type === "small";
    this.type = type;
    this.x = x;
    this.w = small ? 66 : 82;
    this.h = small ? 66 : 82;
    this.y = floor - this.h;
    this.frame = 0;
    this.alive = true;
    this.hidden = false;
    this.dir = -1;
    this.speed = small ? 90 : 65;
    this.deadUntil = 0;
  }
}

class Boss {
  constructor(floor) {
    this.x = WORLD_WIDTH - 260;
    this.spawnX = WORLD_WIDTH - 260;
    this.y = floor - 170;
    this.w = 150;
    this.h = 170;
    this.hp = 100;
    this.frame = 0;
    this.mode = "walk";
    this.activated = false;
    this.hurtUntil = 0;
    this.attackUntil = 0;
    this.deadAt = 0;
    this.deadFinished = false;
  }
}

class Coin {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 38;
    this.h = 38;
    this.taken = false;
    this.frame = Math.random() > 0.5 ? 1 : 0;
  }
}

class GroundBottle {
  constructor(x, floor) {
    this.x = x;
    this.y = floor - 64;
    this.w = 48;
    this.h = 64;
    this.taken = false;
    this.frame = Math.random() > 0.5 ? 1 : 0;
  }
}

class Projectile {
  constructor(player) {
    const dir = player.dir;
    this.x = player.x + (dir === 1 ? player.w - 10 : -10);
    this.y = player.y + 46;
    this.w = 38;
    this.h = 38;
    this.vx = dir * 380;
    this.vy = -190;
    this.frame = 0;
    this.alive = true;
    this.splash = false;
    this.splashFrame = 0;
  }
}
