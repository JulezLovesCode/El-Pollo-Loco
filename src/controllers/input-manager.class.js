/**
 * Manages the input states for the game.
 * Supports both keyboard and touch inputs.
 * @class
 */
class InputManager {
  /**
   * Status of the left key/movement
   * @type {boolean}
   */
  LEFT = false;

  /**
   * Status of the right key/movement
   * @type {boolean}
   */
  RIGHT = false;

  /**
   * Status of the up key/movement
   * @type {boolean}
   */
  UP = false;

  /**
   * Status of the down key/movement
   * @type {boolean}
   */
  DOWN = false;

  /**
   * Status of the space key (jumping)
   * @type {boolean}
   */
  SPACE = false;

  /**
   * Status of the action key (e.g., throwing)
   * @type {boolean}
   */
  ACTION = false;

  /**
   * Status for short inactivity phase
   * @type {boolean}
   */
  idle = false;

  /**
   * Status for longer inactivity phase
   * @type {boolean}
   */
  longIdle = false;

  /**
   * Initializes the InputManager and sets up keyboard and touch listeners.
   * @constructor
   */
  constructor() {
    this.initKeyboardListeners();
    this.initTouchListeners();
  }

  /**
   * Initializes event listeners for keyboard inputs.
   * Detects arrow keys, space bar, and D key for game actions.
   */
  initKeyboardListeners() {
    console.log('Initializing keyboard listeners');
    this.setupKeyDownListener();
    this.setupKeyUpListener();
  }
  /**
   * Sets up the keydown event listener to detect when keys are pressed.
   * Handles direction keys, space key, and action key press events.
   */
  setupKeyDownListener() {
    document.addEventListener('keydown', (e) => {
      console.log('Key pressed:', e.code, e.key, e.keyCode);
      this.handleDirectionKeysDown(e);
      this.handleSpaceKeyDown(e);
      this.handleActionKeyDown(e);
      this.preventDefaultForSpace(e);
    });
  }
  /**
   * Sets up the keyup event listener to detect when keys are released.
   * Handles direction keys, space key, and action key release events.
   */
  setupKeyUpListener() {
    document.addEventListener('keyup', (e) => {
      this.handleDirectionKeysUp(e);
      this.handleSpaceKeyUp(e);
      this.handleActionKeyUp(e);
      this.preventDefaultForSpace(e);
    });
  }
  /**
   * Handles directional key press events.
   * Updates the corresponding direction property to true when a direction key is pressed.
   *
   * @param {KeyboardEvent} e - The keyboard event object
   */
  handleDirectionKeysDown(e) {
    if (e.code === 'ArrowRight') this.RIGHT = true;
    if (e.code === 'ArrowLeft') this.LEFT = true;
    if (e.code === 'ArrowUp') this.UP = true;
    if (e.code === 'ArrowDown') this.DOWN = true;
  }
  /**
   * Handles directional key release events.
   * Updates the corresponding direction property to false when a direction key is released.
   *
   * @param {KeyboardEvent} e - The keyboard event object
   */
  handleDirectionKeysUp(e) {
    if (e.code === 'ArrowRight') this.RIGHT = false;
    if (e.code === 'ArrowLeft') this.LEFT = false;
    if (e.code === 'ArrowUp') this.UP = false;
    if (e.code === 'ArrowDown') this.DOWN = false;
  }
  /**
   * Handles space key press events.
   * Updates the SPACE property to true when the space key is pressed.
   * Multiple detection methods are used for cross-browser compatibility.
   *
   * @param {KeyboardEvent} e - The keyboard event object
   */
  handleSpaceKeyDown(e) {
    if (e.code === 'Space' || e.key === ' ' || e.keyCode === 32) {
      this.SPACE = true;
      console.log('Space detected, SPACE set to', this.SPACE);
    }
  }
  /**
   * Handles space key release events.
   * Updates the SPACE property to false when the space key is released.
   * Multiple detection methods are used for cross-browser compatibility.
   *
   * @param {KeyboardEvent} e - The keyboard event object
   */
  handleSpaceKeyUp(e) {
    if (e.code === 'Space' || e.key === ' ' || e.keyCode === 32) {
      this.SPACE = false;
      console.log('Space released, SPACE set to', this.SPACE);
    }
  }
  /**
   * Handles action key press events.
   * Updates the ACTION property to true when the D key is pressed.
   *
   * @param {KeyboardEvent} e - The keyboard event object
   */
  handleActionKeyDown(e) {
    if (e.code === 'KeyD') this.ACTION = true;
  }
  /**
   * Handles action key release events.
   * Updates the ACTION property to false when the D key is released.
   *
   * @param {KeyboardEvent} e - The keyboard event object
   */
  handleActionKeyUp(e) {
    if (e.code === 'KeyD') this.ACTION = false;
  }
  /**
   * Prevents the default browser behavior for space key events.
   * This stops the page from scrolling when space is pressed.
   *
   * @param {KeyboardEvent} e - The keyboard event object
   */
  preventDefaultForSpace(e) {
    if (e.code === 'Space' || e.keyCode === 32) {
      e.preventDefault();
    }
  }

