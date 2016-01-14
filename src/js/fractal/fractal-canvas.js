import map from 'lodash/collection/map';

const COLOR_NO_CAPSIZE = '#000000';
const HUE_CAPSIZE_MIN = 0;
const HUE_CAPSIZE_MAX = 60;
const colorize = require('./colorize');

export default class {
  constructor(canvasElement, options = {}) {
    this.canvasElement = canvasElement;
    this.context2d = canvasElement.getContext('2d');
    this.width = canvasElement.width;
    this.height = canvasElement.height;

    this.setScale(options.scale || 1);
  }

  setScale(scale) {
    this.scale = scale;
  }

  getStepSize(domain) {
    return {
      x: this.scale*domain.getDelta(0)/this.width,
      y: this.scale*domain.getDelta(1)/this.height
    };
  }

  getDimensions() {
    return { 
      width: this.width,
      height: this.height
    };
  }

  render(cellData) {
    cellData.forEach(d => this.renderCell(d));
  }

  renderCell({ x, y, capsize, stepRatio }) {
    this.count = (this.count || 0) + 1;

    const canvasX = this.scale*x;
    const canvasY = this.height - this.scale*(y + 1);
    const color = capsize 
      ? colorize.rational(HUE_CAPSIZE_MIN, HUE_CAPSIZE_MAX, stepRatio)
      : COLOR_NO_CAPSIZE;

    this.context2d.fillStyle = color;
    this.context2d.fillRect(canvasX, canvasY, this.scale, this.scale);
  }
}