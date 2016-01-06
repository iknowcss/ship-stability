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
    this.canvasCtx.moveTo(this.origin[0] + p0[0]*this.scale[0], this.origin[1] + p0[1]*this.scale[1]);
    this.canvasCtx.lineTo(this.origin[0] + p1[0]*this.scale[0], this.origin[1] + p1[1]*this.scale[1]);
    this.canvasCtx.stroke();
  }
};

}());