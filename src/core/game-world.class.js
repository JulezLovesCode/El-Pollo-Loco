/**
 * Main class for managing the game state and game world.
 * @class
 */
class GameWorld {
  /** @type {Player} The player character */
  player = new Player();
  /** @type {HealthDisplay} Display of player health */
  healthDisplay = new HealthDisplay();
  /** @type {CoinCounter} Display of collected coins */
  coinCounter = new CoinCounter();
  /** @type {ItemCounter} Display of collected items */
  itemCounter = new ItemCounter();
  /** @type {BossHealthDisplay} Display of boss health */
  bossHealthDisplay = new BossHealthDisplay();
  /** @type {EndScreen} Screen for game victory */
  winScreen = new EndScreen(
    './assets/images/9_intro_outro_screens/win/won_2.png',
    0,
    0
  );
  /** @type {EndScreen} Screen for game defeat */
  loseScreen = new EndScreen(
    './assets/images/9_intro_outro_screens/game_over/oh no you lost!.png',
    0,
    0
  );

  /** @type {Level} The current level */
  level = level1;
  /** @type {HTMLCanvasElement} The canvas element */
  canvas;
  /** @type {CanvasRenderingContext2D} The 2D context of the canvas */
  ctx;
  /** @type {InputManager} Manager for player inputs */
  inputManager;
  /** @type {number} Position of the camera on the X-axis */
  cameraX = 0;
  /** @type {number} Timestamp of the last throw */
  lastThrowTime = 0;
  /** @type {number} Cooldown time between throws in ms */
  throwCooldown = 500;
  /** @type {number} Number of collected items */
  collectedItems = 0;
  /** @type {number} Total number of items in the level */
  totalItems = level1.bottles.length;
  /** @type {number} Number of collected coins */
  collectedCoins = 0;
  /** @type {number} Total number of coins in the level */
  totalCoins = level1.coins.length;
  /** @type {boolean} Indicates whether audio is active */
  audioActive = true;
  /** @type {boolean} Indicates whether sound is muted */
  muted = false;
  /** @type {boolean} Indicates whether the player is in the boss area */
  atBossArea = false;
  /** @type {boolean} Indicates whether the game was won */
  victory = false;
  /** @type {boolean} Indicates whether the game was lost */
  defeat = false;
  /** @type {Array} List of collected coins */
  collectedCoinsArray = [];
  /** @type {Array} List of active projectiles */
  projectiles = [];
  /** @type {Array} List of collected items */
  collectedItemsArray = [];

  /** @type {Object} Audio elements of the game world */
  audio = {
    coinPickup: new Audio('assets/sounds/collect coin.mp3'),
    itemPickup: new Audio('assets/sounds/collect bottle.mp3'),
  };

  /**
   * Creates a new GameWorld instance.
   * @param {HTMLCanvasElement} canvas - The canvas element on which to draw
   */
  constructor(canvas) {
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.inputManager = inputManager;
    this.registerAudio(this.audio);
    if (!stopGame) {
      this.draw();
      this.initializeWorld();
      this.startGameLoop();
    }
  }

  /**
   * Initializes the game world.
   */
  initializeWorld() {
    this.player.world = this;

    if (this.level && this.level.endboss && this.level.endboss.length > 0) {
      this.level.endboss.forEach((boss) => {
        if (boss instanceof BossEnemy) {
          boss.setWorld(this);
        }
      });
    }
  }

  /**
   * Starts the game loops for physics, collisions, and game state.
   */
  startGameLoop() {
    let physicsInterval = setInterval(() => {
      this.checkJumpAttacks();
    }, 1000 / 60);

    let collisionInterval = setInterval(() => {
      this.checkCollisions();
      this.trackPlayerPosition();
    }, 300);

    let gameStateInterval = setInterval(() => {
      this.checkProjectileThrow();
      this.checkCollectables();
      this.checkProjectileCollisions();
      this.checkWinLoseConditions();
    }, 100);

    intervalIds.push(physicsInterval, collisionInterval, gameStateInterval);
  }

  /**
   * Registers audio elements for global muting.
   * @param {Object} audioObject - Object with audio elements
   */
  registerAudio(audioObject) {
    Object.values(audioObject).forEach((sound) => {
      soundEffects.push(sound);
    });
  }

  /**
   * Displays the appropriate end screen.
   */
  showEndScreen() {
    if (this.defeat) {
      this.handleDefeat();
    } else if (this.victory) {
      this.handleVictory();
    }
  }

  /**
   * Handles the game loss.
   */
  // Neue Eigenschaften in GameWorld
  /** @type {boolean} Indicates whether the victory sound has already been played */
  victorySoundPlayed = false;
  /** @type {boolean} Indicates whether the defeat sound has already been played */
  defeatSoundPlayed = false;

