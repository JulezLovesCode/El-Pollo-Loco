/**
 * Represents an abstract status display that is rendered as a visual component.
 * This class serves as a base class for various types of status displays such as health,
 * coin counters, item counters, etc. and provides basic functionality.
 *
 * @extends VisualElement
 * @property {number} percentage - The current percentage value of the status, default is 100.
 */
class StatusDisplay extends VisualElement {
  percentage = 100;

  /**
   * Creates a new status display with default position and size.
   * Initializes the display at a fixed position (x=20, y=50) with fixed size (200x60).
   */
  constructor() {
    super();
    this.x = 20;
    this.y = 50;
    this.width = 200;
    this.height = 60;
  }

  /**
   * Updates the percentage value of the status display and the corresponding display image.
   * Calls getImagePath() to get the path to the appropriate image and sets the image
   * from the imageCache.
   *
   * @param {number} percentage - The new percentage value for the status display.
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let imagePath = this.getImagePath();
    this.img = this.imageCache[imagePath];
  }

  /**
   * Determines the path to the image to be displayed based on the current percentage value.
   * This method must be overridden by subclasses to provide the specific
   * images for the respective status display.
   *
   * @returns {string} The path to the image to be displayed.
   */
  getImagePath() {
    // Will be overridden by subclasses
    return '';
  }
}
