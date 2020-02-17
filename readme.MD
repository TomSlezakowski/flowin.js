# Flowin.js

## Usage
Flowin.js is a basic ES6 module to generate optical flow vectors for video.

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

  ## Development
  If you have any fixes, suggestions or just want to add something to this lib, feel free. To run the project;
  Using Node 10.16.0, `npm install` then `npm run dev`.

  To run a minified production build, just run `npm run build`

  ## Issues
  Please post any and all issues [https://github.com/TomSlezakowski/flowin/issues](here)

