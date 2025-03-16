/**
 * Improved class for managing all game sounds with debugging features.
 * @class
 */
class AudioManager {
  /**
   * Creates a new AudioManager instance.
   * @constructor
   */
  constructor() {
    this.sounds = {};
    this.muted = false;
    this.initialized = false;
    this.soundPool = {};
    this.poolSize = 3;
    this.debug = true;
    this.lastPlayed = {};
  }

  /**
   * Initializes the AudioManager and loads all required sounds.
   * Also sets the volume and checks the mute status.
   */
  init() {
    if (this.initialized) return;

    try {
      this.initSoundEffects();
      this.configureVolume();
      this.initBackgroundMusic();
      this.applyAudioSettings();

      this.initialized = true;

      if (this.debug)
        console.log(
          'AudioManager: Successfully initialized, Sound is ' +
            (this.muted ? 'OFF' : 'ON')
        );
    } catch (e) {
      console.error('AudioManager Init Error:', e);
    }
  }
  /**
   * Initializes all sound effects by grouping them into categories.
   * Creates and organizes all the game's sound effects.
   */
  initSoundEffects() {
    this.sounds = {};
    this.initBasicSounds();
    this.initCollectibleSounds();
    this.initCharacterSounds();
    this.initGameResultSounds();
  }
  /**
   * Initializes basic movement and physics-related sounds like jumping and walking.
   * These sounds are triggered by common player actions.
   */
  initBasicSounds() {
    this.sounds.jump = new Audio('assets/sounds/jump voice.mp3');
    this.sounds.landing = new Audio(
      'assets/sounds/landing on gravel(Jump).mp3'
    );
    this.sounds.footsteps = new Audio('assets/sounds/walking on gravel.mp3');
  }
  /**
   * Initializes sounds related to collectible items.
   * These sounds are triggered when the player collects or uses items.
   */
  initCollectibleSounds() {
    this.sounds.coin = new Audio('assets/sounds/collect coin.mp3');
    this.sounds.bottle = new Audio('assets/sounds/collect bottle.mp3');
    this.sounds.throw = new Audio('assets/sounds/shattering bottle.mp3');
  }
  /**
   * Initializes sounds related to character interactions.
   * These include enemy death sounds and player damage sounds.
   */
  initCharacterSounds() {
    this.sounds.chicken = new Audio('assets/sounds/chicken dead.mp3');
    this.sounds.chick = new Audio('assets/sounds/chick dead.mp3');
    this.sounds.hurt = new Audio('assets/sounds/oww sound.mp3');
    this.sounds.death = new Audio('assets/sounds/huge ow sound.mp3');
  }
  /**
   * Initializes sounds that play when the game ends.
   * These include victory, defeat, and idle sounds.
   */
  initGameResultSounds() {
    this.sounds.win = new Audio('assets/sounds/win sound.mp3');
    this.sounds.lose = new Audio('assets/sounds/lose sound.mp3');
    this.sounds.snoring = new Audio('assets/sounds/snoring sound.mp3');
  }
  /**
   * Sets the default volume for all sound effects.
   * Applies a consistent volume level across all loaded sounds.
   */
  configureVolume() {
    Object.values(this.sounds).forEach((sound) => {
      sound.volume = 0.5;
    });
  }
  /**
   * Initializes the background music with appropriate settings.
   * Sets up looping and volume for the background music track.
   */
  initBackgroundMusic() {
    this.bgMusic = new Audio('assets/sounds/background music.mp3');
    this.bgMusic.loop = true;
    this.bgMusic.volume = 0.1;
  }
  /**
   * Applies saved audio settings and updates the UI accordingly.
   * Restores the mute status from localStorage and updates the audio icon.
   */
  applyAudioSettings() {
    this.loadMuteStatus();

    this.updateAudioIconOnLoad();
  }

  /**
   * Updates the audio icon when loading the mute status
   */
  updateAudioIconOnLoad() {
    const audioToggle = document.getElementById('audioToggle');
    if (audioToggle) {
      audioToggle.src = this.muted
        ? './assets/images/12_game_ui/mute.png'
        : './assets/images/12_game_ui/volume.png';
    }
  }

