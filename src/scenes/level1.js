/**
 * Initializes the level with all required objects.
 * Creates and configures the level with enemies, clouds, backgrounds,
 * coins, bottles, and the final boss.
 */
function initLevel() {
  level1 = new Level(
    createEnemies(),
    createClouds(),
    createBackgrounds(),
    createCoins(),
    createBottles(),
    createBoss()
  );
}

/**
 * Creates the enemies for the level.
 * Generates an array with normal and small enemies.
 * @returns {Array} - An array with enemies
 */
function createEnemies() {
  return [
    new Enemy(),
    new Enemy(),
    new Enemy(),
    new SmallEnemy(),
    new SmallEnemy(),
    new SmallEnemy(),
  ];
}

/**
 * Creates the clouds for the level.
 * Generates an array with cloud objects for the background.
 * @returns {Array} - An array with clouds
 */
function createClouds() {
  return [new Cloud(), new Cloud(), new Cloud()];
}

/**
 * Creates the background objects for the level.
 * Generates an array with background objects in multiple layers for parallax effects.
 * @returns {Array} - An array with background objects
 */
function createBackgrounds() {
  return [
    new BackgroundObject('./assets/images/5_background/layers/air.png', 0, 0),
    new BackgroundObject(
      './assets/images/5_background/layers/3_third_layer/full.png',
      0,
      40
    ),
    new BackgroundObject(
      './assets/images/5_background/layers/2_second_layer/full.png',
      0,
      40
    ),
    new BackgroundObject(
      './assets/images/5_background/layers/1_first_layer/full.png',
      0,
      40
    ),

    new BackgroundObject('./assets/images/5_background/layers/air.png', 719, 0),
    new BackgroundObject(
      './assets/images/5_background/layers/3_third_layer/1.png',
      719,
      40
    ),
    new BackgroundObject(
      './assets/images/5_background/layers/2_second_layer/1.png',
      719,
      40
    ),
    new BackgroundObject(
      './assets/images/5_background/layers/1_first_layer/1.png',
      719,
      40
    ),

    new BackgroundObject(
      './assets/images/5_background/layers/air.png',
      719 * 2,
      0
    ),
    new BackgroundObject(
      './assets/images/5_background/layers/3_third_layer/2.png',
      719 * 2,
      40
    ),
    new BackgroundObject(
      './assets/images/5_background/layers/2_second_layer/2.png',
      719 * 2,
      40
    ),
    new BackgroundObject(
      './assets/images/5_background/layers/1_first_layer/2.png',
      719 * 2,
      40
    ),

    new BackgroundObject(
      './assets/images/5_background/layers/air.png',
      719 * 3,
      0
    ),
    new BackgroundObject(
      './assets/images/5_background/layers/3_third_layer/1.png',
      719 * 3,
      40
    ),
    new BackgroundObject(
      './assets/images/5_background/layers/2_second_layer/1.png',
      719 * 3,
      40
    ),
    new BackgroundObject(
      './assets/images/5_background/layers/1_first_layer/1.png',
      719 * 3,
      40
    ),

    new BackgroundObject(
      './assets/images/5_background/layers/air.png',
      719 * 4,
      0
    ),
    new BackgroundObject(
      './assets/images/5_background/layers/3_third_layer/2.png',
      719 * 4,
      40
    ),
    new BackgroundObject(
      './assets/images/5_background/layers/2_second_layer/2.png',
      719 * 4,
      40
    ),
    new BackgroundObject(
      './assets/images/5_background/layers/1_first_layer/2.png',
      719 * 4,
      40
    ),
  ];
}

/**
 * Creates the coins for the level.
 * Generates an array with randomly placed coin objects.
 * @returns {Array} - An array with coins
 */
function createCoins() {
  let coins = [];
  for (let i = 0; i < 10; i++) {
    coins.push(new Coin());
  }
  return coins;
}

/**
 * Creates the bottles for the level.
 * Generates an array with randomly placed bottle collectibles.
 * @returns {Array} - An array with bottles
 */
function createBottles() {
  let bottles = [];
  for (let i = 0; i < 8; i++) {
    const x = 300 + Math.random() * 2000;
    bottles.push(
      new Collectible(
        './assets/images/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        x,
        380,
        80,
        80
      )
    );
  }
  return bottles;
}

/**
 * Creates the final boss for the level.
 * Generates an array with a BossEnemy object.
 * @returns {Array} - An array with the final boss
 */
function createBoss() {
  return [new BossEnemy()];
}
