/**
 * Represents a bottle item counter that displays the collection progress.
 * This class visualizes the ratio between collected and available bottles
 * in the form of a blue status bar that fills according to the collection progress.
 *
 * @extends StatusDisplay
 * @property {string[]} IMAGES - An array with paths to images for different collection states,
 *                               from 0% (Index 0) to 100% (Index 5) of collected bottles.
 */
class ItemCounter extends StatusDisplay {
  IMAGES = [
    './assets/images/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
    './assets/images/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
    './assets/images/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
    './assets/images/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
    './assets/images/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
    './assets/images/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png',
  ];

  /**
   * Creates a new bottle item counter.
   * Loads all required images, positions the display vertically,
   * and initializes the collection progress to 0%.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.y = 150;
    this.setPercentage(0);
  }

  /**
   * Updates the display based on the ratio between collected and total bottles.
   * Calculates the percentage of collected bottles and updates the visual representation.
   *
   * @param {number} collected - The number of already collected bottles.
   * @param {number} total - The total number of bottles available in the level.
   */
  updateDisplay(collected, total) {
    this.percentage = (collected / total) * 100;
    this.setPercentage(this.percentage);
  }

  /**
   * Determines the path to the appropriate image based on the current collection progress.
   * Selects an image from the IMAGES array according to the percentage of collected bottles:
   * - 100%: Index 5 (all bottles collected)
   * - 80-99%: Index 4
   * - 60-79%: Index 3
   * - 40-59%: Index 2
   * - 20-39%: Index 1
   * - 0-19%: Index 0 (few or no bottles collected)
   *
   * @returns {string} The path to the image that corresponds to the current collection progress.
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
