class MovableObject {
    x = 120;
    y = 280;
    img;
    height = 150;
    width = 100;
    imageCache = [];
    speed = 0.15;
    otherDirection = false;
    loadImg(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr) {
        arr.forEach((path) => {       
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
    });
    }

    playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
    }

    moveRight() {
        setInterval(() => {
          this.x += this.speed;  
        }, 1000 / 60); 
    }

    moveLeft() {
        setInterval(() => {
          this.x -= this.speed;  
        }, 1000 / 60); 
    }
}