  /**
   * Plays a sound with improved error handling.
   * @param {string} id - The ID of the sound to be played
   * @param {number} volume - The volume of the sound (0.0 to 1.0)
   */
  play(id, volume = 0.5) {
    try {
      if (this.checkPreconditions(id)) return;

      this.lastPlayed[id] = Date.now();
      this.sounds[id].volume = volume;
      this.playSound(id);
    } catch (e) {
      if (this.debug) console.error(`AudioManager: Error playing '${id}':`, e);
    }
  }
  /**
   * Checks all preconditions before playing a sound.
   * Verifies initialization, mute status, sound existence, and cooldown.
   *
   * @param {string} id - The ID of the sound to check
   * @returns {boolean} - True if any precondition fails (should not play sound), false otherwise
   */
  checkPreconditions(id) {
    return (
      this.checkInitialization() ||
      this.checkMuteStatus() ||
      this.checkSoundExists(id) ||
      this.checkCooldown(id)
    );
  }
  /**
   * Checks if the AudioManager is initialized.
   *
   * @returns {boolean} - True if not initialized, false otherwise
   */
  checkInitialization() {
    if (!this.initialized) {
      if (this.debug)
        console.log('AudioManager: Not initialized, sound will not be played');
      return true;
    }
    return false;
  }
  /**
   * Checks if audio is currently muted.
   *
   * @returns {boolean} - True if muted, false otherwise
   */
  checkMuteStatus() {
    if (this.muted) {
      if (this.debug)
        console.log(`AudioManager: Muted, sound will not be played`);
      return true;
    }
    return false;
  }
  /**
   * Checks if the requested sound exists in the sounds collection.
   *
   * @param {string} id - The ID of the sound to check
   * @returns {boolean} - True if sound doesn't exist, false otherwise
   */
  checkSoundExists(id) {
    if (!this.sounds[id]) {
      if (this.debug) console.log(`AudioManager: Sound '${id}' not found`);
      return true;
    }
    return false;
  }
  /**
   * Checks if the sound is currently on cooldown to prevent rapid repeated playback.
   *
   * @param {string} id - The ID of the sound to check
   * @returns {boolean} - True if sound is on cooldown, false otherwise
   */
  checkCooldown(id) {
    const now = Date.now();
    const lastPlayed = this.lastPlayed[id] || 0;
    const cooldown = 100;

    if (now - lastPlayed < cooldown) {
      if (this.debug)
        console.log(`AudioManager: Sound '${id}' cooldown active`);
      return true;
    }
    return false;
  }
  /**
   * Plays the specified sound and handles the play promise.
   *
   * @param {string} id - The ID of the sound to play
   */
  playSound(id) {
    const sound = this.sounds[id];
    sound.currentTime = 0;

    if (this.debug) console.log(`AudioManager: Playing sound '${id}'`);

    const playPromise = sound.play();
    this.handlePlayPromise(playPromise, id);
  }
  /**
   * Handles the promise returned by the play() method to catch any errors.
   *
   * @param {Promise} playPromise - The promise returned by the audio play() method
   * @param {string} id - The ID of the sound being played
   */
  handlePlayPromise(playPromise, id) {
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        if (this.debug)
          console.log(`AudioManager: Error playing '${id}':`, error);
      });
    }
  }

  /**
   * Starts the background music with error handling.
   */
  playMusic() {
    try {
      if (this.muted) return;

      this.bgMusic.currentTime = 0;
      const playPromise = this.bgMusic.play();

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          if (this.debug)
            console.log('AudioManager: Error playing background music:', error);
        });
      }

      if (this.debug) console.log('AudioManager: Background music started');
    } catch (e) {
      if (this.debug)
        console.error('AudioManager: Error playing background music:', e);
    }
  }

  /**
   * Executes a direct test sound to check audio compatibility.
   * @returns {boolean} - true if the test was successful, otherwise false
   */
  testSound() {
    try {
      const testSound = new Audio('assets/sounds/collect coin.mp3');
      testSound.volume = 1.0;
      testSound
        .play()
        .then(() => console.log('Test sound successful!'))
        .catch((e) => console.error('Test sound failed:', e));

      return true;
    } catch (e) {
      console.error('Test sound error:', e);
      return false;
    }
  }

  /**
   * Resets the mute status (overwrites localStorage).
   * @returns {boolean} - Returns the updated mute status (always false)
   */
  resetMuteStatus() {
    this.muted = false;

    this.bgMusic.muted = false;
    Object.values(this.sounds).forEach((sound) => {
      sound.muted = false;
    });

    localStorage.setItem('isMuted', 'false');

    const audioToggle = document.getElementById('audioToggle');
    if (audioToggle) {
      audioToggle.src = './assets/images/12_game_ui/volume.png';
    }

    if (this.debug) console.log('AudioManager: Mute status reset to false');

    return false;
  }

  /**
   * Toggles between muted and unmuted.
   * Also updates all audio elements and saves the status.
   * @returns {boolean} - The current mute status after toggling
   */
  toggleMute() {
    this.muted = !this.muted;

    this.bgMusic.muted = this.muted;

    Object.values(this.sounds).forEach((sound) => {
      sound.muted = this.muted;
    });

    localStorage.setItem('isMuted', this.muted.toString());

    if (this.debug)
      console.log('AudioManager: Mute status changed to', this.muted);

    return this.muted;
  }

  /**
   * Loads the saved mute status from localStorage
   * and applies it to all audio elements.
   */
  loadMuteStatus() {
    const savedStatus = localStorage.getItem('isMuted');
    if (savedStatus !== null) {
      this.muted = savedStatus === 'true';

      this.bgMusic.muted = this.muted;

      Object.values(this.sounds).forEach((sound) => {
        sound.muted = this.muted;
      });

      if (this.debug)
        console.log('AudioManager: Mute status loaded:', this.muted);
    }
  }
}

const audioManager = new AudioManager();
