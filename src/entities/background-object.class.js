/**
 * Represents a background object in the game, displayed as a visual element.
 * Background objects have a fixed size and are placed at a specific position.
 *
 * @extends VisualElement
 * @property {number} width - The width of the background object, default is 720 pixels.
 * @property {number} height - The height of the background object, default is 480 pixels.
 */
class BackgroundObject extends VisualElement {
  width = 720;
  height = 480;

  /**
   * Creates a new background object.
   *
   * @param {string} imagePath - The path to the image file of the background object.
   * @param {number} x - The X-coordinate for positioning the background object.
   * @param {number} y - The Y-coordinate for positioning the background object.
   */
  constructor(imagePath, x, y) {
    super();
    this.loadImage(imagePath);
    this.x = x;
    this.y = y;
  }
}
