class caracter extends MovableObject {
    width = 100;
    height = 200;
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
            if (this.world.keyboard.RIGHT) {
                
            
        let i = this.currentImage % this.IMAGES_WALKING.length;
        let path = this.IMAGES_WALKING[i];
        this.img = this.imageCache[path];
        this.currentImage++;
        }       
    }, 100);

    }
    jump() {

    }
}

