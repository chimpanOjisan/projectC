// Central App Loader & Input Bridge

// Configuration: Change this to 'portrait' to switch the visual casing!
const ACTIVE_INTERFACE = 'landscape'; 

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Resource Loading (to prevent CORS issues on file:// protocol)
  loadStylesheets();
  loadInterfaceScript();
});

// Load CSS files dynamically
function loadStylesheets() {
  // Load Game Screen styles
  const gameCss = document.createElement('link');
  gameCss.rel = 'stylesheet';
  gameCss.href = 'game/game.css';
  document.head.appendChild(gameCss);

  // Load Console Shell styles
  const consoleCss = document.createElement('link');
  consoleCss.rel = 'stylesheet';
  consoleCss.href = `interfaces/${ACTIVE_INTERFACE}/style.css`;
  document.head.appendChild(consoleCss);
}

// Load the layout javascript file for the chosen interface
function loadInterfaceScript() {
  const script = document.createElement('script');
  script.src = `interfaces/${ACTIVE_INTERFACE}/layout.js`;
  script.onload = () => {
    initializeEnvironment();
  };
  document.head.appendChild(script);
}

// Setup elements and bind events
function initializeEnvironment() {
  const appContainer = document.getElementById('appContainer');
  if (!appContainer) return;

  // 1. Render the virtual console shell HTML
  window.LOAD_INTERFACE(appContainer);

  // 2. Render the game screen contents HTML inside the screen bezel
  const gameScreen = document.getElementById('gameScreen');
  if (gameScreen && window.Game) {
    window.Game.LOAD_GAME_HTML(gameScreen);
  }

  // 3. Bind UI elements to the Game Controller
  bindInputEvents();
}

function bindInputEvents() {
  const game = window.Game;
  if (!game) return;

  // Boot click
  const bootOverlay = document.getElementById('bootOverlay');
  if (bootOverlay) {
    bootOverlay.addEventListener('click', () => game.powerOn());
  }

  // Action Buttons
  const btnA = document.getElementById('btnA');
  const btnB = document.getElementById('btnB');
  const btnStart = document.getElementById('btnStart');
  const btnSelect = document.getElementById('btnSelect');
  
  if (btnA) btnA.addEventListener('click', () => game.onPress('A'));
  if (btnB) btnB.addEventListener('click', () => game.onPress('B'));
  if (btnStart) btnStart.addEventListener('click', () => game.onPress('Start'));
  if (btnSelect) btnSelect.addEventListener('click', () => game.onPress('Select'));

  // On-screen counter button
  // Using event delegation since screen contents might update
  const gameScreen = document.getElementById('gameScreen');
  if (gameScreen) {
    gameScreen.addEventListener('click', (e) => {
      if (e.target && e.target.id === 'clickBtn') {
        e.stopPropagation();
        game.onPress('A');
      }
    });
  }

  // D-Pad Buttons
  const btnUp = document.getElementById('btnUp');
  const btnRight = document.getElementById('btnRight');
  const btnDown = document.getElementById('btnDown');
  const btnLeft = document.getElementById('btnLeft');

  if (btnUp) btnUp.addEventListener('click', () => game.onPress('Up'));
  if (btnRight) btnRight.addEventListener('click', () => game.onPress('Right'));
  if (btnDown) btnDown.addEventListener('click', () => game.onPress('Down'));
  if (btnLeft) btnLeft.addEventListener('click', () => game.onPress('Left'));

  // Keyboard Mapping
  document.addEventListener('keydown', (e) => {
    if (!game.isPoweredOn) {
      if (e.key === 'Enter' || e.key === ' ') {
        game.powerOn();
      }
      return;
    }

    switch(e.key) {
      case 'Enter': // START
        simulatePress(btnStart);
        game.onPress('Start');
        break;
      case 'Shift': // SELECT
      case 'Backspace':
        simulatePress(btnSelect);
        game.onPress('Select');
        break;
      case 'z':
      case 'Z':
      case ' ': // Space / Z = A Button
        simulatePress(btnA);
        game.onPress('A');
        break;
      case 'x':
      case 'X': // X = B Button
        simulatePress(btnB);
        game.onPress('B');
        break;
      case 'ArrowUp':
        simulatePress(btnUp);
        game.onPress('Up');
        break;
      case 'ArrowRight':
        simulatePress(btnRight);
        game.onPress('Right');
        break;
      case 'ArrowDown':
        simulatePress(btnDown);
        game.onPress('Down');
        break;
      case 'ArrowLeft':
        simulatePress(btnLeft);
        game.onPress('Left');
        break;
    }
  });
}

// Visual button push feedback for keyboard inputs
function simulatePress(element) {
  if (!element) return;
  
  const isRotated = element.classList.contains('menu-btn') || element.classList.contains('dpad-btn');
  const isAction = element.classList.contains('action-btn');
  
  if (isAction) {
    element.style.transform = 'rotate(28deg) translateY(2px)';
  } else if (isRotated) {
    element.style.transform = 'rotate(-28deg) translateY(2px)';
  } else {
    element.style.transform = 'scale(0.95)';
  }
  
  setTimeout(() => {
    element.style.transform = '';
  }, 100);
}
