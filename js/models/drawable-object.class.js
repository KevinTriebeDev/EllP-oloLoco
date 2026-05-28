class DrawableObject {
    img;
    imageCache = [];
    currentImage = 0;
    x = 120;
    y = 280;
    height = 150;
    width = 100;

    loadImg(path) {
        this.img = new Image();
        this.img.src = path;
    }

    draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);

    }

    loadImages(arr) {
        arr.forEach((path) => {       
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }


    showFrame(ctx) {
        if (this instanceof caracter || this instanceof chicken || this instanceof Endboss) {
            ctx.beginPath();
            ctx.lineWidth = "5";
            ctx.strokeStyle = "blue";
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    }

}

