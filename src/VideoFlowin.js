import Calculator from './Calculator';

export default class VideoFlowin {
  constructor(props) {
    const { element, quality } = props;
    this.element = element;
    this.calculator = new Calculator({
      quality: quality,
      width: this.element.width,
      height: this.element.height,
    });

    this.state = {
      capturing: false,
    };

    this.callbacks = [];
    this.updateBind = this.update.bind(this);
  }

  start() {
    const { capturing } = this.state;
    if (!capturing) {
      const width = this.element.width;
      const height = this.element.height;
      this.canvas = document.createElement('canvas');
      this.context = this.canvas.getContext('2d');
      this.state.capturing = true;
      this.update();
    }
  }

  stop() {
    const { capturing } = this.state;
    if (capturing) {
      this.state.capturing = false;
      cancelAnimationFrame(this.loopId);
    }
  }

  update() {
    const { capturing } = this.state;
    if (capturing) {
      this.loopId = requestAnimationFrame(this.updateBind);
      const pixels = this.getCurrentPixels();
      if  (this.lastPixels && pixels) {
        const flow = this.calculator.processNew(this.lastPixels, pixels);
        this.processCallbacks(flow);
      }
      this.lastPixels = pixels;
    }
  }

  processCallbacks(flow) {
    for (let i = 0; i < this.callbacks.length; i++) {
      const callback = this.callbacks[i];
      callback(flow);
    }
  }

  getCurrentPixels() {
    const width = this.element.videoWidth;
    const height = this.element.videoHeight;
    this.canvas.width = width;
    this.canvas.height = height;

    if (width && height) {
      this.context.drawImage(this.element, 0, 0);
      const image = this.context.getImageData(0, 0, width, height);
      return image.data;
    }
  }

  onCalculated(callback) {
    this.callbacks.push(callback);
  }

}
