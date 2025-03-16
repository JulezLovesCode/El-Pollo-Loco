/**
 * Small enemy class for chicks in the game.
 * Faster and smaller than normal enemies.
 * @class
 * @extends GameEntity
 */
class SmallEnemy extends GameEntity {
  /**
   * Height of the small enemy in pixels
   * @type {number}
   */
  height = 50;

  /**
   * Width of the small enemy in pixels
   * @type {number}
   */
  width = 40;

  /**
   * Y-position of the small enemy (deeper ground position)
   * @type {number}
   */
  y = 410;

  /**
   * Movement speed with random component
   * @type {number}
   */
  velocity = 0.3 + Math.random() * 0.5;

  /**
   * Status whether the small enemy has been jumped on
   * @type {boolean}
   */
  isJumpedOn = false;

  /**
   * Health points of the small enemy
   * @type {number}
   */
  health = 10;

  /**
   * Collision offsets for precise collision detection
   * @type {Object}
   */
  offset = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  /**
   * Images for the walking animation of the small enemy
   * @type {string[]}
   */
  WALK_IMAGES = [
    './assets/images/3_enemies_chicken/chicken_small/1_walk/1_w.png',
    './assets/images/3_enemies_chicken/chicken_small/1_walk/2_w.png',
    './assets/images/3_enemies_chicken/chicken_small/1_walk/3_w.png',
  ];

  /**
   * Images for the death animation of the small enemy
   * @type {string[]}
   */
  DEAD_IMAGES = [
    './assets/images/3_enemies_chicken/chicken_small/2_dead/dead.png',
  ];

  /**
   * Sound effects of the small enemy
   * @type {Object}
   */
  audio = {
    jumpedOn_sound: new Audio('assets/sounds/chick dead.mp3'),
  };

  /**
   * Creates a new small enemy.
   * Loads images, registers audio, and initializes the position and animation.
   * @constructor
   */
  constructor() {
    super();
    this.loadImage(this.WALK_IMAGES[0]);
    this.loadImages(this.WALK_IMAGES);
    this.loadImages(this.DEAD_IMAGES);
    this.registerAudio(this.audio);
    this.x = 400 + Math.random() * 2000;
    this.animate();
  }

  /**
   * Starts the movement and animation intervals of the small enemy.
   * The animation is faster than for normal enemies.
   */
  animate() {
    this.moveInterval = setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);

    this.animationInterval = setInterval(() => {
      if (this.isJumpedOn) {
        this.updateAnimation(this.DEAD_IMAGES);
      } else {
        this.updateAnimation(this.WALK_IMAGES);
      }
    }, 150);

    if (typeof intervalIds !== 'undefined') {
      intervalIds.push(this.moveInterval, this.animationInterval);
    }
  }
}
