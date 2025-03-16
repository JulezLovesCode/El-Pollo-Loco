/**
 * Überschreibt alle Konsolenfunktionen, um sämtliche Ausgaben zu unterdrücken.
 * @description Verhindert jegliche Ausgaben in der Browser-Konsole, einschließlich Logs, Warnungen und Fehler.
 */
(function () {
  const emptyFunction = function () {};

  window.console.log = emptyFunction;
  window.console.warn = emptyFunction;
  window.console.error = emptyFunction;
  window.console.info = emptyFunction;
  window.console.debug = emptyFunction;
  window.console.trace = emptyFunction;
  window.console.dir = emptyFunction;
  window.console.dirxml = emptyFunction;
  window.console.group = emptyFunction;
  window.console.groupCollapsed = emptyFunction;
  window.console.groupEnd = emptyFunction;
  window.console.time = emptyFunction;
  window.console.timeEnd = emptyFunction;
  window.console.timeLog = emptyFunction;
  window.console.table = emptyFunction;
  window.console.count = emptyFunction;
  window.console.countReset = emptyFunction;
  window.console.assert = emptyFunction;
  window.console.clear = emptyFunction;

  window.onerror = function () {
    return true;
  };
})();

/**
 * Base class for all visual elements in the game.
 * Provides basic functionality for loading and drawing images.
 * @class
 */
class VisualElement {
  /**
   * X-coordinate of the element
   * @type {number}
   */
  x = 120;

  /**
   * Y-coordinate of the element
   * @type {number}
   */
  y = 200;

  /**
   * Height of the element in pixels
   * @type {number}
   */
  height = 150;

  /**
   * Width of the element in pixels
   * @type {number}
   */
  width = 100;

  /**
   * Offset values for collision detection
   * @type {Object}
   */
  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  /**
   * Current image index for animations
   * @type {number}
   */
  currentImage = 0;

  /**
   * Current image of the element
   * @type {Image}
   */
  img;

  /**
   * Cache for loaded images
   * @type {Object}
   */
  imageCache = {};

  /**
   * Loads a single image.
   * @param {string} path - The path to the image
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Loads multiple images into the cache.
   * @param {string[]} arr - Array of image paths
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Registers audio elements in the global soundEffects array.
   * @param {Object} arr - Object with audio elements
   */
  registerAudio(arr) {
    Object.values(arr).forEach((sound) => {
      soundEffects.push(sound);
    });
  }

  /**
   * Draws the element on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas context
   */
  draw(ctx) {
    try {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    } catch (e) {
      console.warn('Error loading image', e);
    }
  }

  /**
   * Draws the hitbox of the element for debugging purposes.
   * Only shown for players and enemies.
   * @param {CanvasRenderingContext2D} ctx - The canvas context
   */
  drawHitbox(ctx) {
    if (
      this instanceof Player ||
      this instanceof Enemy ||
      this instanceof SmallEnemy ||
      this instanceof BossEnemy
    ) {
      ctx.beginPath();
      ctx.lineWidth = '5';
      ctx.strokeStyle = 'blue';
      ctx.rect(
        this.x + this.offset.left,
        this.y + this.offset.top,
        this.width - this.offset.right - this.offset.left,
        this.height - this.offset.bottom - this.offset.top
      );
      ctx.stroke();
    }
  }
}
