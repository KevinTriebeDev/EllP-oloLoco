class Level {
    enemies;
    clouds;
    backroundObjects;
    level_end_x = 720*3;

    constructor(enemies, clouds, backroundObjects) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backroundObjects = backroundObjects;
    };

}