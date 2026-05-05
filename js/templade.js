document.addEventListener("DOMContentLoaded", renderTemplate);

function renderTemplate() {
  document.body.innerHTML = `
    <header class="topbar">
      <a class="impressum-link" href="impressum.html">Impressum</a>
    </header>

    <main class="content">
      <div class="canvas-wrapper">
        <canvas id="canvas" width="720" height="480" style="display:block"></canvas>

        <div id="menuButtons" class="menu-buttons">
          <button id="startButton" class="menu-button">Start</button>
          <button id="optionsButton" class="menu-button">Tasten</button>
        </div>

        <div id="endScreen" class="end-screen hidden">
          <h2 id="endTitle">Game Over</h2>
          <div class="end-buttons">
            <button id="restartButton" class="menu-button">Neustart</button>
            <button id="homeButton" class="menu-button">Home</button>
          </div>
        </div>

        <div id="touchControls" class="touch-controls">
          <div class="touch-group touch-group--left">
            <button data-key="ArrowLeft" class="touch-button" aria-label="Links">&#x2B05;&#xFE0F;</button>
            <button data-key="ArrowRight" class="touch-button" aria-label="Rechts">&#x27A1;&#xFE0F;</button>
          </div>
          <div class="touch-group touch-group--right">
            <button data-key="ArrowUp" class="touch-button" aria-label="Sprung">&#x2B06;&#xFE0F;</button>
            <button data-key="KeyD" class="touch-button touch-button--bottle" aria-label="Flasche werfen">&#x1F376;</button>
          </div>
        </div>
      </div>
    </main>

    <div id="optionsModal" class="modal hidden">
      <div class="modal-backdrop" id="modalBackdrop"></div>
      <div class="modal-card">
        <button id="closeModalButton" class="close-modal">x</button>
        <h3>Steuerung</h3>
        <p>Laufen: Pfeil links / rechts</p>
        <p>Springen: Pfeil hoch</p>
        <p>Wurf: Taste D</p>
      </div>
    </div>

    <div id="orientationOverlay" class="orientation-overlay hidden">
      <p>Handy Drehen zum Spielen.</p>
    </div>
  `;
}
