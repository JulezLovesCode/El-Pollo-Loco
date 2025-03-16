/**
 * Represents a collectible object in the game.
 * This class serves as a base for all collectible items such as coins and other collectibles.
 * Each collectible object has a position, size, and a collision area with offset.
 *
 * @extends VisualElement
 * @property {Object} offset - The offset for collision calculations.
 * @property {number} offset.top - The top offset for collision calculations.
 * @property {number} offset.left - The left offset for collision calculations.
 * @property {number} offset.right - The right offset for collision calculations.
 * @property {number} offset.bottom - The bottom offset for collision calculations.
 */
class Collectible extends VisualElement {
  offset = {
    top: 10,
    left: 20,
    right: 20,
    bottom: 10,
  };

  /**
   * Creates a new collectible object.
   *
   * @param {string} imagePath - The path to the image file of the collectible object.
   * @param {number} x - The X-coordinate for positioning the object.
   * @param {number} y - The Y-coordinate for positioning the object.
   * @param {number} width - The width of the collectible object.
   * @param {number} height - The height of the collectible object.
   */
  constructor(imagePath, x, y, width, height) {
    super();
    this.loadImage(imagePath);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}
