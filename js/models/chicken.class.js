class chicken extends MovableObject {
    constructor() {
        super();
        this.loadImg("assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
        this.x = 200 + Math.random() * 500;
        this.y = 370;
        this.width = 60;
        this.height = 60;
    }

}