/**
 * Represents a game level with all necessary objects and boundaries.
 * @class
 */
class Level {
  /**
   * List of enemies in the level
   * @type {Enemy[]}
   */
  enemies;

  /**
   * List of clouds in the level
   * @type {Cloud[]}
   */
  clouds;

  /**
   * List of background objects in the level
   * @type {BackgroundObject[]}
   */
  backgroundObjects;

  /**
   * List of collectible coins in the level
   * @type {Coin[]}
   */
  coins;

  /**
   * List of collectible bottles in the level
   * @type {Collectible[]}
   */
  bottles;

  /**
   * List of final bosses in the level
   * @type {BossEnemy[]}
   */
  endboss;

  /**
   * X-coordinate of the level end
   * @type {number}
   */
  level_end_x = 3370;

  /**
   * Creates a new level with the specified objects.
   * @param {Enemy[]} enemies - The enemies in the level
   * @param {Cloud[]} clouds - The clouds in the level
   * @param {BackgroundObject[]} backgroundObjects - The background objects in the level
   * @param {Coin[]} coins - The collectible coins in the level
   * @param {Collectible[]} bottles - The collectible bottles in the level
   * @param {BossEnemy[]} endboss - The final bosses in the level
   */
  constructor(enemies, clouds, backgroundObjects, coins, bottles, endboss) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.coins = coins;
    this.bottles = bottles;
    this.endboss = endboss;
  }
}
