class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;

    applyGravity() {
            setInterval(() => {
                if (this.isAboveGround() || this.speedY > 0 ) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
                }
            }, 1000 / 25);
        }

    isAboveGround() {
       return this.y < 230;
    }

    isColliding(moveObject) {
        return this.x + this.width > moveObject.x &&
               this.y + this.height > moveObject.y &&
               this.x < moveObject.x + moveObject.width &&
               this.y < moveObject.y + moveObject.height;
    }

    hit() {
         this.energy -= 5;
         if (this.energy < 0) {
             this.energy = 0;
         } else {
             this.lastHit = new Date().getTime();
         }
    }

    isDead() {
        return this.energy == 0;
    }

    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        timePassed = timePassed / 1000;
        return timePassed < 1;
    }

    playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
    }

    moveRight() {

        this.x += this.speed;  
        this.otherDirection = false;
    }

    moveLeft() {
        this.x -= this.speed; 
        this.otherDirection = true; 
    }

    jump() {
        this.speedY = 30;
    }

}