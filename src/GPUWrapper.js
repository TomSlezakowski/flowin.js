import { GPU } from 'gpu.js';

class GPUWrapper {
  constructor() {
    this.gpu = new GPU();
  }
}

export default new GPUWrapper();
