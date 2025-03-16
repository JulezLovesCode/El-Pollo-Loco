/**
 * Represents a coin in the game that can be collected by the player.
 * The coin is placed at a random position and animated by switching between
 * two images to create a shining effect.
 *
 * @extends Collectible
 */
class Coin extends Collectible {
  /**
   * Creates a new coin at a random position.
   * The X-position is chosen between 200 and 2200.
   * The Y-position is chosen between 100 and 250.
   * Size of the coin is constant at 40x40 pixels.
   */
  constructor() {
    const x = 200 + Math.random() * 2000;
    const y = 100 + Math.random() * 150;
    super('./assets/images/8_coin/coin_1.png', x, y, 40, 40);
    this.setupAnimation();
  }

  /**
   * Sets up the animation of the coin, which switches between two images.
   * Every 200 milliseconds, the image is changed to create a shining effect.
   * The animation runs continuously as long as the coin exists.
   */
  setupAnimation() {
    setInterval(() => {
      if (this.img.src.endsWith('coin_1.png')) {
        this.loadImage('./assets/images/8_coin/coin_2.png');
      } else {
        this.loadImage('./assets/images/8_coin/coin_1.png');
      }
    }, 200);
  }
}
