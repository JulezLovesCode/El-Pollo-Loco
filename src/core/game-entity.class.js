/**
 * Base class for all movable game entities such as players, enemies, and projectiles.
 * Extends VisualElement with physics, movement, collision, and health status.
 * @class
 * @extends VisualElement
 */
class GameEntity extends VisualElement {
  /**
   * Movement speed of the entity
   * @type {number}
   */
  velocity = 0.15;

  /**
   * Indicates whether the entity is facing left (true) or right (false)
   * @type {boolean}
   */
  facing = false;

  /**
   * Vertical speed for jumps and falling
   * @type {number}
   */
  verticalSpeed = 0;

  /**
   * Gravity value for physics calculations
   * @type {number}
   */
  gravity = 2.5;

  /**
   * Health value of the entity
   * @type {number}
   */
  health = 100;

  /**
   * Timestamp of the last damage taken
   * @type {number}
   */
  lastDamage = 0;

  /**
   * Stores the timestamp of the last sound playback per sound
   * @type {Object}
   */
  lastSoundPlayed = {};

  /**
   * Cooldown time between identical sound playbacks in milliseconds
   * @type {number}
   */
  soundCooldown = 300;

  /**
   * Applies physics (gravity) to the entity.
   * Updates the vertical position based on verticalSpeed and gravity.
   */
  applyPhysics() {
    setInterval(() => {
      if (this.isInAir() || this.verticalSpeed > 0) {
        this.y -= this.verticalSpeed;
        this.verticalSpeed -= this.gravity;

        if (this instanceof Player && this.y > 210) {
          this.y = 210;
          this.verticalSpeed = 0;
        }
      }
    }, 1000 / 25);
  }

  /**
   * Checks if the entity is in the air.
   * @returns {boolean} - true if the entity is in the air, otherwise false
   */
  isInAir() {
    if (this instanceof ProjectileItem) {
      return true;
    } else {
      return this.y < 210; // Geändert von 180 auf 210
    }
  }

  /**
   * Checks if the entity is on the ground.
   * @returns {boolean} - true if the entity is on the ground, otherwise false
   */
  isGrounded() {
    return this.y >= 210; // Geändert von > 180 auf >= 210
  }

  /**
   * Checks for collision with another game object.
   * Uses offset values for precise collision detection.
   * @param {GameEntity} mo - The other game object
   * @returns {boolean} - true on collision, otherwise false
   */
  checkCollision(mo) {
    let right = this.x + this.offset.left + this.width - this.offset.right;
    let bottom = this.y + this.offset.top + this.height - this.offset.bottom;
    let left = this.x + this.offset.left;
    let top = this.y + this.offset.top;

    let moRight = mo.x + mo.offset.left + mo.width - mo.offset.right;
    let moBottom = mo.y + mo.offset.top + mo.height - mo.offset.bottom;
    let moLeft = mo.x + mo.offset.left;
    let moTop = mo.y + mo.offset.top;

    return right > moLeft && bottom > moTop && left < moRight && top < moBottom;
  }

  /**
   * Inflicts damage to the entity and updates the timestamp of the last damage.
   * @param {number} amount - The amount of damage
   */
  takeDamage(amount) {
    this.health -= amount;
    if (this.health < 0) {
      this.health = 0;
    } else {
      this.lastDamage = new Date().getTime();
    }
  }

  /**
   * Checks if the entity has recently taken damage.
   * @returns {boolean} - true if the entity was recently damaged, otherwise false
   */
  isDamaged() {
    let timeSinceDamage = (new Date().getTime() - this.lastDamage) / 1000;
    return timeSinceDamage < 0.5;
  }

  /**
   * Checks if the entity is defeated (has no health left).
   * @returns {boolean} - true if the entity is defeated, otherwise false
   */
  isDefeated() {
    return this.health === 0;
  }

  /**
   * Updates the image for animation.
   * Cycles through the frame images.
   * @param {string[]} frames - Array with image paths for the animation
   */
  updateAnimation(frames) {
    let index = this.currentImage % frames.length;
    let path = frames[index];
    this.img = this.imageCache[path];

    if (this.currentImage >= frames.length - 1) {
      this.currentImage = 0;
    } else {
      this.currentImage++;
    }
  }

  /**
   * Moves the entity to the left.
   * Decreases the X coordinate based on velocity.
   */
  moveLeft() {
    this.x -= this.velocity;
  }

  /**
   * Moves the entity to the right.
   * Increases the X coordinate based on velocity.
   */
  moveRight() {
    this.x += this.velocity;
  }

  /**
   * Makes the entity jump.
   * Sets the vertical speed to a positive value.
   */
  jump() {
    this.verticalSpeed = 30;
  }

  /**
   * Plays a sound with cooldown mechanism and error handling.
   * Considers global muting and audio activity.
   * @param {string} sound - The ID name of the sound
   * @param {number} volume - The desired volume (0.0 to 1.0)
   */
  playSound(sound, volume) {
    try {
      if (this.validateSoundPlayback(sound)) return;

      if (this.checkCooldown(sound)) return;

      this.lastSoundPlayed[sound] = Date.now();
      this.playSoundElement(sound, volume);
    } catch (e) {}
  }
  /**
   * Validates if a sound can be played based on current audio state.
   * Checks if the sound exists, if audio is muted globally, or if world audio is inactive.
   *
   * @param {string} sound - The ID name of the sound to validate
   * @returns {boolean} - true if sound should not be played, false if playback is valid
   */
  validateSoundPlayback(sound) {
    if (!this.audio || !this.audio[sound]) return true;

    if (audioManager && audioManager.muted) return true;
    if (typeof world !== 'undefined' && !world.audioActive) return true;

    return false;
  }
  /**
   * Checks if a sound is currently on cooldown to prevent rapid repeated playback.
   * Uses the soundCooldown property to determine the minimum time between plays.
   *
   * @param {string} sound - The ID name of the sound to check
   * @returns {boolean} - true if sound is on cooldown, false if ready to play
   */
  checkCooldown(sound) {
    const now = Date.now();
    const lastPlayed = this.lastSoundPlayed[sound] || 0;

    return now - lastPlayed < this.soundCooldown;
  }
  /**
   * Plays the actual sound element with the specified volume.
   * Resets the sound to the beginning before playing.
   *
   * @param {string} sound - The ID name of the sound to play
   * @param {number} volume - The volume level to set (0.0 to 1.0)
   */
  playSoundElement(sound, volume) {
    const audioElement = this.audio[sound];

    audioElement.volume = volume;

    if (audioElement.paused) {
      audioElement.currentTime = 0;
      this.handlePlayPromise(audioElement);
    }
  }
  /**
   * Handles the promise returned by audio.play() to catch any errors.
   * Provides error handling for sound playback without disrupting gameplay.
   *
   * @param {HTMLAudioElement} audioElement - The audio element to play
   */
  handlePlayPromise(audioElement) {
    try {
      let playPromise = audioElement.play();

      if (playPromise !== undefined) {
        playPromise.catch((error) => {});
      }
    } catch (e) {}
  }
}
