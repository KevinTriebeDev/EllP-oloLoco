class World {
 player = new caracter();
 enemies = [
    new chicken(),
    new chicken(),
    new chicken(),
]; 
canvas;
ctx;
constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.draw();
}
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.player.img, this.player.x, this.player.y, this.player.width, this.player.height);
        this.enemies.forEach((enemy) => {
            this.ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
        });
        let self = this;
        requestAnimationFrame(function() {
            self.draw();
        });
    }
}