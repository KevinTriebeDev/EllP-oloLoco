class chicken extends MovableObject {
    IMAGES_WALKING = [
        "assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
        "assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
        "assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
    ];
    IMAGES_DEAD = [
        "assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png",
    ];
    currentImage = 0;
    isDeadEnemy = false;
    constructor(x) {
        super();
        this.loadImg("assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
        if (x !== undefined) {
            this.x = x;
        } else {
            this.x = 200 + Math.random() * 500;
        }
        this.y = 370;
        this.width = 60;
        this.height = 60;
        this.speed = 0.25 + Math.random() * 0.5;
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (!this.isDeadEnemy) {
                this.x -= this.speed;
            }
        }, 1000 / 60);
        
        setInterval(() => {
            if (!this.isDeadEnemy) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);       
    }

    kill() {
        this.isDeadEnemy = true;
        this.img = this.imageCache[this.IMAGES_DEAD[0]];
    }
 }

class chickenSmall extends MovableObject {
    IMAGES_WALKING = [
        "assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
        "assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
        "assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
    ];
    IMAGES_DEAD = [
        "assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png",
    ];
    currentImage = 0;
    isDeadEnemy = false;
    constructor(x) {
        super();
        this.loadImg("assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
        if (x !== undefined) {
            this.x = x;
        } else {
            this.x = 200 + Math.random() * 500;
        }
        this.y = 380;
        this.width = 50;
        this.height = 50;
        this.speed = 0.25 + Math.random() * 0.5;
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (!this.isDeadEnemy) {
                this.x -= this.speed;
            }
        }, 1000 / 60);
        
        setInterval(() => {
            if (!this.isDeadEnemy) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);       
    }

    kill() {
        this.isDeadEnemy = true;
        this.img = this.imageCache[this.IMAGES_DEAD[0]];
    }
 }
