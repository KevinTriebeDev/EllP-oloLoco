class Bottle extends MovableObject {
    constructor(x, y) {
        super();
        this.loadImg("assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png");
        this.x = x;
        this.y = y;
        this.width = 70;
        this.height = 80;
    }
}