  /**
   * Handles the game loss.
   */
  handleDefeat() {
    if (!this.defeatSoundPlayed) {
      audioManager.play('lose', 0.4);
      this.defeatSoundPlayed = true;
    }

    setTimeout(() => {
      this.endGame();
      showGameOverMenu();
      handleDeviceOrientation();
    }, 3000);

    document.querySelector('.gameControls').classList.add('d-none');
    this.addToRender(this.loseScreen);
    this.stopAudio();
    document.getElementById('mobileControlsContainer').classList.add('d-none');
  }

  /**
   * Handles the game victory.
   */
  handleVictory() {
    if (!this.victorySoundPlayed) {
      audioManager.play('win', 0.4);
      this.victorySoundPlayed = true;
    }

    setTimeout(() => {
      this.endGame();
      showGameOverMenu();
      handleDeviceOrientation();
    }, 3000);

    document.querySelector('.gameControls').classList.add('d-none');
    this.addToRender(this.winScreen);
    this.stopAudio();
    document.getElementById('mobileControlsContainer').classList.add('d-none');
  }

  /**
   * Checks if the game has been won or lost.
   */
  checkWinLoseConditions() {
    if (this.player.health <= 0) {
      this.defeat = true;
    } else if (
      this.level.endboss.length > 0 &&
      this.level.endboss[0].health <= 0
    ) {
      this.victory = true;
      console.log('SIEG ERKANNT!');
    }
  }

  /**
   * Ends the game and clears all intervals.
   */
  endGame() {
    for (let i = 1; i < 9999; i++) window.clearInterval(i);
    this.defeat = false;
    this.victory = false;
    stopGame = true;
  }

  /**
   * Checks for collectible objects.
   */
  checkCollectables() {
    this.collectCoins();
    this.collectItems();
  }

  /**
   * Collects coins.
   */
  collectCoins() {
    this.level.coins.forEach((coin, i) => {
      if (this.player.checkCollision(coin)) {
        this.collectedCoins++;
        this.coinCounter.updateDisplay(this.collectedCoins, this.totalCoins);
        this.level.coins.splice(i, 1);
        audioManager.play('coin', 0.3);
      }
    });
  }

  /**
   * Collects items (bottles).
   */
  collectItems() {
    this.level.bottles.forEach((bottle, i) => {
      if (this.player.checkCollision(bottle)) {
        this.collectedItems++;
        this.itemCounter.updateDisplay(this.collectedItems, this.totalItems);
        this.level.bottles.splice(i, 1);
        audioManager.play('bottle', 0.3);
      }
    });
  }

  /**
   * Checks if the player wants to and can throw a bottle.
   */
  checkProjectileThrow() {
    let currentTime = Date.now();
    if (
      this.inputManager.ACTION &&
      this.collectedItems > 0 &&
      currentTime - this.lastThrowTime >= this.throwCooldown
    ) {
      let direction = this.player.facing ? 'left' : 'right';
      let projectile = new ProjectileItem(
        this.player.x + 100,
        this.player.y + 100,
        direction
      );
      this.projectiles.push(projectile);
      this.collectedItems--;
      this.itemCounter.updateDisplay(this.collectedItems, this.totalItems);
      this.lastThrowTime = currentTime;
    }
  }