  /**
   * Initializes event listeners for touch inputs.
   * Supports mobile controls for left, right, jumping, and actions.
   */
  initTouchListeners() {
    this.setupButtonHandlers();
  }
  /**
   * Sets up handlers for all mobile touch buttons.
   * Configures touch and mouse event handlers for movement, jumping, and action buttons.
   */
  setupButtonHandlers() {
    this.addTouchHandler('mobileLeftButton', 'LEFT');
    this.addTouchHandler('mobileRightButton', 'RIGHT');
    this.addTouchHandler('mobileJumpButton', 'SPACE');
    this.addTouchHandler('mobileThrowButton', 'ACTION');
  }
  /**
   * Adds touch and mouse event handlers to a specific button element.
   *
   * @param {string} elementId - The HTML ID of the button element
   * @param {string} property - The corresponding property to update (LEFT, RIGHT, SPACE, or ACTION)
   */
  addTouchHandler(elementId, property) {
    const element = document.getElementById(elementId);
    if (!element) return;

    this.setupTouchEvents(element, property);
    this.setupMouseEvents(element, property);
  }
  /**
   * Sets up touch event handlers for a button element.
   *
   * @param {HTMLElement} element - The button element
   * @param {string} property - The corresponding property to update
   */
  setupTouchEvents(element, property) {
    element.addEventListener(
      'touchstart',
      (e) => {
        e.preventDefault();
        this[property] = true;
        console.log(`Touch ${property} set to true`);
      },
      { passive: false }
    );

    this.setupTouchEndEvent(element, property);
  }
  /**
   * Sets up the touch end event handler for a button element.
   *
   * @param {HTMLElement} element - The button element
   * @param {string} property - The corresponding property to update
   */
  setupTouchEndEvent(element, property) {
    element.addEventListener(
      'touchend',
      (e) => {
        e.preventDefault();
        this[property] = false;
        console.log(`Touch ${property} set to false`);
      },
      { passive: false }
    );
  }
  /**
   * Sets up all mouse event handlers for a button element.
   *
   * @param {HTMLElement} element - The button element
   * @param {string} property - The corresponding property to update
   */
  setupMouseEvents(element, property) {
    this.setupMouseDownEvent(element, property);
    this.setupMouseUpEvent(element, property);
    this.setupMouseLeaveEvent(element, property);
  }
  /**
   * Sets up the mouse down event handler for a button element.
   *
   * @param {HTMLElement} element - The button element
   * @param {string} property - The corresponding property to update
   */
  setupMouseDownEvent(element, property) {
    element.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this[property] = true;
      console.log(`Mouse ${property} set to true`);
    });
  }
  /**
   * Sets up the mouse up event handler for a button element.
   *
   * @param {HTMLElement} element - The button element
   * @param {string} property - The corresponding property to update
   */
  setupMouseUpEvent(element, property) {
    element.addEventListener('mouseup', (e) => {
      e.preventDefault();
      this[property] = false;
      console.log(`Mouse ${property} set to false`);
    });
  }
  /**
   * Sets up the mouse leave event handler for a button element.
   * Ensures the property is reset when the cursor leaves the button.
   *
   * @param {HTMLElement} element - The button element
   * @param {string} property - The corresponding property to update
   */
  setupMouseLeaveEvent(element, property) {
    element.addEventListener('mouseleave', (e) => {
      this[property] = false;
    });
  }
}
