class World {
 player = new caracter();
 enemies = [
    new chicken(),
    new chicken(),
    new chicken(),
]; 
clouds = [
    new Cloud(),
];
backroundObjects = [
    new BackroundObject("assets/img/5_background/layers/air.png", 0),
    new BackroundObject("assets/img/5_background/layers/3_third_layer/1.png", 0),
    new BackroundObject("assets/img/5_background/layers/2_second_layer/1.png", 0),
    new BackroundObject("assets/img/5_background/layers/1_first_layer/1.png", 0),
];
canvas;
ctx;
keyboard;
constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setworld();
}
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    
    this.addObjectsToMap(this.backroundObjects);
    this.addObjectsToMap(this.clouds);
    this.addObjectsToMap(this.enemies);
    this.addToMap(this.player);
    requestAnimationFrame(() => this.draw());
  }

  addObjectsToMap(objects) {
    objects.forEach(o => this.addToMap(o));
  }

  addToMap(moveObject) {
    this.ctx.drawImage(moveObject.img, moveObject.x, moveObject.y, moveObject.width, moveObject.height);
  }

  setworld() {
    this.player.world = this;
  }
}