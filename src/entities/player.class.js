/**
 * Player character with movement and animation logic.
 * @class
 * @extends GameEntity
 */
class Player extends GameEntity {
  /** @type {number} Y-position of the player */
  y = 210; // Angepasst für bessere Bodenposition
  /** @type {number} X-position of the player */
  x = 100;
  /** @type {number} Height of the player */
  height = 250;
  /** @type {number} Width of the player */
  width = 150;
  /** @type {number} Movement speed of the player */
  velocity = 6;
  /** @type {Object} Collision offsets for precise collision detection */
  offset = {
    top: 110,
    left: 35,
    right: 70,
    bottom: 120,
  };
  /** @type {boolean} Indicates whether the player is currently jumping */
  isJumping = false;

  /** @type {string[]} Images for the walking animation */
  FRAMES_WALKING = [
    './assets/images/2_character_pepe/2_walk/W-21.png',
    './assets/images/2_character_pepe/2_walk/W-22.png',
    './assets/images/2_character_pepe/2_walk/W-23.png',
    './assets/images/2_character_pepe/2_walk/W-24.png',
    './assets/images/2_character_pepe/2_walk/W-25.png',
    './assets/images/2_character_pepe/2_walk/W-26.png',
  ];

  /** @type {string[]} Images for the jumping animation */
  FRAMES_JUMPING = [
    './assets/images/2_character_pepe/3_jump/J-31.png',
    './assets/images/2_character_pepe/3_jump/J-32.png',
    './assets/images/2_character_pepe/3_jump/J-33.png',
    './assets/images/2_character_pepe/3_jump/J-34.png',
    './assets/images/2_character_pepe/3_jump/J-35.png',
    './assets/images/2_character_pepe/3_jump/J-36.png',
    './assets/images/2_character_pepe/3_jump/J-37.png',
    './assets/images/2_character_pepe/3_jump/J-38.png',
    './assets/images/2_character_pepe/3_jump/J-39.png',
  ];

  /** @type {string[]} Images for the death animation */
  FRAMES_DEAD = [
    './assets/images/2_character_pepe/5_dead/D-51.png',
    './assets/images/2_character_pepe/5_dead/D-52.png',
    './assets/images/2_character_pepe/5_dead/D-53.png',
    './assets/images/2_character_pepe/5_dead/D-54.png',
    './assets/images/2_character_pepe/5_dead/D-55.png',
    './assets/images/2_character_pepe/5_dead/D-56.png',
    './assets/images/2_character_pepe/5_dead/D-57.png',
  ];

  /** @type {string[]} Images for the damage animation */
  FRAMES_HURT = [
    './assets/images/2_character_pepe/4_hurt/H-41.png',
    './assets/images/2_character_pepe/4_hurt/H-42.png',
    './assets/images/2_character_pepe/4_hurt/H-43.png',
  ];

  /** @type {string[]} Images for the idle animation */
  FRAMES_IDLE = [
    './assets/images/2_character_pepe/1_idle/idle/I-1.png',
    './assets/images/2_character_pepe/1_idle/idle/I-2.png',
    './assets/images/2_character_pepe/1_idle/idle/I-3.png',
    './assets/images/2_character_pepe/1_idle/idle/I-4.png',
    './assets/images/2_character_pepe/1_idle/idle/I-5.png',
    './assets/images/2_character_pepe/1_idle/idle/I-6.png',
    './assets/images/2_character_pepe/1_idle/idle/I-7.png',
    './assets/images/2_character_pepe/1_idle/idle/I-8.png',
    './assets/images/2_character_pepe/1_idle/idle/I-9.png',
    './assets/images/2_character_pepe/1_idle/idle/I-10.png',
  ];

  /** @type {string[]} Default image for the player */
  FRAMES_DEFAULT = ['./assets/images/2_character_pepe/1_idle/idle/I-1.png'];

