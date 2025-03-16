/**
 * Represents a coin counter that displays the progress of collected coins.
 * This class visualizes the ratio between collected and available coins
 * in the form of a status bar that fills according to the collection progress.
 *
 * @extends StatusDisplay
 * @property {string[]} IMAGES - An array with paths to images for different collection states,
 *                               from 0% (Index 0) to 100% (Index 5) of collected coins.
 */
class CoinCounter extends StatusDisplay {
  IMAGES = [
    './assets/images/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png',
    './assets/images/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
    './assets/images/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
    './assets/images/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png',
    './assets/images/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png',
    './assets/images/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png',
  ];

  /**
   * Creates a new coin counter.
   * Loads all required images, positions the display vertically,
   * and initializes the collection progress to 0%.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.y = 100;
    this.setPercentage(0);
  }

  /**
   * Updates the display based on the ratio between collected and total coins.
   * Calculates the percentage of collected coins and updates the visual representation.
   *
   * @param {number} collected - The number of already collected coins.
   * @param {number} total - The total number of coins available in the level.
   */
  updateDisplay(collected, total) {
    this.percentage = (collected / total) * 100;
    this.setPercentage(this.percentage);
  }

  /**
   * Determines the path to the appropriate image based on the current collection progress.
   * Selects an image from the IMAGES array according to the percentage of collected coins:
   * - 100%: Index 5 (all coins collected)
   * - 80-99%: Index 4
   * - 60-79%: Index 3
   * - 40-59%: Index 2
   * - 20-39%: Index 1
   * - 0-19%: Index 0 (few or no coins collected)
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
