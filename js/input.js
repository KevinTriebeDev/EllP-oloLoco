/**
 * - Binds keyboard events to game key state.
 */
function bindKeyboard() {
  window.addEventListener("keydown", (e) => (state.keys[e.code] = true));
  window.addEventListener("keyup", (e) => (state.keys[e.code] = false));
}

/**
 * - Binds touch controls for all touch buttons.
 */
function bindTouch() {
  document.querySelectorAll(".touch-button").forEach(addTouchEvents);
}

/**
 * - Attaches mouse and touch events for one control button.
 */
function addTouchEvents(button) {
  const key = button.dataset.key;
  button.addEventListener("contextmenu", (e) => e.preventDefault());
  button.addEventListener("touchstart", (e) => setTouchKey(e, key, true), {
    passive: false,
  });
  button.addEventListener("touchend", (e) => setTouchKey(e, key, false), {
    passive: false,
  });
  button.addEventListener("mousedown", () => (state.keys[key] = true));
  button.addEventListener("mouseup", () => (state.keys[key] = false));
  button.addEventListener("mouseleave", () => (state.keys[key] = false));
}

/**
 * - Updates key state for touch start and touch end events.
 */
function setTouchKey(e, key, pressed) {
  e.preventDefault();
  state.keys[key] = pressed;
}

/**
 * - Watches orientation and size changes for overlay and canvas updates.
 */
function setupOrientationCheck() {
  const watcher = () => {
    setOrientationMessage();
    resizeCanvasToScreen();
  };
  watcher();
  window.addEventListener("resize", watcher);
  window.addEventListener("orientationchange", watcher);
}

/**
 * - Toggles rotate-device message in portrait mobile mode.
 */
function setOrientationMessage() {
  const mobile = window.innerWidth <= 1024;
  const portrait = window.innerHeight > window.innerWidth;
  byId("orientationOverlay").classList.toggle("hidden", !(mobile && portrait));
}

/**
 * - Resizes canvas based on mobile landscape/fullscreen rules.
 */
function resizeCanvasToScreen() {
  const isMobile = window.innerWidth <= 1024 || "ontouchstart" in window;
  const isLandscape = window.innerWidth > window.innerHeight;
  const [targetW, targetH] = calcCanvasSize(isMobile, isLandscape);
  if (canvas.width === targetW && canvas.height === targetH) return;
  canvas.width = targetW;
  canvas.height = targetH;
  if (ctx) ctx.imageSmoothingEnabled = true;
  redrawCurrentScene();
}

/**
 * - Calculates target canvas size for current viewport mode.
 */
function calcCanvasSize(isMobile, isLandscape) {
  if (!isMobile || !isLandscape) return [CANVAS_W, CANVAS_H];
  const w = window.innerWidth;
  const h = Math.max(window.innerHeight, 320);
  const aspect = CANVAS_W / CANVAS_H;
  if (w / h > aspect) return [Math.round(h * aspect), h];
  return [w, Math.round(w / aspect)];
}

/**
 * - Redraws visible scene after a resize operation.
 */
function redrawCurrentScene() {
  if (!state || !ctx) return;
  if (state.scene === "home") drawHome();
}

/**
 * - Loads persisted mute flag from local storage.
 */
function loadMuteSetting() {
  state.muted = localStorage.getItem("epl-muted") === "true";
}
