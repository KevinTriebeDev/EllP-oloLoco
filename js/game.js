let canvas;
let gameWorld;
let keyboard = new Keyboard();

function init() {
    canvas = document.getElementById("gameCanvas");
    let fullscreenButton = document.getElementById("fullscreenButton");
    let startButton = document.getElementById("startButton");
    let guideButton = document.getElementById("guideButton");
    let guideOverlay = document.getElementById("guideOverlay");
    let restartButton = document.getElementById("restartButton");
    let homeButton = document.getElementById("homeButton");
    if (startButton) {
        startButton.style.display = "block";
    }
    if (guideButton) {
        guideButton.style.display = "block";
    }
    if (guideOverlay) {
        guideOverlay.classList.remove("show");
    }
    if (restartButton) {
        restartButton.style.display = "none";
    }
    if (homeButton) {
        homeButton.style.display = "none";
    }
    document.addEventListener("fullscreenchange", () => {
        if (!fullscreenButton) {
            return;
        }
        if (document.fullscreenElement) {
            fullscreenButton.classList.add("is-fullscreen");
            fullscreenButton.title = "Verkleinern";
        } else {
            fullscreenButton.classList.remove("is-fullscreen");
            fullscreenButton.title = "Vollbild";
        }
    });
    gameWorld = new World(canvas, keyboard);
    window.world = gameWorld;
    

    console.log("Game initialized", gameWorld.player);
}

function restartGame() {
    window.location.reload();
}

function goHome() {
    window.location.href = "index.html";
}

function toggleFullscreen() {
    let wrapper = document.querySelector(".canvas-wrapper");
    if (!wrapper) {
        return;
    }

    if (!document.fullscreenElement) {
        wrapper.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

function startGame() {
    let startButton = document.getElementById("startButton");
    let guideButton = document.getElementById("guideButton");
    let guideOverlay = document.getElementById("guideOverlay");
    if (startButton) {
        startButton.style.display = "none";
    }
    if (guideButton) {
        guideButton.style.display = "none";
    }
    if (guideOverlay) {
        guideOverlay.classList.remove("show");
    }
    if (gameWorld) {
        gameWorld.gameStarted = true;
    }
}

function toggleGuide() {
    let guideOverlay = document.getElementById("guideOverlay");
    if (!guideOverlay) {
        return;
    }

    if (guideOverlay.classList.contains("show")) {
        guideOverlay.classList.remove("show");
    } else {
        guideOverlay.classList.add("show");
    }
}

function closeGuideOnOverlay(event) {
    let guideOverlay = document.getElementById("guideOverlay");
    if (guideOverlay && event.target === guideOverlay) {
        guideOverlay.classList.remove("show");
    }
}

window.addEventListener("keydown", (e) => {
    if (e.code == "ArrowRight") {
        keyboard.RIGHT = true;
    } 
    if (e.code == "ArrowLeft") {
        keyboard.LEFT = true;
    } 
    if (e.code == "ArrowUp") {
        keyboard.UP = true;
    } 
    if (e.code == "ArrowDown") {
        keyboard.DOWN = true;
    } 
    if (e.code == "Space") {
        keyboard.SPACE = true;
    }
    if (e.code == "KeyD") {
        keyboard.D = true;
    }
   
});

window.addEventListener("keyup", (e) => {
    if (e.code == "ArrowRight") {
        keyboard.RIGHT = false;
    } 
    if (e.code == "ArrowLeft") {
        keyboard.LEFT = false;
    } 
    if (e.code == "ArrowUp") {
        keyboard.UP = false;
    } 
    if (e.code == "ArrowDown") {
        keyboard.DOWN = false;
    } 
    if (e.code == "Space") {
        keyboard.SPACE = false;
    }
    if (e.code == "KeyD") {
        keyboard.D = false;
    }
    
});