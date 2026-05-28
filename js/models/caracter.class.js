class caracter extends MovableObject {
    width = 100;
    height = 200;
    speed = 10;
    IMAGES_WALKING = [
                "assets/img/2_character_pepe/2_walk/W-21.png",
                "assets/img/2_character_pepe/2_walk/W-22.png",
                "assets/img/2_character_pepe/2_walk/W-23.png",
                "assets/img/2_character_pepe/2_walk/W-24.png",
                "assets/img/2_character_pepe/2_walk/W-25.png",
                "assets/img/2_character_pepe/2_walk/W-26.png",
            ];
    world;
    currentImage = 0;
        constructor() {
            super();
            this.loadImg("assets/img/2_character_pepe/2_walk/W-21.png");
            this.x = 120;
            this.y = 230;
            this.loadImages(this.IMAGES_WALKING);
            this.animate();
    }

    animate() {

        setInterval(() => {
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
              this.x += this.speed;  
              this.otherDirection = false;
            }

             if (this.world.keyboard.LEFT && this.x > 0 ) {
              this.x -= this.speed; 
              this.otherDirection = true; 
            }
            this.world.cammera_x = -this.x + 100;
        }, 1000 / 60);

        setInterval(() => {
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {     
            this.playAnimation(this.IMAGES_WALKING);
        }     
    }, 50);

    }
    jump() {

    }
}

