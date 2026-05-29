class Endboss extends MovableObject {
IMAGES_WALKING = [
    "assets/img/4_enemie_boss_chicken/1_walk/G1.png",
    "assets/img/4_enemie_boss_chicken/1_walk/G2.png",
    "assets/img/4_enemie_boss_chicken/1_walk/G3.png",
    "assets/img/4_enemie_boss_chicken/1_walk/G4.png",
];

IMAGES_ALERT = [
    "assets/img/4_enemie_boss_chicken/2_alert/G5.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G6.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G7.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G8.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G9.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G10.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G11.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G12.png",

];

IMAGES_ATTACK = [
    "assets/img/4_enemie_boss_chicken/3_attack/G13.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G14.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G15.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G16.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G17.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G18.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G19.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G20.png",
];

IMAGES_HURT = [
    "assets/img/4_enemie_boss_chicken/4_hurt/G21.png",
    "assets/img/4_enemie_boss_chicken/4_hurt/G22.png",
    "assets/img/4_enemie_boss_chicken/4_hurt/G23.png",
];

IMAGES_DEAD = [
    "assets/img/4_enemie_boss_chicken/5_dead/G24.png",
    "assets/img/4_enemie_boss_chicken/5_dead/G25.png",
    "assets/img/4_enemie_boss_chicken/5_dead/G26.png",

];
currentImage = 0;
deadImageIndex = 0;
state = "alert";
isDeadEnemy = false;
isAttacking = false;
hurtUntil = 0;
constructor() {
    super();
    this.loadImg("assets/img/4_enemie_boss_chicken/2_alert/G5.png");
    this.x = 2200;
    this.y = 190;
    this.width = 250;
    this.height = 250;
    this.speed = 20;
    this.energy = 100;
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.animate();

}

animate() {
    setInterval(() => {
        if (this.state == "dead") {
            if (this.deadImageIndex < this.IMAGES_DEAD.length) {
                let path = this.IMAGES_DEAD[this.deadImageIndex];
                this.img = this.imageCache[path];
                this.deadImageIndex++;
            } else {
                let lastPath = this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1];
                this.img = this.imageCache[lastPath];
            }
        } else if (this.state == "hurt") {
            if (new Date().getTime() < this.hurtUntil) {
                this.playAnimation(this.IMAGES_HURT);
            } else {
                this.state = "alert";
                this.playAnimation(this.IMAGES_ALERT);
            }
        } else if (this.state == "attack") {
            this.playAnimation(this.IMAGES_ATTACK);
        } else if (this.state == "walk") {
            this.playAnimation(this.IMAGES_WALKING);
        } else {
            this.playAnimation(this.IMAGES_ALERT);
        }
        }, 200);
}

moveToward(player) {
    if (this.isDeadEnemy) {
        return;
    }

    this.state = "walk";
    this.isAttacking = false;
    if (player.x < this.x) {
        this.x -= this.speed;
        this.otherDirection = false;
    } else {
        this.x += this.speed;
        this.otherDirection = true;
    }
}

startAttack() {
    if (this.isDeadEnemy) {
        return;
    }

    this.state = "attack";
    this.isAttacking = true;
}

setAlert() {
    if (this.isDeadEnemy) {
        return;
    }

    this.state = "alert";
    this.isAttacking = false;
}

takeDamage(amount) {
    if (this.isDeadEnemy) {
        return;
    }

    this.energy -= amount;
    if (this.energy <= 0) {
        this.energy = 0;
        this.isDeadEnemy = true;
        this.state = "dead";
        this.isAttacking = false;
    } else {
        this.state = "hurt";
        this.hurtUntil = new Date().getTime() + 600;
        this.isAttacking = false;
    }
}
}