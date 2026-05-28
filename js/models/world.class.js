class World {
 player = new caracter();
 level = level1;
canvas;
ctx;
keyboard;
cammera_x = 0;
statusBar = new StatusBar();
coinStatusBar = new CoinStatusBar();
bottleStatusBar = new BottleStatusBar();
throwableObjects = [];
bottleCount = 0;
coinCount = 0;
maxCoins = 0;
maxBottles = 0;
constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
  this.maxCoins = this.level.coins.length;
  this.maxBottles = this.level.bottles.length;
    this.draw();
    this.setworld();
    this.run();
}

  run() {
      setInterval(() => {


        this.checkCollisions();
        this.checkCoinCollisions();
        this.checkBottleCollisions();
        this.checkThrowObjects();
      }, 200);
  }

  checkThrowObjects() {
    if (this.keyboard.D && this.bottleCount > 0) {
      let bottle = new ThrowableObject(this.player.x + 100, this.player.y + 100);
      this.throwableObjects.push(bottle);
      this.bottleCount--;
      this.updateBottleStatusBar();
    }
  }

  checkCoinCollisions() {
    this.level.coins = this.level.coins.filter((coin) => {
      if (this.player.isColliding(coin)) {
        this.coinCount++;
        this.updateCoinStatusBar();
        return false;
      }
      return true;
    });
  }

  checkBottleCollisions() {
    this.level.bottles = this.level.bottles.filter((bottle) => {
      if (this.player.isColliding(bottle)) {
        this.bottleCount++;
        this.updateBottleStatusBar();
        return false;
      }
      return true;
    });
  }

  updateCoinStatusBar() {
    if (this.maxCoins > 0) {
      this.coinStatusBar.setPercentage((this.coinCount / this.maxCoins) * 100);
    }
  }

  updateBottleStatusBar() {
    if (this.maxBottles > 0) {
      this.bottleStatusBar.setPercentage((this.bottleCount / this.maxBottles) * 100);
    }
  }

  checkCollisions() {
      this.level.enemies.forEach((enemy) => {
        if (this.player.isColliding(enemy)) {
          if (this.isChickenEnemy(enemy) && !enemy.isDeadEnemy && this.isPlayerStompingEnemy(enemy)) {
            enemy.kill();
            setTimeout(() => {
              this.level.enemies = this.level.enemies.filter((e) => e !== enemy);
              }, 700);
          } else if (!enemy.isDeadEnemy) {
            this.player.hit();
            this.statusBar.setPercentage(this.player.energy);
          }
        }
      });
    }

    isChickenEnemy(enemy) {
      return enemy instanceof chicken || enemy instanceof chickenSmall;
    }

    isPlayerStompingEnemy(enemy) {
      return this.player.speedY < 0 && this.player.y + this.player.height <= enemy.y + 40;
    }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.save();
    this.ctx.translate(this.cammera_x, 0);
    this.addObjectsToMap(this.level.backroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);
    this.addToMap(this.player);
    this.ctx.restore();

    this.addToMap(this.statusBar);
    this.addToMap(this.coinStatusBar);
    this.addToMap(this.bottleStatusBar);

    requestAnimationFrame(() => this.draw());
  }

  addObjectsToMap(objects) {
    objects.forEach(o => this.addToMap(o));
  }

  addToMap(moveObject) {
    if (moveObject.otherDirection) {
      this.flipImage(moveObject);
    }
    moveObject.draw(this.ctx);
    moveObject.showFrame(this.ctx);
    
    if (moveObject.otherDirection) {
      this.flipImageBack(moveObject);
    }
  }

  flipImage(moveObject) {
      this.ctx.save();
      this.ctx.translate(moveObject.width, 0);
      this.ctx.scale(-1, 1);
      moveObject.x = moveObject.x * -1;
  }

  flipImageBack(moveObject) {
      moveObject.x = moveObject.x * -1;
      this.ctx.restore();
  }

  setworld() {
    this.player.world = this;
  }
}