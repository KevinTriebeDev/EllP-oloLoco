function bindMenu() {
  byId("startButton").addEventListener("click", startGame);
  byId("optionsButton").addEventListener("click", openOptions);
  byId("closeModalButton").addEventListener("click", closeOptions);
  byId("modalBackdrop").addEventListener("click", closeOptions);
  byId("restartButton").addEventListener("click", startGame);
  byId("homeButton").addEventListener("click", showHomeScreen);
}

function showHomeScreen() {
  state.scene = "home";
  cancelAnimationFrame(rafId);
  byId("menuButtons").classList.remove("hidden");
  byId("endScreen").classList.add("hidden");
  byId("touchControls").classList.add("hidden");
  drawHome();
}

function showTouchControls() {
  if (window.innerWidth <= 900)
    byId("touchControls").classList.remove("hidden");
}

function openOptions() {
  byId("optionsModal").classList.remove("hidden");
}

function closeOptions() {
  byId("optionsModal").classList.add("hidden");
}

function endGame(won) {
  state.scene = "end";
  cancelAnimationFrame(rafId);
  byId("touchControls").classList.add("hidden");
  byId("endTitle").textContent = won ? "Gewonnen!" : "Verloren!";
  byId("endScreen").style.backgroundImage =
    `url("${won ? SCREENS.won : SCREENS.lost}")`;
  byId("endScreen").style.backgroundColor = "transparent";
  byId("endScreen").classList.remove("hidden");
}
