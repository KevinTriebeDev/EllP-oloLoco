let canvas;
let ctx;
let caracter = new Image();

function init() {
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");
    caracter.src = "../assets/img/2_character_pepe/1_idle/idle/I-1.png";

    ctx.drawImage(caracter, 50, 50);
}

