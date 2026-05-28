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
        new Coin(750, 320),
        new Coin(1100, 280),
        new Coin(1450, 320),
        new Coin(1800, 260),
        new Coin(2150, 320),
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