  /** @type {string[]} Images for the long idle animation (sleeping) */
  FRAMES_LONG_IDLE = [
    './assets/images/2_character_pepe/1_idle/long_idle/I-11.png',
    './assets/images/2_character_pepe/1_idle/long_idle/I-12.png',
    './assets/images/2_character_pepe/1_idle/long_idle/I-13.png',
    './assets/images/2_character_pepe/1_idle/long_idle/I-14.png',
    './assets/images/2_character_pepe/1_idle/long_idle/I-15.png',
    './assets/images/2_character_pepe/1_idle/long_idle/I-16.png',
    './assets/images/2_character_pepe/1_idle/long_idle/I-17.png',
    './assets/images/2_character_pepe/1_idle/long_idle/I-18.png',
    './assets/images/2_character_pepe/1_idle/long_idle/I-19.png',
    './assets/images/2_character_pepe/1_idle/long_idle/I-20.png',
  ];

  /** @type {Object} Sound effects of the player */
  audio = {
    footsteps: new Audio('assets/sounds/walking on gravel.mp3'),
    jumpVoice: new Audio('assets/sounds/jump voice.mp3'),
    landing: new Audio('assets/sounds/landing on gravel(Jump).mp3'),
    pain: new Audio('assets/sounds/oww sound.mp3'),
    deathCry: new Audio('assets/sounds/huge ow sound.mp3'),
    snoring: new Audio('assets/sounds/snoring sound.mp3'),
  };

  /** @type {number} Current image index for animations */
  currentImage = 0;
  /** @type {GameWorld} Reference to the game world */
  world;
  /** @type {boolean} Indicates whether the death sound has already been played */
  dyingSoundPlayed = false;

  /**
   * Creates a new player.
   */
  constructor() {
    super();
    this.loadImage('./assets/images/2_character_pepe/1_idle/idle/I-1.png');
    this.loadImages(this.FRAMES_DEFAULT);
    this.loadImages(this.FRAMES_WALKING);
    this.loadImages(this.FRAMES_JUMPING);
    this.loadImages(this.FRAMES_DEAD);
    this.loadImages(this.FRAMES_HURT);
    this.loadImages(this.FRAMES_IDLE);
    this.loadImages(this.FRAMES_LONG_IDLE);
    this.registerAudio(this.audio);
    this.applyPhysics();
    this.setupAnimation();
  }

  /**
   * Sets up the animation and movement intervals.
   */
  setupAnimation() {
    let movementInterval = setInterval(() => {
      this.handleMovement();
      this.updateWorldCamera();
    }, 1000 / 60);

    let animationInterval = setInterval(() => {
      this.handleAnimationState();
    }, 1000 / 12);

    intervalIds.push(movementInterval, animationInterval);
  }

