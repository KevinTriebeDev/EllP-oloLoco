class World {
 player = new caracter();
 level = level1;
canvas;
ctx;
keyboard;
cammera_x = 0;
constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setworld();
}
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.translate(this.cammera_x, 0);
    
    this.addObjectsToMap(this.level.backroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addToMap(this.player);
    
  this.ctx.translate(-this.cammera_x, 0);
    requestAnimationFrame(() => this.draw());
  }

  addObjectsToMap(objects) {
    objects.forEach(o => this.addToMap(o));
  }

  addToMap(moveObject) {
    if (moveObject.otherDirection) {
      this.ctx.save();
      this.ctx.translate(moveObject.width, 0);
      this.ctx.scale(-1, 1);
      moveObject.x = moveObject.x * -1;
    }
    this.ctx.drawImage(moveObject.img, moveObject.x, moveObject.y, moveObject.width, moveObject.height);
    if (moveObject.otherDirection) {
      moveObject.x = moveObject.x * -1;
      this.ctx.restore();
    }
  }

  setworld() {
    this.player.world = this;
  }
}