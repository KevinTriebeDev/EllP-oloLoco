class Endboss extends MovableObject {
IMAGES_WALKING = [
    "assets/img/4_enemie_boss_chicken/2_alert/G5.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G6.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G7.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G8.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G9.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G10.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G11.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G12.png",

];
currentImage = 0;
constructor() {
    super();
    this.loadImg("assets/img/4_enemie_boss_chicken/2_alert/G5.png");
    this.x = 2200;
    this.y = 190;
    this.width = 250;
    this.height = 250;
    this.speed = 0.6;
    this.loadImages(this.IMAGES_WALKING);
    this.animate();

}

animate() {
            setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }
}