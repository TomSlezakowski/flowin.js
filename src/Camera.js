import VideoFlowin from './VideoFlowin';

export class Camera {
  constructor(props) {
    this.params = Object.assign({
      quality: 4,
      element: false,
      facing: 'user',
      callback: false,
    }, props);

    this.state = {
      capturing: false,
      currentFlow: null
    };

    this.videoSource = null;

    this._onCameraConnected = (stream) => {
      const flowBind = this._onFlowReceived.bind(this);
      this.state.capturing = true;

      if ("srcObject" in this.videoElement) {
        this.videoElement.srcObject = stream;
      } else {
        this.videoElement.src = window.URL.createObjectURL(stream);
      }
      if (stream) {
        this.videoElement.play();
        this.state.currentFlow.start();
        this.state.currentFlow.onCalculated(flowBind);
      }
    }

    this._onFlowReceived = (flow) => {
      const { callback } = this.params;
      if (callback) {
        callback(flow);
      }
    }

    this._onWebCamError = (error) => {
      console.warn('Error capturing WebCam device.', error);
    }

    this._startCapture = () => {
      const { currentFlow } = this.state;

      if (currentFlow === null) {
        const elem = this.params.element || window.document.createElement('video');
        elem.setAttribute('autoplay', true);
        this.videoElement = elem;
        const flowParams = {
          element: elem,
          quality: this.params.quality,
        };
        const flow = new VideoFlowin(flowParams);
        this.state.currentFlow = flow;
      }

      if (window.MediaStreamTrack.getSources) {
        window.MediaStreamTrack.getSources((sources) => {
          for (let i = 0; i < sources.length; i++) {
            const { facing, kind } = sources[i];
            if (kind === 'video'){
              this.videoSource = sourceInfos[i].id;
              if (facing === this.props.facing) {
                  break;
              }
            }
          }

          const mediaProps = {
            video: {
              optional: [{
                sourceId: this.videoSource,
              }]
            },
          };
          navigator.mediaDevices.getUserMedia(mediaProps)
            .then(this._onCameraConnected.bind(this))
            .catch(this._onWebCamError.bind(this));
        });
      } else if(navigator.mediaDevices.enumerateDevices) {
        navigator.mediaDevices.enumerateDevices().then((sources) => {
          for (let i = 0; i < sources.length; i++) {
            const { kind, deviceId } = sources[i];
            if(kind == "videoinput"){
              this.videoSource = deviceId;
            }
          }

          const mediaProps = {
            video: {
              optional: [{
                sourceId: this.videoSource,
              }]
            },
          };
          navigator.mediaDevices.getUserMedia(mediaProps)
            .then(this._onCameraConnected.bind(this))
            .catch(this._onWebCamError.bind(this));
        });
      }
    }

    this._stopCapture = () => {

    }
  }

  start() {
    const { capturing } = this.state;
    if (!capturing) {
      this._startCapture();
    }
  }

  stop() {
    const { capturing } = this.state;
    if (capturing) {
      this.state.capturing = false;
      this._stopCapture();
    }
  }
}
