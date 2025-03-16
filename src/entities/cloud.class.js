/**
 * Represents a cloud object that moves horizontally across the screen.
 * The cloud starts at a random X position and moves continuously to the left.
 * When the cloud leaves the left edge of the screen, it appears again at the right edge.
 *
 * @extends VisualElement
 * @property {number} y - The vertical position of the cloud, default is 20 pixels.
 * @property {number} width - The width of the cloud, default is 500 pixels.
 * @property {number} height - The height of the cloud, default is 250 pixels.
 * @property {number} speed - The movement speed of the cloud, default is 0.15 pixels per frame.
 */
class Cloud extends VisualElement {
  y = 20;
  width = 500;
  height = 250;
  speed = 0.15;

  /**
   * Creates a new cloud object with a random X position and starts the animation.
   * The cloud image is loaded from the specified resource.
   */
  constructor() {
    super();
    this.loadImage('./assets/images/5_background/layers/4_clouds/1.png');
    this.x = Math.random() * 500;
    this.animate();
  }

  /**
   * Initiates the continuous movement of the cloud to the left.
   * The cloud moves at the defined speed and appears again at the right edge
   * of the screen (x = 720) when it leaves the left edge.
   * The animation runs at approximately 60 FPS.
   */
  animate() {
    setInterval(() => {
      this.x -= this.speed;
      if (this.x < -this.width) {
        this.x = 720;
      }
    }, 1000 / 60);
  }
}
