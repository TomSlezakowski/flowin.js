import FlowinZone from './FlowinZone';
import GPUWrapper from './GPUWrapper';

export default class Calculator {
  constructor(props) {
    const { quality, width, height } = props;
    this.quality = quality;
    this.width = width;
    this.height = height;

    this.zones = [];
    for (let y = 0; y < this.height; y += this.quality) {
      for (let x = 0; x < this.width; x += this.quality) {
        const arr = new Float32Array(4);
        arr[0] = x;
        arr[1] = y;
        arr[2] = 1;
        arr[3] = 1;
        this.zones.push(arr);
      }
    }

    this.kernel = GPUWrapper.gpu.createKernel((lastPixels, pixels, zones, quality, width) => {
      const x = zones[this.thread.x][0];
      const y = zones[this.thread.x][1];
      let A2 = 0;
      let A1B2 = 0;
      let B1 = 0;
      let C1 = 0;
      let C2 = 0;
      let u = 0;
      let v = 0;

      for (let localY = -quality; localY <= quality; localY++) {
        for (let localX = -quality; localX <= quality; localX++) {
          const address = (y + localY) * width + x + localX;
          const gradX = (pixels[(address - 1) * 4]) - (pixels[(address + 1) * 4]);
          const gradY = (pixels[(address - width) * 4]) - (pixels[(address + width) * 4]);
          const gradT = (lastPixels[address * 4]) - (pixels[address * 4]);
          A2 += gradX * gradX;
          A1B2 += gradX * gradY;
          B1 += gradY * gradY;
          C2 += gradX * gradT;
          C1 += gradY * gradT;
        }
      }

      const delta = (A1B2 * A1B2 - A2 * B1);
      if (delta !== 0) {
        /* system is not singular - solving by Kramer method */
        const iDelta = quality / delta;
        const deltaX = -(C1 * A1B2 - C2 * B1);
        const deltaY = -(A1B2 * C2 - A2 * C1);

        u = deltaX * iDelta;
        v = deltaY * iDelta;
      } else {
        /* singular system - find optical flow in gradient direction */
        const norm = (A1B2 + A2) * (A1B2 + A2) + (B1 + A1B2) * (B1 + A1B2);
        if (norm !== 0) {
          const iGradNorm = quality / norm;
          const temp = -(C1 + C2) * iGradNorm;

          u = (A1B2 + A2) * temp;
          v = (B1 + A1B2) * temp;
        }
      }

      if (-quality > u && u > quality &&
          -quality > v && v > quality) {
          u = 10;
          v = 10;
      }

      // let uu = 0;
      // let vv = 0;
      // for (let i = 0; i < temp.length; i++) {
      //   const [x, y, u, v] = temp[i];
      //   // console.log(u, v);
      //   if (-this.quality < u && u < this.quality &&
      //     -this.quality < v && v < this.quality) {
      //     uu += u;
      //     vv += v;
      //   }
      // }
      // uu /= this.zones.length;
      // vv /= this.zones.length;
      // if (v < 0.2 && v > -0.2) {
      //   v = 10;
      //   u = 10;
      // }
     return [x, y, u, v]
    }).setOutput([this.zones.length]).setTactic('balanced');
  }

  processNew(lastPixels, pixels) {
    return this.kernel(lastPixels, pixels, this.zones, this.quality, this.width);
  }

  process(lastPixels, pixels) {
    let u, v;
    let uu, vv = 0;

    for (let i = 0; i < this.zones.length; i++) {
      const zone = this.zones[i];
      let A2 = 0;
      let A1B2 = 0;
      let B1 = 0;
      let C1 = 0;
      let C2 = 0;

      for (let localY = -this.quality; localY <= this.quality; localY++) {
        for (let localX = -this.quality; localX <= this.quality; localX++) {
          const address = (zone[1] + localY) * this.width + zone[0] + localX;
          const gradX = (pixels[(address - 1) * 4]) - (pixels[(address + 1) * 4]);
          const gradY = (pixels[(address - this.width) * 4]) - (pixels[(address + this.width) * 4]);
          const gradT = (lastPixels[address * 4]) - (pixels[address * 4]);

          A2 += gradX * gradX;
          A1B2 += gradX * gradY;
          B1 += gradY * gradY;
          C2 += gradX * gradT;
          C1 += gradY * gradT;
        }
      }

      const delta = (A1B2 * A1B2 - A2 * B1);
      if (delta !== 0) {
        /* system is not singular - solving by Kramer method */
        const iDelta = this.quality / delta;
        const deltaX = -(C1 * A1B2 - C2 * B1);
        const deltaY = -(A1B2 * C2 - A2 * C1);

        u = deltaX * iDelta;
        v = deltaY * iDelta;
      } else {
        /* singular system - find optical flow in gradient direction */
        const norm = (A1B2 + A2) * (A1B2 + A2) + (B1 + A1B2) * (B1 + A1B2);
        if (norm !== 0) {
          const iGradNorm = this.quality / norm;
          const temp = -(C1 + C2) * iGradNorm;

          u = (A1B2 + A2) * temp;
          v = (B1 + A1B2) * temp;
        } else {
          u = v = 0;
        }
      }

      if (-this.quality < u && u < this.quality &&
          -this.quality < v && v < this.quality) {
            uu += u;
            vv += v;

      } else {
        // u = -1;
        // v = -1;
      }


      this.zones[i][2] = u;
      this.zones[i][3] = v;
    }

    return {
      zones: this.zones,
      u: uu / this.zones.length,
      v: vv / this.zones.length
    };
  }
}
