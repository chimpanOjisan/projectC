// Portrait interface layout HTML generator
window.LOAD_INTERFACE = function(container) {
  container.innerHTML = `
    <!-- Virtual Game Boy Console (Portrait Mode) -->
    <div class="console-body portrait" id="consoleBody">
      <!-- Screen Area -->
      <div class="screen-border">
        <div class="screen-indicator">
          <span class="power-led" id="powerLed"></span>
          <span class="power-label">POWER</span>
        </div>
        <div class="screen" id="gameScreen">
          <!-- Game screen content injected here -->
        </div>
      </div>
      
      <!-- Console Branding -->
      <div class="brand-text">POCKET CHIMPANZEE</div>
      
      <!-- D-Pad -->
      <div class="dpad-container">
        <div class="dpad">
          <div class="dpad-btn up" id="btnUp"></div>
          <div class="dpad-btn right" id="btnRight"></div>
          <div class="dpad-btn down" id="btnDown"></div>
          <div class="dpad-btn left" id="btnLeft"></div>
          <div class="dpad-center"></div>
        </div>
      </div>
      
      <!-- Action Buttons A & B -->
      <div class="action-buttons">
        <div class="action-btn-wrapper">
          <div class="action-btn b-btn" id="btnB">B</div>
        </div>
        <div class="action-btn-wrapper">
          <div class="action-btn a-btn" id="btnA">A</div>
        </div>
      </div>
      
      <!-- Menu Buttons Select & Start -->
      <div class="menu-buttons">
        <div class="menu-btn-wrapper">
          <div class="menu-btn select-btn" id="btnSelect"></div>
          <div class="menu-label">SELECT</div>
        </div>
        <div class="menu-btn-wrapper">
          <div class="menu-btn start-btn" id="btnStart"></div>
          <div class="menu-label">START</div>
        </div>
      </div>
      
      <!-- Speaker Grille -->
      <div class="speaker-grille">
        <span class="grille-bar"></span>
        <span class="grille-bar"></span>
        <span class="grille-bar"></span>
        <span class="grille-bar"></span>
        <span class="grille-bar"></span>
        <span class="grille-bar"></span>
      </div>
    </div>
  `;
};
