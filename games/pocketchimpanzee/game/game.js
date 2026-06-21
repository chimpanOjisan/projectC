// Game Logic and Screen Render Controller
window.Game = {
  audioCtx: null,
  isPoweredOn: false,
  isBooted: false,
  screenState: 'boot', // 'boot' | 'logo' | 'warning' | 'title' | 'success'
  counterValue: 0,
  currentMonsterNo: 1,
  monsterTimer: null,

  LOAD_GAME_HTML(screenContainer) {
    screenContainer.innerHTML = `
      <!-- Boot Overlay / Interaction Trigger -->
      <div class="boot-overlay" id="bootOverlay">
        <div class="boot-text">CLICK SCREEN<br>TO POWER ON</div>
      </div>
      
      <!-- Game Screen Contents -->
      <div class="screen-content hide" id="screenContent">
        
        <!-- 1. Opening Sequence Overlay -->
        <div class="opening-sequence" id="openingSequence">
          <!-- Logo Phase -->
          <div class="opening-logo" id="openingLogo">
            <h1 class="logo-main-text">pocketChimpanZee</h1>
          </div>
          <!-- Warning Phase -->
          <div class="opening-warning hide" id="openingWarning">
            <div class="warning-title">WARNING</div>
            <div class="warning-body">
              This is a PoC game.<br><br>
              Data is saved in<br>
              your browser.<br><br>
              Enjoy the demo!
            </div>
          </div>
        </div>

        <!-- 2. Game Boy Style Title Screen -->
        <div class="title-screen hide" id="titleScreen">
          <!-- Title Header -->
          <div class="title-header">
            <div class="title-top">pocketChimpanZee</div>
            <div class="title-sub"><span class="oj-label">OJ</span></div>
          </div>
          
          <!-- Intro Center Area (Trainer Sprite + Sliding Monsters) -->
          <div class="title-arena">
            <!-- Trainer Sprite -->
            <img src="game/chimp_trainer.png" class="trainer-sprite" id="trainerSprite">
            <!-- Sliding Monster Placeholder -->
            <div class="sliding-monster-container">
              <div class="sliding-monster" id="slidingMonster">NO. 001</div>
            </div>
          </div>
          
          <!-- Bottom Prompt -->
          <div class="title-footer">
            <div class="press-start-text">PRESS START</div>
            <div class="trademark-text">© 2026 CHIMPANZEE</div>
          </div>
        </div>

        <!-- 3. Success Screen (Verification Screen) -->
        <div class="success-screen hide" id="successScreen">
          <h2 class="success-title">PoC SUCCESS!</h2>
          <p class="success-msg">Opening Flow Completed.</p>
          <div class="counter-display" id="counterDisplay">0</div>
          <button class="screen-btn" id="clickBtn">TAP TO COUNT</button>
          <div class="instructions-text">Press SELECT to reset</div>
        </div>
      </div>
    `;
  },

  playBootSound() {
    try {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      const now = this.audioCtx.currentTime;

      // 1st note: Low pitch, very short
      const osc1 = this.audioCtx.createOscillator();
      const gain1 = this.audioCtx.createGain();
      osc1.type = 'square';
      osc1.frequency.setValueAtTime(375, now);
      gain1.gain.setValueAtTime(0.08, now);
      gain1.gain.setValueAtTime(0.08, now + 0.08);
      gain1.gain.linearRampToValueAtTime(0.001, now + 0.1);
      osc1.connect(gain1);
      gain1.connect(this.audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.1);

      // 2nd note: High pitch, longer
      const osc2 = this.audioCtx.createOscillator();
      const gain2 = this.audioCtx.createGain();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(750, now + 0.1);
      gain2.gain.setValueAtTime(0, now);
      gain2.gain.setValueAtTime(0.08, now + 0.1);
      gain2.gain.linearRampToValueAtTime(0.08, now + 0.6);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      osc2.connect(gain2);
      gain2.connect(this.audioCtx.destination);
      osc2.start(now + 0.1);
      osc2.stop(now + 0.8);
    } catch (e) {
      console.error("Audio error:", e);
    }
  },

  playBeep(freq, duration, type = 'sine') {
    try {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      gainNode.gain.setValueAtTime(0.05, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      console.error(e);
    }
  },

  powerOn() {
    if (this.isPoweredOn) return;
    this.isPoweredOn = true;
    this.screenState = 'logo';

    // Power Indicator LED
    const powerLed = document.getElementById('powerLed');
    if (powerLed) powerLed.classList.add('on');

    // Hide boot overlay and reveal screen content
    document.getElementById('bootOverlay').classList.add('hide');
    document.getElementById('screenContent').classList.remove('hide');

    // Play retro boot sound
    this.playBootSound();

    // 1. Logo displays for 4 seconds, then transition to Warning
    setTimeout(() => {
      if (this.screenState === 'logo') {
        this.showWarningScreen();
      }
    }, 4000);
  },

  showWarningScreen() {
    this.screenState = 'warning';
    
    // Hide Logo, Show Warning
    document.getElementById('openingLogo').classList.add('hide');
    document.getElementById('openingWarning').classList.remove('hide');

    // 2. Warning displays for 5 seconds, then transition to Title Screen
    setTimeout(() => {
      if (this.screenState === 'warning') {
        this.showTitleScreen();
      }
    }, 5000);
  },

  showTitleScreen() {
    this.screenState = 'title';
    this.isBooted = true;

    // Hide Opening Sequence entirely, Show Title Screen
    document.getElementById('openingSequence').classList.add('hide');
    document.getElementById('titleScreen').classList.remove('hide');

    // Start cycling monster numbers in background when off-screen
    const monsterEl = document.getElementById('slidingMonster');
    if (monsterEl) {
      monsterEl.addEventListener('animationiteration', () => {
        this.currentMonsterNo = (this.currentMonsterNo % 9) + 1; // loop through NO. 001 - 009
        monsterEl.textContent = `NO. 00${this.currentMonsterNo}`;
        
        // Play a very short low tone when a new monster slides in (retro vibe)
        this.playBeep(180, 0.05, 'triangle');
      });
    }
  },

  startPoC() {
    if (this.screenState !== 'title') return;
    this.screenState = 'success';

    this.playBeep(600, 0.15, 'triangle');
    setTimeout(() => this.playBeep(900, 0.2, 'sine'), 80);

    document.getElementById('titleScreen').classList.add('hide');
    document.getElementById('successScreen').classList.remove('hide');
  },

  incrementCounter() {
    if (this.screenState !== 'success') return;
    this.counterValue++;
    document.getElementById('counterDisplay').textContent = this.counterValue;
    this.playBeep(880, 0.08, 'square');
  },

  decrementCounter() {
    if (this.screenState !== 'success') return;
    this.counterValue--;
    document.getElementById('counterDisplay').textContent = this.counterValue;
    this.playBeep(520, 0.08, 'square');
  },

  resetCounter() {
    if (this.screenState !== 'success') return;
    this.counterValue = 0;
    document.getElementById('counterDisplay').textContent = this.counterValue;
    this.playBeep(440, 0.12, 'sawtooth');
  },

  playDpadSound(freq) {
    if (this.isPoweredOn && this.isBooted) {
      this.playBeep(freq, 0.05, 'triangle');
    }
  },

  // Abstract input event handler
  onPress(button) {
    if (!this.isPoweredOn) {
      if (button === 'Start' || button === 'A' || button === 'Select') {
        this.powerOn();
      }
      return;
    }

    // Skip opening animations on Start / A button press
    if (this.screenState === 'logo') {
      if (button === 'Start' || button === 'A') {
        this.showWarningScreen();
      }
      return;
    }
    if (this.screenState === 'warning') {
      if (button === 'Start' || button === 'A') {
        this.showTitleScreen();
      }
      return;
    }

    switch (button) {
      case 'Start':
        if (this.screenState === 'title') {
          this.startPoC();
        }
        break;
      case 'Select':
        if (this.screenState === 'success') {
          this.resetCounter();
        }
        break;
      case 'A':
        if (this.screenState === 'success') {
          this.incrementCounter();
        } else if (this.screenState === 'title') {
          this.startPoC();
        }
        break;
      case 'B':
        if (this.screenState === 'success') {
          this.decrementCounter();
        }
        break;
      case 'Up':
        this.playDpadSound(300);
        break;
      case 'Right':
        this.playDpadSound(330);
        break;
      case 'Down':
        this.playDpadSound(270);
        break;
      case 'Left':
        this.playDpadSound(310);
        break;
    }
  }
};
