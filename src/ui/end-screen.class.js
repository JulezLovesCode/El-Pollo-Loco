/**
 * Represents an end screen that is displayed after the game ends.
 * This screen is used to visualize the game result and
 * play corresponding audio feedback, depending on whether the player has won or lost.
 *
 * @extends VisualElement
 * @property {Object} audio - An object that contains the audio files for the end screens.
 * @property {Audio} audio.win_sound - The audio file that is played upon victory.
 * @property {Audio} audio.lose_sound - The audio file that is played upon defeat.
 */
class EndScreen extends VisualElement {
  audio = {
    win_sound: new Audio('assets/sounds/win sound.mp3'),
    lose_sound: new Audio('assets/sounds/lose sound.mp3'),
  };

  /**
   * Creates a new end screen with fixed dimensions.
   *
   * @param {string} imagePath - The path to the image file of the end screen.
   * @param {number} x - The X-coordinate for positioning the end screen.
   * @param {number} y - The Y-coordinate for positioning the end screen.
   */
  constructor(imagePath, x, y) {
    super();
    this.loadImage(imagePath);
    this.x = x;
    this.y = y;
    this.width = 720;
    this.height = 480;
    this.registerAudio(this.audio);
  }
}
