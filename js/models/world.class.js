class World {
 player = new caracter();
 level = level1;
canvas;
ctx;
keyboard;
cammera_x = 0;
statusBar = new StatusBar();
throwableObjects = [];
constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setworld();
    this.run();
}

  run() {
      setInterval(() => {


        this.checkCollisions();
        this.checkThrowObjects();
      }, 200);
  }

  checkThrowObjects() {
    if (this.keyboard.D) {
      let bottle = new ThrowableObject(this.player.x + 100, this.player.y + 100);
      this.throwableObjects.push(bottle);
    }
  }

  checkCollisions() {
          this.level.enemies.forEach((enemy) => {
      if (this.player.isColliding(enemy)) {   
          this.player.hit();
          this.statusBar.setPercentage(this.player.energy);
          }
       });
    }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.save();
    this.ctx.translate(this.cammera_x, 0);
    this.addObjectsToMap(this.level.backroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);
    this.addToMap(this.player);
    this.ctx.restore();

    this.addToMap(this.statusBar);

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