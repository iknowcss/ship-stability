export default class {
  constructor(canvas, domain) {
    this.canvas = canvas;
    this.domain = domain;
    this.reset();
  }

  reset() {
    const { width, height } = this.canvas.getDimensions();
    this.width = width;
    this.height = height;

    const { x: xStep, y: yStep } = this.canvas.getStepSize(this.domain);
    this.xStep = xStep;
    this.yStep = yStep;
    this.xLen = Math.floor(this.domain.getDelta(0)/xStep);
    this.yLen = Math.floor(this.domain.getDelta(1)/yStep);

    this.pointId = 0;
    this.pointMap = new Array(this.xLen * this.yLen);
    this.xInt = 0;
    this.yInt = 0;
  }

  hasMorePoints() {
    return this.pointId < this.pointMap.length;
  }

  getNextPoint() {
    const x = this.xInt*this.xStep;
    const y = this.yInt*this.yStep;
    const result = { id: this.pointId, x, y };
    this.pointMap[this.pointId] = { x: this.xInt, y: this.yInt };

    this.pointId++;
    this.xInt++;
    if (this.xInt >= this.xLen) {
      this.xInt = 0;
      this.yInt++;
    }

    return result;
  }

  getGridPointById(id) {
    return this.pointMap[id];
  }
}