  /**
   * Checks and processes collisions between projectiles and game entities (end bosses and enemies).
   * This method goes through all active projectiles and detects collisions with bosses and regular enemies.
   * For bosses, 20% damage is applied, the health display is updated, and splash animations are triggered.
   * For regular enemies, they are immediately defeated and appropriate sound effects are played.
   * Projectiles and defeated enemies are removed after a short delay.
   *
   * @returns {void} This method does not return a value
   */
  checkProjectileCollisions() {
    this.projectiles.forEach((projectile) => {
      if (!projectile.isRemoved) {
        this.checkBossCollisions(projectile);

        if (!projectile.isRemoved) {
          this.checkEnemyCollisions(projectile);
        }
      }
    });
  }
  /**
   * Checks for collisions between a projectile and boss enemies.
   * If a collision is detected, handles the boss collision.
   *
   * @param {ProjectileItem} projectile - The projectile to check for collisions
   */
  checkBossCollisions(projectile) {
    this.level.endboss.forEach((boss) => {
      if (projectile.checkCollision(boss)) {
        this.handleBossCollision(projectile, boss);
      }
    });
  }
  /**
   * Handles the collision between a projectile and a boss.
   * Marks the projectile as removed, applies damage to the boss,
   * updates the boss health display, triggers splash animation,
   * and schedules the projectile for removal.
   *
   * @param {ProjectileItem} projectile - The projectile that collided with the boss
   * @param {BossEnemy} boss - The boss that was hit by the projectile
   */
  handleBossCollision(projectile, boss) {
    projectile.isRemoved = true;

    boss.takeDamage(40);

    this.updateBossHealthDisplay(boss);
    projectile.splashAnimation();

    this.scheduleProjectileRemoval(projectile);
  }
  /**
   * Updates the boss health display based on the current boss health.
   * Calculates the percentage of health remaining and updates the display.
   *
   * @param {BossEnemy} boss - The boss whose health display needs updating
   */
  updateBossHealthDisplay(boss) {
    this.bossHealthDisplay.setPercentage((boss.health / boss.maxHealth) * 100);
    console.log('Boss health:', boss.health, '/', boss.maxHealth);
  }
  /**
   * Checks for collisions between a projectile and regular enemies.
   * If a collision is detected and the enemy is not already defeated,
   * handles the enemy collision.
   *
   * @param {ProjectileItem} projectile - The projectile to check for collisions
   */
  checkEnemyCollisions(projectile) {
    this.level.enemies.forEach((enemy, enemyIndex) => {
      if (projectile.checkCollision(enemy) && !enemy.isJumpedOn) {
        this.handleEnemyCollision(projectile, enemy);
      }
    });
  }
  /**
   * Handles the collision between a projectile and an enemy.
   * Marks the projectile as removed, sets the enemy as defeated,
   * plays the appropriate sound, triggers splash animation,
   * and schedules both enemy and projectile for removal.
   *
   * @param {ProjectileItem} projectile - The projectile that collided with the enemy
   * @param {Enemy} enemy - The enemy that was hit by the projectile
   */
  handleEnemyCollision(projectile, enemy) {
    projectile.isRemoved = true;

    enemy.health = 0;
    enemy.isJumpedOn = true;

    this.playEnemyDefeatedSound(enemy);
    projectile.splashAnimation();

    this.scheduleEnemyAndProjectileRemoval(projectile, enemy);
  }
  /**
   * Plays the appropriate sound effect when an enemy is defeated.
   * Different sounds are played for different enemy types.
   *
   * @param {Enemy} enemy - The defeated enemy
   */
  playEnemyDefeatedSound(enemy) {
    if (enemy instanceof SmallEnemy) {
      audioManager.play('chick', 0.3);
    } else {
      audioManager.play('chicken', 0.3);
    }
  }
  /**
   * Schedules a projectile for removal after a short delay.
   * Finds the projectile in the projectiles array and removes it.
   *
   * @param {ProjectileItem} projectile - The projectile to be removed
   */
  scheduleProjectileRemoval(projectile) {
    setTimeout(() => {
      const index = this.projectiles.indexOf(projectile);
      if (index > -1) {
        this.projectiles.splice(index, 1);
      }
    }, 300);
  }
  /**
   * Schedules both a projectile and an enemy for removal after a short delay.
   * Finds both elements in their respective arrays and removes them.
   *
   * @param {ProjectileItem} projectile - The projectile to be removed
   * @param {Enemy} enemy - The enemy to be removed
   */
  scheduleEnemyAndProjectileRemoval(projectile, enemy) {
    setTimeout(() => {
      const projIndex = this.projectiles.indexOf(projectile);
      if (projIndex > -1) {
        this.projectiles.splice(projIndex, 1);
      }

      const enemyIndex = this.level.enemies.indexOf(enemy);
      if (enemyIndex > -1) {
        this.level.enemies.splice(enemyIndex, 1);
      }
    }, 300);
  }
  /**
   * Checks for collisions between player and enemies.
   */
  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.player.checkCollision(enemy) && !enemy.isJumpedOn) {
        this.player.takeDamage(10);
        this.healthDisplay.setPercentage(this.player.health);
      }
    });

    this.level.endboss.forEach((boss) => {
      if (this.player.checkCollision(boss)) {
        this.player.takeDamage(20);
        this.healthDisplay.setPercentage(this.player.health);
      }
    });
  }

  /**
   * Tracks the player's position to activate the boss.
   */
  trackPlayerPosition() {
    if (this.player.x > 2450) {
      this.atBossArea = true;

      if (this.level.endboss.length > 0) {
        this.level.endboss[0].enragedMode = true;
        this.level.endboss[0].firstContact = true;
      }
    }
  }

  /**
   * Displays the boss health bar when the player is in the boss area.
   */
  showBossHealthBar() {
    if (this.atBossArea == true) {
      this.addToRender(this.bossHealthDisplay);
    }
  }

  /**
   * Checks if the player is attacking enemies by jumping.
   */
  checkJumpAttacks() {
    this.level.enemies.forEach((enemy) => {
      if (this.isValidJumpAttack(enemy)) {
        this.handleJumpAttack(enemy);
      }
    });
  }
  /**
   * Determines if a jump attack on an enemy is valid.
   * Checks if the player is colliding with the enemy, is in the air,
   * is moving downward, and the enemy is not already defeated.
   *
   * @param {Enemy} enemy - The enemy to check for a valid jump attack
   * @returns {boolean} - True if the jump attack is valid, false otherwise
   */
  isValidJumpAttack(enemy) {
    return (
      this.player.checkCollision(enemy) &&
      this.player.isInAir() &&
      this.player.verticalSpeed < 0 &&
      !enemy.isJumpedOn
    );
  }
  /**
   * Handles a successful jump attack on an enemy.
   * Marks the enemy as defeated, schedules its removal,
   * plays the appropriate sound effect, and makes the player bounce.
   *
   * @param {Enemy} enemy - The enemy that was jump-attacked
   */
  handleJumpAttack(enemy) {
    enemy.isJumpedOn = true;
    this.scheduleEnemyRemoval(enemy);
    this.playDefeatSound(enemy);
    this.bounceAfterAttack();
  }
  /**
   * Schedules an enemy for removal after a short delay.
   * Finds the enemy in the enemies array and removes it.
   *
   * @param {Enemy} enemy - The enemy to be removed
   */
  scheduleEnemyRemoval(enemy) {
    setTimeout(() => {
      const index = this.level.enemies.indexOf(enemy);
      if (index > -1) {
        this.level.enemies.splice(index, 1);
      }
    }, 300);
  }
  /**
   * Plays the appropriate sound effect when an enemy is defeated by jumping.
   * Different sounds are played for different enemy types.
   *
   * @param {Enemy} enemy - The defeated enemy
   */
  playDefeatSound(enemy) {
    if (enemy instanceof SmallEnemy) {
      audioManager.play('chick', 0.3);
    } else {
      audioManager.play('chicken', 0.3);
    }
  }

  /**
   * Makes the player bounce back after an attack.
   */
  bounceAfterAttack() {
    if (this.player.y > 70) {
      this.player.verticalSpeed = 30; // Auf den regulären Sprungwert setzen
      this.player.y = 210; // Sicherstellen, dass der Spieler auf der richtigen Höhe landet
      audioManager.play('jump', 0.2);
    }
  }

  /**
   * Main drawing loop that renders all objects.
   */
  /**
   * Main drawing loop that renders all objects.
   */
  draw() {
    if (stopGame) {
      return;
    }

    this.clearCanvas();
    this.applyCamera();
    this.drawBackground();
    this.drawGameElements();
    this.resetCamera();
    this.drawUI();
    this.applyCamera();
    this.resetCamera();

    requestAnimationFrame(() => {
      this.draw();
    });
  }

  /**
   * Clears the canvas for the next frame.
   */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Applies the camera shift.
   */
  applyCamera() {
    this.ctx.translate(this.cameraX, 0);
  }

  /**
   * Resets the camera shift.
   */
  resetCamera() {
    this.ctx.translate(-this.cameraX, 0);
  }

  /**
   * Draws the background elements.
   */
  drawBackground() {
    this.addObjectsToRender(this.level.backgroundObjects);
  }

  /**
   * Draws all game elements.
   */
  drawGameElements() {
    this.addObjectsToRender(this.level.coins);
    this.addObjectsToRender(this.level.bottles);
    this.addToRender(this.player);
    this.addObjectsToRender(this.level.clouds);
    this.addObjectsToRender(this.level.enemies);
    this.addObjectsToRender(this.level.endboss);

    this.projectiles = this.projectiles.filter((obj) => !obj.isRemoved);
    this.addObjectsToRender(this.projectiles);
  }

  /**
   * Draws the UI elements.
   */
  drawUI() {
    this.addToRender(this.healthDisplay);
    this.addToRender(this.coinCounter);
    this.addToRender(this.itemCounter);
    this.showBossHealthBar();
    this.showEndScreen();
  }

  /**
   * Renders multiple objects.
   * @param {Array} objects - Array of objects to render
   */
  addObjectsToRender(objects) {
    objects.forEach((object) => {
      this.addToRender(object);
    });
  }

  /**
   * Renders a single object.
   * @param {VisualElement} object - The object to render
   */
  addToRender(object) {
    if (object.facing) {
      this.flipImage(object);
    }
    object.draw(this.ctx);

    if (object.facing) {
      this.flipImageBack(object);
    }
  }

  /**
   * Stops all audio playback.
   */
  stopAudio() {
    setTimeout(() => {
      this.audioActive = false;
    }, 3000);
  }

  /**
   * Flips an object horizontally.
   * @param {VisualElement} object - The object to flip
   */
  flipImage(object) {
    this.ctx.save();
    this.ctx.translate(object.width, 0);
    this.ctx.scale(-1, 1);
    object.x = object.x * -1;
  }

  /**
   * Restores the original orientation after flipping.
   * @param {VisualElement} object - The object whose flipping is being undone
   */
  flipImageBack(object) {
    object.x = object.x * -1;
    this.ctx.restore();
  }
}
