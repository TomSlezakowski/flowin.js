# Flowin.js

## Usage
Flowin.js is a basic ES6 module to generate optical flow vectors for video.

There are a couple of ways to use this library, via script inclusion;
```
  <script src="./dist/flowin.js"></script>
  <script type="javascript">
    const app = new Flowin.Camera({
      element: videoElement,
      quality: 4,
      callback: gotFlow,
    });

    function gotFlow(flow) {
      // Do something with the flow result.
    }
  </script>
```
or
```import * from 'flowin'```

