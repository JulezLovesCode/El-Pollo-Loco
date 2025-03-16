/**
 * Global variables for the game.
 */
let canvas;
let world;
let inputManager = new InputManager();
let stopGame = false;
let fullscreenActive = false;
let shortIdleTimer;
let longIdleTimer;

let backgroundMusic = new Audio('assets/sounds/background music.mp3');
let soundEffects = [backgroundMusic];
let intervalIds = [];

/**
 * Initializes and displays the start screen of the game.
 * Loads the start image and sets up the basic functionalities.
 */
function initStartScreen() {
  let canvas = document.getElementById('gameCanvas');
  let ctx = canvas.getContext('2d');

  let img = new Image();
  img.src = './assets/images/9_intro_outro_screens/start/startscreen_2.png';

  img.onload = function () {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };

  audioManager.init();

  setupResponsiveLayout();
  setupMobileControls();
  resizeGameCanvas();
}

/**
 * Configures the responsive layout and device orientation detection.
 * Adds event listeners for size changes and orientation changes.
 */
function setupResponsiveLayout() {
  const isMobileOrTablet = window.innerWidth <= 1400;

  if (isMobileOrTablet) {
    window.addEventListener('resize', resizeGameCanvas);
    window.addEventListener('orientationchange', function () {
      setTimeout(resizeGameCanvas, 100);
    });
  }
}

/**
 * Starts the game and hides all menus.
 * Shows the game controls and initializes the game.
 */
function startGameAndHideMenus() {
  console.log('Starting game and hiding menus...');

  document.getElementById('mainMenu').classList.add('d-none');
  document.getElementById('gameOverMenu').classList.add('d-none');
  document.getElementById('instructionsContent').classList.add('d-none');
  document.getElementById('creditsContent').classList.add('d-none');

  document.querySelector('.gameControls').classList.remove('d-none');

  initGame();
}

/**
 * Initializes the main game.
 * Prepares the level, canvas, and all managers.
 */
function initGame() {
  console.log('Game starting...');
  initLevel();
  canvas = document.getElementById('gameCanvas');

  audioManager.init();

  initSoundSettings();

  world = new GameWorld(canvas);
  setupIdleDetection();
  playBackgroundMusic();
  setupMobileControls();
  setupDirectMobileControls();
  resizeGameCanvas();
}

/**
 * Shows the game over menu.
 * Hides the main menu and shows the game over menu.
 */
function showGameOverMenu() {
  document.getElementById('mainMenu').classList.add('d-none');
  document.getElementById('gameOverMenu').classList.remove('d-none');
}

/**
 * Restarts the game.
 * Resets all game settings and initializes a new game.
 */
function restartGame() {
  document.getElementById('gameOverMenu').classList.add('d-none');

  document.querySelector('.gameControls').classList.remove('d-none');

  soundEffects = [backgroundMusic];
  stopGame = false;
  world = null;

  initLevel();
  canvas = document.getElementById('gameCanvas');
  world = new GameWorld(canvas, inputManager);
  setupIdleDetection();
  playBackgroundMusic();
  setupMobileControls();
  setupDirectMobileControls();
  resizeGameCanvas();
  initSoundSettings();
}

/**
 * Returns to the main menu.
 * Hides all other screens and shows the main menu.
 */
function returnToMainMenu() {
  document.getElementById('gameOverMenu').classList.add('d-none');
  document.getElementById('instructionsContent').classList.add('d-none');
  document.getElementById('creditsContent').classList.add('d-none');

  document.querySelector('.gameControls').classList.add('d-none');

  document.getElementById('mainMenu').classList.remove('d-none');

  if (world) {
    world = null;
  }

  initStartScreen();

  stopGame = false;
  soundEffects = [backgroundMusic];
}

/**
 * Shows the credits screen.
 * Hides the main menu and shows the credits screen.
 */
function showCredits() {
  document.getElementById('mainMenu').classList.add('d-none');
  document.getElementById('creditsContent').classList.remove('d-none');
}

/**
 * Shows the controls/instructions screen.
 * Hides the main menu and shows the instructions screen.
 */
function showControls() {
  document.getElementById('mainMenu').classList.add('d-none');
  document.getElementById('instructionsContent').classList.remove('d-none');
}

/**
 * Plays the background music.
 * Uses the AudioManager to play the music.
 */
function playBackgroundMusic() {
  audioManager.playMusic();
}

/**
 * Initializes the sound settings.
 * Updates the audio icon based on the mute status.
 */
function initSoundSettings() {
  updateAudioIcon(audioManager.muted);
}

/**
 * Toggles between muted and unmuted for all audio files.
 * Updates the audio icon accordingly.
 */
function toggleAudio() {
  const isMuted = audioManager.toggleMute();
  updateAudioIcon(isMuted);
}

/**
 * Mutes all sounds.
 * Uses AudioManager.toggleMute if sound is not already muted.
 */
function muteAllSounds() {
  if (!audioManager.muted) {
    audioManager.toggleMute();
  }
}

/**
 * Unmutes all sounds.
 * Uses AudioManager.toggleMute if sound is already muted.
 */
function unmuteAllSounds() {
  if (audioManager.muted) {
    audioManager.toggleMute();
  }
}

/**
 * Sets the input manager to idle (short idle time).
 * Activates the idle state of the InputManager.
 */
function shortIdle() {
  inputManager.idle = true;
}

/**
 * Sets the input manager to longer idle.
 * Deactivates the normal idle state and activates longIdle.
 */
function longIdle() {
  inputManager.idle = false;
  inputManager.longIdle = true;
}

/**
 * Resets the idle timers.
 * Deactivates idle states, clears the timers, and restarts them.
 */
