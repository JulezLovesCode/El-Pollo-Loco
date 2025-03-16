/**
 * Standard enemy class for normal chickens in the game.
 * Includes movement and animation logic.
 * @class
 * @extends GameEntity
 */
class Enemy extends GameEntity {
  /**
   * Height of the enemy in pixels
   * @type {number}
   */
  height = 80;

  /**
   * Width of the enemy in pixels
   * @type {number}
   */
  width = 60;

  /**
   * Y-position of the enemy (ground position)
   * @type {number}
   */
  y = 380;

  /**
   * Movement speed with random component
   * @type {number}
   */
  velocity = 0.15 + Math.random() * 0.4;

  /**
   * Status whether the enemy has been jumped on
   * @type {boolean}
   */
  isJumpedOn = false;

  /**
   * Health points of the enemy
   * @type {number}
   */
  health = 20;

  /**
   * Collision offsets for precise collision detection
   * @type {Object}
   */
  offset = {
    top: 5,
    bottom: 5,
    left: 5,
    right: 5,
  };

  /**
   * Images for the walking animation
   * @type {string[]}
   */
  WALK_IMAGES = [
    './assets/images/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
    './assets/images/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
    './assets/images/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
  ];

  /**
   * Images for the death animation
   * @type {string[]}
   */
  DEAD_IMAGES = [
    './assets/images/3_enemies_chicken/chicken_normal/2_dead/dead.png',
  ];

  /**
   * Sound effects of the enemy
   * @type {Object}
   */
  audio = {
    jumpedOn_sound: new Audio('assets/sounds/chicken dead.mp3'),
  };

  /**
   * Creates a new standard enemy.
   * Loads images, registers audio, and initializes position and animation.
   * @constructor
   */
  constructor() {
    super();
    this.loadImage(this.WALK_IMAGES[0]);
    this.loadImages(this.WALK_IMAGES);
    this.loadImages(this.DEAD_IMAGES);
    this.registerAudio(this.audio);
    this.x = 200 + Math.random() * 2000;
    this.animate();
  }

  /**
   * Starts the movement and animation intervals of the enemy.
   * Switches animation based on the isJumpedOn status.
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
    }, 200);

    if (typeof intervalIds !== 'undefined') {
      intervalIds.push(this.moveInterval, this.animationInterval);
    }
  }
}
