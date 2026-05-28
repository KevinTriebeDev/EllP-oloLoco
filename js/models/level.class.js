class Level {
    enemies;
    clouds;
    coins;
    backroundObjects;
    level_end_x = 720*3;

    constructor(enemies, clouds, coins, backroundObjects) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.coins = coins;
        this.backroundObjects = backroundObjects;
    };

}