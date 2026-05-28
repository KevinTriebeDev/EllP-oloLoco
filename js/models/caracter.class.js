class caracter extends MovableObject {
    width = 100;
    height = 180;
    speed = 10;
    IMAGES_WALKING = [
        "assets/img/2_character_pepe/2_walk/W-21.png",
        "assets/img/2_character_pepe/2_walk/W-22.png",
        "assets/img/2_character_pepe/2_walk/W-23.png",
        "assets/img/2_character_pepe/2_walk/W-24.png",
        "assets/img/2_character_pepe/2_walk/W-25.png",
        "assets/img/2_character_pepe/2_walk/W-26.png",
    ];

    IMAGES_JUMPING = [
        "assets/img/2_character_pepe/3_jump/J-31.png",
        "assets/img/2_character_pepe/3_jump/J-32.png",
        "assets/img/2_character_pepe/3_jump/J-33.png",
        "assets/img/2_character_pepe/3_jump/J-34.png",
        "assets/img/2_character_pepe/3_jump/J-35.png",
        "assets/img/2_character_pepe/3_jump/J-36.png",
        "assets/img/2_character_pepe/3_jump/J-37.png",
        "assets/img/2_character_pepe/3_jump/J-38.png",
        "assets/img/2_character_pepe/3_jump/J-39.png",
    ];

    IMAGES_DEAD = [
        "assets/img/2_character_pepe/5_dead/D-51.png",
        "assets/img/2_character_pepe/5_dead/D-52.png",
        "assets/img/2_character_pepe/5_dead/D-53.png",
        "assets/img/2_character_pepe/5_dead/D-54.png",
        "assets/img/2_character_pepe/5_dead/D-55.png",
        "assets/img/2_character_pepe/5_dead/D-56.png",
        "assets/img/2_character_pepe/5_dead/D-57.png",
    ];

    IMAGES_HURT = [
        "assets/img/2_character_pepe/4_hurt/H-41.png",
        "assets/img/2_character_pepe/4_hurt/H-42.png",
        "assets/img/2_character_pepe/4_hurt/H-43.png",
    ];

    world;
    deadImageIndex = 0;



        constructor() {
            super();
            this.loadImg("assets/img/2_character_pepe/2_walk/W-21.png");
            this.x = 120;
            this.y = 30;
            this.loadImages(this.IMAGES_WALKING);
            this.loadImages(this.IMAGES_JUMPING);
            this.loadImages(this.IMAGES_DEAD);
            this.loadImages(this.IMAGES_HURT);
            this.applyGravity();
            this.animate();
    }

    animate() {

        setInterval(() => {
            if (this.isDead()) {
                this.world.cammera_x = -this.x + 100;
                return;
            }

            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
            }

             if (this.world.keyboard.LEFT && this.x > 0 ) {
                this.moveLeft();
            }

            if (this.world.keyboard.SPACE && !this.isAboveGround()) {
                this.jump();
            }

            this.world.cammera_x = -this.x + 100;
        }, 1000 / 60);

        setInterval(() => {
            if (this.isDead()) {
                if (this.deadImageIndex < this.IMAGES_DEAD.length) {
                    let path = this.IMAGES_DEAD[this.deadImageIndex];
                    this.img = this.imageCache[path];
                    this.deadImageIndex++;
                } else {
                    let lastPath = this.IMAGES_DEAD[this.IMAGES_DEAD.length - 2];
                    this.img = this.imageCache[lastPath];
                }
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING);
            }else {
                if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {     
                    this.playAnimation(this.IMAGES_WALKING);
                } 
            }    
        }, 50);

    }
}

