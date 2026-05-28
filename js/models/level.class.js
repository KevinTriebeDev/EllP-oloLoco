class Level {
    enemies;
    clouds;
    coins;
    bottles;
    backroundObjects;
    level_end_x = 720*3;

    constructor(enemies, clouds, coins, bottles, backroundObjects) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.coins = coins;
        this.bottles = bottles;
        this.backroundObjects = backroundObjects;
    };

}