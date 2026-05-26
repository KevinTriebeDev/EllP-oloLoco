let canvas;
let gameWorld;

function init() {
    canvas = document.getElementById("gameCanvas");
    gameWorld = new World(canvas);
    window.world = gameWorld;
    

    console.log("Game initialized", gameWorld.player);
}

