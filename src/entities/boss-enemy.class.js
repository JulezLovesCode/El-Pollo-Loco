/**
 * Class for the final boss.
 * @class
 * @extends GameEntity
 */
class BossEnemy extends GameEntity {
  /** @type {number} Height of the boss */
  height = 400;
  /** @type {number} Width of the boss */
  width = 300;
  /** @type {number} Y-position of the boss */
  y = 60;
  /** @type {number} X-position of the boss */
  x = 3000;
  /** @type {number} Movement speed */
  velocity = 1.2;
  /** @type {number} Maximum health of the boss */
  maxHealth = 200;
  /** @type {number} Health of the boss */
  health = 200;
  /** @type {GameWorld} Reference to the game world */
  world;

  /** @type {Object} Collision offsets for precise collision detection */
  offset = {
    top: 80,
    bottom: 20,
    left: 40,
    right: 40,
  };

  /** @type {string[]} Images for walking animation */
  WALK_IMAGES = [
    './assets/images/4_enemie_boss_chicken/1_walk/G1.png',
    './assets/images/4_enemie_boss_chicken/1_walk/G2.png',
    './assets/images/4_enemie_boss_chicken/1_walk/G3.png',
    './assets/images/4_enemie_boss_chicken/1_walk/G4.png',
  ];

  /** @type {string[]} Images for alert animation */
  ALERT_IMAGES = [
    './assets/images/4_enemie_boss_chicken/2_alert/G5.png',
    './assets/images/4_enemie_boss_chicken/2_alert/G6.png',
    './assets/images/4_enemie_boss_chicken/2_alert/G7.png',
    './assets/images/4_enemie_boss_chicken/2_alert/G8.png',
    './assets/images/4_enemie_boss_chicken/2_alert/G9.png',
    './assets/images/4_enemie_boss_chicken/2_alert/G10.png',
    './assets/images/4_enemie_boss_chicken/2_alert/G11.png',
    './assets/images/4_enemie_boss_chicken/2_alert/G12.png',
  ];

  /** @type {string[]} Images for attack animation */
  ATTACK_IMAGES = [
    './assets/images/4_enemie_boss_chicken/3_attack/G13.png',
    './assets/images/4_enemie_boss_chicken/3_attack/G14.png',
    './assets/images/4_enemie_boss_chicken/3_attack/G15.png',
    './assets/images/4_enemie_boss_chicken/3_attack/G16.png',
    './assets/images/4_enemie_boss_chicken/3_attack/G17.png',
    './assets/images/4_enemie_boss_chicken/3_attack/G18.png',
    './assets/images/4_enemie_boss_chicken/3_attack/G19.png',
    './assets/images/4_enemie_boss_chicken/3_attack/G20.png',
  ];

  /** @type {string[]} Images for damage animation */
  HURT_IMAGES = [
    './assets/images/4_enemie_boss_chicken/4_hurt/G21.png',
    './assets/images/4_enemie_boss_chicken/4_hurt/G22.png',
    './assets/images/4_enemie_boss_chicken/4_hurt/G23.png',
  ];

  /** @type {string[]} Images for death animation */
  DEAD_IMAGES = [
    './assets/images/4_enemie_boss_chicken/5_dead/G24.png',
    './assets/images/4_enemie_boss_chicken/5_dead/G25.png',
    './assets/images/4_enemie_boss_chicken/5_dead/G26.png',
  ];

  /** @type {Object} Sound effects of the boss */
  audio = {
    alert_sound: new Audio('assets/sounds/chicken dead.mp3'),
    hurt_sound: new Audio('assets/sounds/chicken dead.mp3'),
  };

  /** @type {boolean} Indicates whether the boss is in rage mode */
  enragedMode = false;
  /** @type {boolean} Indicates whether the boss is in attack mode */
  attackMode = false;
  /** @type {boolean} Indicates whether the boss was hit for the first time */
  firstContact = false;

  /**
   * Creates a new boss enemy.
   */
  constructor() {
    super();
    this.loadImage(this.WALK_IMAGES[0]);
    this.loadImages(this.WALK_IMAGES);
    this.loadImages(this.ALERT_IMAGES);
    this.loadImages(this.ATTACK_IMAGES);
    this.loadImages(this.HURT_IMAGES);
    this.loadImages(this.DEAD_IMAGES);
    this.registerAudio(this.audio);
    this.animate();
  }

  /**
   * Sets the reference to the game world.
   * @param {GameWorld} world - The game world instance
   */
  setWorld(world) {
    this.world = world;
  }

  /**
   * Starts the animation of the boss.
   */
  animate() {
    this.moveInterval = setInterval(() => {
      this.updateMovement();
    }, 1000 / 60);

    this.animationInterval = setInterval(() => {
      this.updateAppearance();
    }, 100);

    if (typeof intervalIds !== 'undefined') {
      intervalIds.push(this.moveInterval, this.animationInterval);
    }
  }

  /**
   * Updates the movement of the boss based on the player position.
   */
  updateMovement() {
    if (this.isDefeated()) return;

    if (this.enragedMode && this.world && this.world.player) {
      this.trackPlayer();
      this.adjustSpeed();
    } else if (this.enragedMode) {
      this.defaultMovement();
    }
  }
  /**
   * Tracks the player's position and moves the boss accordingly.
   * If the player is to the left, the boss moves left and faces left.
   * If the player is to the right, the boss moves right and faces right.
   */
  trackPlayer() {
    const playerX = this.world.player.x;

    if (playerX < this.x - 100) {
      this.facing = false;
      this.moveLeft();
    } else if (playerX > this.x + 100) {
      this.facing = true;
      this.moveRight();
    }
  }
  /**
   * Adjusts the boss's movement speed based on its current mode.
   * Higher speed is used in attack mode, normal speed otherwise.
   */
  adjustSpeed() {
    if (this.attackMode) {
      this.velocity = 1.5;
    } else {
      this.velocity = 1.2;
    }
  }
  /**
   * Provides default movement behavior when not tracking the player.
   * Boss moves to the left and faces left.
   */
  defaultMovement() {
    this.moveLeft();
    this.facing = false;
  }

  /**
   * Moves the boss to the right.
   */
  moveRight() {
    this.x += this.velocity;
  }

  /**
   * Updates the appearance of the boss based on its state.
   */
  updateAppearance() {
    if (this.isDefeated()) {
      this.updateAnimation(this.DEAD_IMAGES);
    } else if (this.isDamaged()) {
      this.updateAnimation(this.HURT_IMAGES);
      this.playSound('hurt_sound', 0.5);
    } else if (this.attackMode) {
      this.updateAnimation(this.ATTACK_IMAGES);
    } else if (this.enragedMode) {
      this.updateAnimation(this.WALK_IMAGES);
    } else {
      this.updateAnimation(this.WALK_IMAGES);
    }
  }

  /**
   * Inflicts damage to the boss and updates its state.
   * @param {number} amount - The amount of damage
   */
  takeDamage(amount) {
    super.takeDamage(amount);
    console.log('Boss health:', this.health, '/', this.maxHealth);

    if (!this.firstContact) {
      this.firstContact = true;
      this.enragedMode = true;
      this.playSound('alert_sound', 0.5);
    }

    if (this.health < 50 && !this.attackMode) {
      this.attackMode = true;
    }
  }
}