function resetTimer() {
  inputManager.idle = false;
  inputManager.longIdle = false;
  clearTimeout(shortIdleTimer);
  clearTimeout(longIdleTimer);
  startTimers();
}

/**
 * Starts the timers for short and long idle.
 * Sets timeouts for the different idle states.
 */
function startTimers() {
  shortIdleTimer = setTimeout(shortIdle, 3000);
  longIdleTimer = setTimeout(longIdle, 7000);
}

/**
 * Initializes the detection of idle times.
 * Adds event listeners for various user actions.
 */
function setupIdleDetection() {
  const events = ['mousemove', 'mousedown', 'click', 'keydown', 'touchstart'];
  events.forEach((event) => {
    window.addEventListener(event, resetTimer, true);
  });

  startTimers();
}

/**
 * Sets up the mobile control buttons.
 * Shows the touch controls only in landscape mode.
 */
function setupMobileControls() {
  const isMobileOrTablet = window.innerWidth <= 1400;
  updateControlsVisibility(isMobileOrTablet);
  setupOrientationChangeListener();
}

function updateControlsVisibility(isMobileOrTablet) {
  const isLandscape = window.matchMedia('(orientation: landscape)').matches;
  const mobileControls = document.getElementById('mobileControlsContainer');

  if (isMobileOrTablet && isLandscape) {
    mobileControls.classList.remove('d-none');
  } else {
    mobileControls.classList.add('d-none');
  }
}

function setupOrientationChangeListener() {
  window.addEventListener('orientationchange', function () {
    setTimeout(handleOrientationChange, 100);
  });
}

function handleOrientationChange() {
  const isLandscape = window.matchMedia('(orientation: landscape)').matches;
  const mobileControls = document.getElementById('mobileControlsContainer');
  const orientationWarning = document.getElementById(
    'deviceOrientationWarning'
  );

  updateElementsForOrientation(mobileControls, orientationWarning, isLandscape);
}

function updateElementsForOrientation(controls, warning, isLandscape) {
  if (isLandscape) {
    controls.classList.remove('d-none');
    warning.classList.add('d-none');
  } else {
    controls.classList.add('d-none');
    warning.classList.remove('d-none');
  }
}

/**
 * Adds direct event handlers for mobile controls.
 * Registers touch events for the control buttons.
 */
function setupDirectMobileControls() {
  setupButtonControls('mobileLeftButton', 'LEFT');
  setupButtonControls('mobileRightButton', 'RIGHT');
  setupButtonControls('mobileJumpButton', 'SPACE');
  setupButtonControls('mobileThrowButton', 'ACTION');
}

function setupButtonControls(buttonId, inputProperty) {
  const button = document.getElementById(buttonId);
  if (button) {
    setupTouchStartListener(button, inputProperty);
    setupTouchEndListener(button, inputProperty);
  }
}

function setupTouchStartListener(button, inputProperty) {
  button.addEventListener('touchstart', function (e) {
    e.preventDefault();
    inputManager[inputProperty] = true;
  });
}

function setupTouchEndListener(button, inputProperty) {
  button.addEventListener('touchend', function (e) {
    e.preventDefault();
    inputManager[inputProperty] = false;
  });
}

/**
 * Updates the sound icon based on the mute status.
 * @param {boolean} isMuted - Indicates whether the sound is muted
 */
function updateAudioIcon(isMuted) {
  const iconSrc = isMuted
    ? './assets/images/12_game_ui/mute.png'
    : './assets/images/12_game_ui/volume.png';

  const audioToggle = document.getElementById('audioToggle');
  if (audioToggle) {
    audioToggle.src = iconSrc;
  }
}

/**
 * Adjusts the canvas size to different screen sizes.
 * Considers different device types and screen ratios.
 */
function resizeGameCanvas() {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas) return;

  if (window.innerWidth <= 1400) {
    resizeForMobileDevices(canvas);
  } else {
    resizeForDesktop(canvas);
  }
}

function resizeForMobileDevices(canvas) {
  const gameRatio = 720 / 480;

  if (window.innerWidth <= 380) {
    resizeForSmallMobile(canvas, gameRatio);
  } else {
    resizeBasedOnAspectRatio(canvas, gameRatio);
  }
}

function resizeForSmallMobile(canvas, gameRatio) {
  const width = Math.min(window.innerWidth * 0.95, 720);
  const height = width / gameRatio;

  applyDimensions(canvas, width, height);
}

function resizeBasedOnAspectRatio(canvas, gameRatio) {
  if (window.innerWidth / window.innerHeight > gameRatio) {
    resizeForWiderScreen(canvas, gameRatio);
  } else {
    resizeForTallerScreen(canvas, gameRatio);
  }
}

function resizeForWiderScreen(canvas, gameRatio) {
  const height = Math.min(window.innerHeight * 0.8, 480);
  const width = height * gameRatio;

  applyDimensions(canvas, width, height);
}

function resizeForTallerScreen(canvas, gameRatio) {
  const width = Math.min(window.innerWidth * 0.8, 720);
  const height = width / gameRatio;

  applyDimensions(canvas, width, height);
}

function resizeForDesktop(canvas) {
  applyDimensions(canvas, 936, 624);
}

function applyDimensions(canvas, width, height) {
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
}

document.addEventListener(
  'click',
  function () {
    if (typeof audioManager !== 'undefined') {
      const testSuccess = audioManager.testSound();
      console.log(
        'Sound-Test beim Klick:',
        testSuccess ? 'Erfolgreich' : 'Fehlgeschlagen'
      );

      if (!audioManager.initialized) {
        audioManager.init();
      }

      audioManager.playMusic();
    }
  },
  { once: true }
);
