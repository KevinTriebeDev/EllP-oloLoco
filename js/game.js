let canvas;
let ctx;
world = new world();

function init() {
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");
    console.log("Game initialized", world.player);
}

