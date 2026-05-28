function generateRandomChickens() {
    let count = 5 + Math.floor(Math.random() * 10);
    let enemies = [];
    let nextX = 900;

    for (let i = 0; i < count; i++) {
        if (Math.random() < 0.5) {
            enemies.push(new chicken(nextX));
        } else {
            enemies.push(new chickenSmall(nextX));
        }

        nextX += 250 + Math.floor(Math.random() * 200);
    }

    return enemies;
}

function generateCoins() {
    return [
        new Coin(450, 320),
        new Coin(650, 280),
        new Coin(850, 320),
        new Coin(1050, 260),
        new Coin(1250, 320),
        new Coin(1450, 280),
        new Coin(1650, 320),
        new Coin(1850, 260),
        new Coin(2000, 320),
        new Coin(2120, 280),
    ];
}

function generateBottles() {
    return [
        new Bottle(500, 340),
        new Bottle(760, 340),
        new Bottle(980, 340),
        new Bottle(1210, 340),
        new Bottle(1460, 340),
        new Bottle(1710, 340),
        new Bottle(1940, 340),
        new Bottle(2120, 340),
    ];
}

const level1 = new Level(
    [
    ...generateRandomChickens(),
    new Endboss(),
],
[
    new Cloud(),
],
[
    ...generateCoins(),
],
[
    ...generateBottles(),
],
[
    new BackroundObject("assets/img/5_background/layers/air.png", -720),
    new BackroundObject("assets/img/5_background/layers/3_third_layer/2.png", -720),
    new BackroundObject("assets/img/5_background/layers/2_second_layer/2.png", -720),
    new BackroundObject("assets/img/5_background/layers/1_first_layer/2.png", -720),
    new BackroundObject("assets/img/5_background/layers/air.png", 0),
    new BackroundObject("assets/img/5_background/layers/3_third_layer/1.png", 0),
    new BackroundObject("assets/img/5_background/layers/2_second_layer/1.png", 0),
    new BackroundObject("assets/img/5_background/layers/1_first_layer/1.png", 0),
    new BackroundObject("assets/img/5_background/layers/air.png", 720),
    new BackroundObject("assets/img/5_background/layers/3_third_layer/2.png", 720),
    new BackroundObject("assets/img/5_background/layers/2_second_layer/2.png", 720),
    new BackroundObject("assets/img/5_background/layers/1_first_layer/2.png", 720),
    new BackroundObject("assets/img/5_background/layers/air.png", 720*2),
    new BackroundObject("assets/img/5_background/layers/3_third_layer/1.png", 720*2),
    new BackroundObject("assets/img/5_background/layers/2_second_layer/1.png", 720*2),
    new BackroundObject("assets/img/5_background/layers/1_first_layer/1.png", 720*2),
    new BackroundObject("assets/img/5_background/layers/air.png", 720*3),
    new BackroundObject("assets/img/5_background/layers/3_third_layer/2.png", 720*3),
    new BackroundObject("assets/img/5_background/layers/2_second_layer/2.png", 720*3),
    new BackroundObject("assets/img/5_background/layers/1_first_layer/2.png", 720*3),
]
);