  /**
   * Processes the player's movement inputs.
   */
  handleMovement() {
    if (this.isDefeated()) return;

    this.stopFootsteps();

    const movementInfo = this.calculateMovement();
    this.processMovement(movementInfo);

    this.handleJump();
  }
  /**
   * Stops the footsteps sound if it's currently playing.
   * Used when stopping movement or when jumping/falling.
   */
  stopFootsteps() {
    if (!this.audio['footsteps'].paused) {
      this.audio['footsteps'].pause();
    }
  }
  /**
   * Calculates whether the player can move left or right based on input and boundaries.
   * Checks input state and world boundaries to determine valid movement directions.
   *
   * @returns {Object} An object with boolean flags for movement possibilities
   */
  calculateMovement() {
    let inputs = this.world.inputManager;
    let leftBoundary = 100;
    let rightBoundary = this.world.level.level_end_x - 150;

    let canMoveRight = inputs.RIGHT && this.x < rightBoundary;
    let canMoveLeft = inputs.LEFT && this.x > leftBoundary;

    return { canMoveRight, canMoveLeft };
  }
  /**
   * Processes horizontal movement based on calculated movement possibilities.
   * Moves the player left or right, updates facing direction, and plays footstep sounds.
   *
   * @param {Object} movementInfo - Object containing canMoveRight and canMoveLeft flags
   */
  processMovement({ canMoveRight, canMoveLeft }) {
    if (canMoveRight || canMoveLeft) {
      this[canMoveRight ? 'moveRight' : 'moveLeft']();
      this.facing = !canMoveRight;
      audioManager.play('footsteps', 0.2);
    }
  }
  /**
   * Handles jump input and initiates jumping if conditions are met.
   * Player can only jump when grounded, not already jumping, and when the SPACE input is active.
   * Plays jump sound and schedules landing sound handling.
   */
  handleJump() {
    let inputs = this.world.inputManager;

    if (inputs.SPACE && this.isGrounded() && !this.isJumping) {
      this.isJumping = true;
      this.stopFootsteps();
      this.jump();
      audioManager.play('jump', 0.2);
      this.scheduleLandingSound();
    }
  }
  /**
   * Schedules the initial check for landing after jumping.
   * Calls checkForLanding after a delay to see if the player has landed.
   */
  scheduleLandingSound() {
    setTimeout(() => {
      this.checkForLanding();
    }, 800);
  }
  /**
   * Checks if the player has landed after jumping.
   * If player is on the ground, plays landing sound and resets jump state.
   * Otherwise, sets up continuous landing checks.
   */
  checkForLanding() {
    if (this.isGrounded()) {
      audioManager.play('landing', 0.2);
      this.isJumping = false;
    } else {
      this.setupLandingCheck();
    }
  }
  /**
   * Sets up a continuous check for landing when player is still in the air.
   * Creates an interval that checks if the player has landed and plays sound when they do.
   * Clears the interval once landing is detected.
   */
  setupLandingCheck() {
    let landingCheck = setInterval(() => {
      if (this.isGrounded()) {
        this.isJumping = false;
        clearInterval(landingCheck);
        audioManager.play('landing', 0.2);
      }
    }, 100);

    this.setupSafetyTimeout(landingCheck);
  }
  /**
   * Sets up a safety timeout to ensure the landing check doesn't run indefinitely.
   * Clears the landing check interval after a maximum time to prevent memory leaks.
   *
   * @param {number} landingCheck - The interval ID for the landing check
   */
  setupSafetyTimeout(landingCheck) {
    setTimeout(() => {
      clearInterval(landingCheck);
      this.isJumping = false;
    }, 3000);
  }

  /**
   * Processes the player's animation state.
   */
  handleAnimationState() {
    if (this.isDefeated()) {
      this.handleDeathState();
    } else if (this.isDamaged()) {
      this.updateAnimation(this.FRAMES_HURT);
      audioManager.play('hurt', 0.2);
    } else if (this.isInAir()) {
      this.updateAnimation(this.FRAMES_JUMPING);
    } else if (this.world.inputManager.idle) {
      this.updateAnimation(this.FRAMES_IDLE);
    } else if (this.world.inputManager.longIdle) {
      this.updateAnimation(this.FRAMES_LONG_IDLE);
      audioManager.play('snoring', 0.2);
    } else if (this.world.inputManager.RIGHT || this.world.inputManager.LEFT) {
      this.updateAnimation(this.FRAMES_WALKING);
      this.audio['snoring'].pause();
    } else {
      this.updateAnimation(this.FRAMES_DEFAULT);
    }
  }

  /**
   * Handles the death state of the player.
   */
  handleDeathState() {
    if (!this.dyingSoundPlayed) {
      audioManager.play('death', 0.3);
      this.dyingSoundPlayed = true;
    }
    this.updateAnimation(this.FRAMES_DEAD);
  }

  /**
   * Updates the camera position based on the player position.
   */
  updateWorldCamera() {
    const rightBoundary = this.world.level.level_end_x - 620;

    if (this.x < 100) {
      this.world.cameraX = 0;
    } else if (this.x > rightBoundary) {
      this.world.cameraX = -(this.world.level.level_end_x - 720);
    } else {
      this.world.cameraX = -this.x + 100;
    }
  }

  /**
   * Plays the landing sound when the player lands on the ground.
   */
  playLandingSound() {
    setTimeout(() => {
      if (this.isGrounded()) audioManager.play('landing', 0.2);
    }, 1000);
  }
}
