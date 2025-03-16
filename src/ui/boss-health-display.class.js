/**
 * Represents the health display for the final boss.
 * This class shows the current health status of the boss in the form of a
 * visual status bar that changes according to the health percentage.
 * The display uses different images for various health levels.
 *
 * @extends StatusDisplay
 * @property {string[]} IMAGES - An array with paths to images for different health states,
 *                              from 0% (index 0) to 100% (index 5).
 */
class BossHealthDisplay extends StatusDisplay {
  IMAGES = [
    './assets/images/7_statusbars/2_statusbar_endboss/blue/blue0.png',
    './assets/images/7_statusbars/2_statusbar_endboss/blue/blue20.png',
    './assets/images/7_statusbars/2_statusbar_endboss/blue/blue40.png',
    './assets/images/7_statusbars/2_statusbar_endboss/blue/blue60.png',
    './assets/images/7_statusbars/2_statusbar_endboss/blue/blue80.png',
    './assets/images/7_statusbars/2_statusbar_endboss/blue/blue100.png',
  ];

  /**
   * Creates a new health display for the final boss.
   * Loads all required images, positions the display, and
   * sets the initial health status to 100%.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 500;
    this.y = 50;
    this.setPercentage(100);
  }

  /**
   * Determines the path to the appropriate image based on the current health percentage.
   * Selects an image from the IMAGES array according to the health value:
   * - 100-80%: Index 5 (full health)
   * - 80-60%: Index 4
   * - 60-40%: Index 3
   * - 40-20%: Index 2
   * - 20-1%: Index 1
   * - 0%: Index 0 (empty health)
   *
   * @returns {string} The path to the image that corresponds to the current health status.
   */
  getImagePath() {
    if (this.percentage >= 100) {
      return this.IMAGES[5];
    } else if (this.percentage >= 80) {
      return this.IMAGES[4];
    } else if (this.percentage >= 60) {
      return this.IMAGES[3];
    } else if (this.percentage >= 40) {
      return this.IMAGES[2];
    } else if (this.percentage >= 20) {
      return this.IMAGES[1];
    } else {
      return this.IMAGES[0];
    }
  }
}
