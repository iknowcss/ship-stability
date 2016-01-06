(function () {

'use strict';

window.phaseCanvas = {
  scale: [1, 1],

  origin: [150, 75],

  canvasCtx: document.getElementById('phase-portrait').getContext('2d'),

  setScale(x, y) {
    this.scale = [x, y];
  },

  drawSegment(p0, p1) {
    this.canvasCtx.beginPath();

    let x0 = this.origin[0] + p0[0]*this.scale[0],
        y0 = this.origin[1] + p0[1]*this.scale[1],
        x1 = this.origin[0] + p1[0]*this.scale[0],
        y1 = this.origin[1] + p1[1]*this.scale[1];
    this.canvasCtx.moveTo(x0, y0);
    this.canvasCtx.lineTo(x1, y1);

    this.canvasCtx.stroke();
  }
};

}());