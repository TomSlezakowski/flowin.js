# Flowin.js

### A basic ES6 class to generate optical flow vectors from video. Fast and efficient, Flowin.js seeks to use minimal resources and memory footprint while remaining mobile compatible.

## Built with
- [GPU.js](https://github.com/gpujs/gpu.js/)
- [Webpack](https://github.com/webpack/webpack)

## Usage
There are a couple of ways to use this library, via script inclusion;
```
  <script src="./dist/flowin.js"></script>
  <script type="javascript">
    const app = new Flowin.Camera({
      element: document.querySelector('.camera-input'),
      quality: 4,
      callback: gotFlow,
    });

    app.start();

    function gotFlow(flow) {
      // Do something with the flow result.
    }
  </script>
```
or
```
  import { Camera as FlowinCamera } from 'flowin.js'
  const flowin = new FlowinCamera({
    element: document.querySelector('.camera-input'),
    quality: 32,
    callback: (flow) => {
      // Do something.
    },
  });
  flowin.start();
```

## Development
If you have any fixes, suggestions or just want to add something to this lib, feel free. To run the project;
Using Node 10.16.0, `npm install` then `npm run dev`.

To run a minified production build, just run `npm run build`

## Examples
Within the [examples](examples/) directory, there are two basic demo's showing how to build for webcam vs video processing.

## Issues
Please post any and all issues [here](https://github.com/TomSlezakowski/flowin/issues)

