/**
 * Class for throwable projectiles (bottles).
 * @class
 * @extends GameEntity
 */
class ProjectileItem extends GameEntity {
  /** @type {number} Height of the projectile */
  height = 60;
  /** @type {number} Width of the projectile */
  width = 50;
  /** @type {boolean} Indicates whether the projectile should be removed */
  isRemoved = false;
  /** @type {boolean} Indicates whether the projectile has broken */
  hasCollided = false;

  /** @type {Object} Collision offsets for precise collision detection */
  offset = {
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
  };

  /** @type {string[]} Images for the rotation animation */
  ROTATION_IMAGES = [
    './assets/images/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
    './assets/images/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
    './assets/images/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
    './assets/images/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
  ];

  /** @type {string[]} Images for the splash animation */
  SPLASH_IMAGES = [
    './assets/images/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
    './assets/images/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
    './assets/images/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
    './assets/images/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
    './assets/images/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
    './assets/images/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
  ];

  /** @type {Object} Sound effects of the projectile */
  audio = {
    splash: new Audio('assets/sounds/shattering bottle.mp3'),
  };

  /**
   * Creates a new projectile.
   * @param {number} x - X-position
   * @param {number} y - Y-position
   * @param {string} direction - Direction ('left' or 'right')
   */
  constructor(x, y, direction) {
    super();
    this.loadImage(
      './assets/images/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png'
    );
    this.loadImages(this.ROTATION_IMAGES);
    this.loadImages(this.SPLASH_IMAGES);
    this.registerAudio(this.audio);
    this.x = x;
    this.y = y;
    this.velocity = 15;
    this.verticalSpeed = 7;
    this.applyPhysics();
    this.throw(direction);
  }

  /**
   * Throws the projectile in a specific direction.
   * @param {string} direction - Direction ('left' or 'right')
   */
  throw(direction) {
    this.verticalSpeed = 5;

    let rotationInterval = setInterval(() => {
      if (!this.hasCollided) {
        this.updateAnimation(this.ROTATION_IMAGES);
      }
    }, 1000 / 10);

    let movementInterval = setInterval(() => {
      if (!this.hasCollided) {
        if (direction === 'right') {
          this.x += this.velocity;
        } else {
          this.x -= this.velocity;
        }
      }
    }, 1000 / 60);

    let groundCheckInterval = setInterval(() => {
      if (this.y > 360 && !this.hasCollided) {
        this.splashAnimation();
        clearInterval(groundCheckInterval);
      }
    }, 100);

    if (typeof intervalIds !== 'undefined') {
      intervalIds.push(rotationInterval, movementInterval, groundCheckInterval);
    }
  }

  /**
   * Plays the splash animation when the projectile hits a surface.
   */
  splashAnimation() {
    this.hasCollided = true;

    audioManager.play('throw', 0.3);
    this.velocity = 0;
    this.verticalSpeed = 0;

    let splashInterval = setInterval(() => {
      this.updateAnimation(this.SPLASH_IMAGES);
    }, 60);

    setTimeout(() => {
      clearInterval(splashInterval);
      this.isRemoved = true;
    }, 500);

    if (typeof intervalIds !== 'undefined') {
      intervalIds.push(splashInterval);
    }
  }
}
