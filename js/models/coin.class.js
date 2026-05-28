class Coin extends MovableObject {
    IMAGES = [
        "assets/img/8_coin/coin_1.png",
        "assets/img/8_coin/coin_2.png",
    ];

    currentImage = 0;

    constructor(x, y) {
        super();
        this.loadImg("assets/img/8_coin/coin_1.png");
        this.x = x;
        this.y = y;
        this.width = 120;
        this.height = 120;
        this.loadImages(this.IMAGES);
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES);
        }, 250);
    }
}