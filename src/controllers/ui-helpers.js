/**
 * Shows or hides an element based on the specified selector and action.
 * @param {string} selector - The CSS selector of the element
 * @param {string} action - The action to perform ('show' or 'hide')
 */
function toggleElement(selector, action) {
  const element = document.querySelector(selector);
  if (!element) return;

  if (action === 'show') {
    element.classList.remove('d-none');
  } else if (action === 'hide') {
    element.classList.add('d-none');
  }
}

/**
 * Checks the device orientation and displays a warning when the device is in portrait mode.
 * This function is no longer needed as orientation is handled via CSS Media Queries.
 */
function handleDeviceOrientation() {}

/**
 * Toggles between muted and unmuted for all audio files.
 * Uses the AudioManager to change the mute status and updates the icon.
 */
function toggleAudio() {
  const isMuted = audioManager.toggleMute();
  updateAudioIcon(isMuted);
  console.log('Audio Toggle: Sound ist jetzt ' + (isMuted ? 'AUS' : 'AN'));
}

/**
 * Mutes all sounds by setting the muted property.
 * Uses a loop and try-catch for robust error handling.
 */
function muteAllSounds() {
  for (let i = 0; i < soundEffects.length; i++) {
    try {
      if (soundEffects[i]) {
        soundEffects[i].muted = true;
      }
    } catch (error) {
      console.log('Fehler beim Stummschalten eines Sounds:', error);
    }
  }

  if (world) {
    world.muted = true;
    world.audioActive = false;
  }
}

/**
 * Unmutes all sounds by resetting the muted property.
 * Uses a loop and try-catch for robust error handling.
 */
function unmuteAllSounds() {
  for (let i = 0; i < soundEffects.length; i++) {
    try {
      if (soundEffects[i]) {
        soundEffects[i].muted = false;
      }
    } catch (error) {
      console.log('Fehler beim Aktivieren eines Sounds:', error);
    }
  }

  if (world) {
    world.muted = false;
    world.audioActive = true;
  }
}

/**
 * Updates the sound icon based on the mute status.
 * Changes the image of the audio toggle button according to the mute status.
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
 * Toggles fullscreen mode on or off.
 * Adjusts the canvas and icon according to the new status.
 */
function toggleFullScreen() {
  let container = document.getElementById('gameContainer');
  let canvas = document.getElementById('gameCanvas');
  let icon = document.getElementById('fullscreenToggle');

  if (!fullscreenActive) {
    enterFullScreen(container);
    adjustForFullScreen(canvas, true);
    updateFullScreenIcon(icon, true);
    fullscreenActive = true;
  } else {
    exitFullScreen();
    adjustForFullScreen(canvas, false);
    updateFullScreenIcon(icon, false);
    fullscreenActive = false;
  }
}

/**
 * Activates fullscreen mode for an element with cross-browser support.
 * @param {HTMLElement} element - The element to be displayed in fullscreen mode
 */
function enterFullScreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
}

/**
 * Exits fullscreen mode with cross-browser support.
 */
function exitFullScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

/**
 * Adjusts the canvas for fullscreen mode by changing size and style attributes.
 * @param {HTMLElement} canvas - The canvas element
 * @param {boolean} isFullScreen - Indicates whether fullscreen mode is active
 */
function adjustForFullScreen(canvas, isFullScreen) {
  if (isFullScreen) {
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.classList.remove('br-16');
  } else {
    canvas.style.width = '';
    canvas.style.height = '';
    canvas.classList.add('br-16');
  }
}

/**
 * Updates the fullscreen mode icon according to the current status.
 * @param {HTMLElement} icon - The icon element
 * @param {boolean} isFullScreen - Indicates whether fullscreen mode is active
 */
function updateFullScreenIcon(icon, isFullScreen) {
  if (!icon) return;

  icon.src = isFullScreen
    ? './assets/images/12_game_ui/exit-fullscreen.png'
    : './assets/images/12_game_ui/full-screen.png';
}
