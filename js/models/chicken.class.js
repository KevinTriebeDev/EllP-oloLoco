class chicken extends MovableObject {
    IMAGES_WALKING = [
        "assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
        "assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
        "assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
    ];
    currentImage = 0;
    constructor() {
        super();
        this.loadImg("assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
        this.x = 200 + Math.random() * 500;
        this.y = 370;
        this.width = 60;
        this.height = 60;
        this.speed = 0.25 + Math.random() * 0.5;
        this.loadImages(this.IMAGES_WALKING);
        this.animate();
    }

    animate() {
        this.moveLeft();
        setInterval(() => {
        let i = this.currentImage % this.IMAGES_WALKING.length;
        let path = this.IMAGES_WALKING[i];
        this.img = this.imageCache[path];
        this.currentImage++;

    }, 200);
 }
}