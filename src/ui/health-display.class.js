/**
 * Represents a health display for the player.
 * This class visualizes the current health status of the player
 * through a status bar that changes according to the health percentage.
 * The display uses different images with green bars for various
 * health levels.
 *
 * @extends StatusDisplay
 * @property {string[]} IMAGES - An array with paths to images for different health states,
 *                              from 0% (Index 0) to 100% (Index 5).
 */
class HealthDisplay extends StatusDisplay {
  IMAGES = [
    './assets/images/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
    './assets/images/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
    './assets/images/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
    './assets/images/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
    './assets/images/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
    './assets/images/7_statusbars/1_statusbar/2_statusbar_health/green/100.png',
  ];

  /**
   * Creates a new health display.
   * Loads all required images and sets the initial health status to 100%.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.setPercentage(100);
  }

  /**
   * Determines the path to the appropriate image based on the current health percentage.
   * Selects an image from the IMAGES array according to the health value:
   * - 100%: Index 5 (full health)
   * - 81-99%: Index 4
   * - 61-80%: Index 3
   * - 41-60%: Index 2
   * - 21-40%: Index 1
   * - 0-20%: Index 0 (critical health status)
   *
   * @returns {string} The path to the image that corresponds to the current health status.
   */
  getImagePath() {
    if (this.percentage == 100) {
      return this.IMAGES[5];
    } else if (this.percentage > 80) {
      return this.IMAGES[4];
    } else if (this.percentage > 60) {
      return this.IMAGES[3];
    } else if (this.percentage > 40) {
      return this.IMAGES[2];
    } else if (this.percentage > 20) {
      return this.IMAGES[1];
    } else {
      return this.IMAGES[0];
    }
  }
}
