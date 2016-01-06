(function () {

'use strict';

function PhaseCanvas(canvasCtx) {
  this.scale = [1, 1];
  this.origin = [300, 150];
  this.canvasCtx = canvasCtx;

  this.canvasCtx.scale(2, 2);
}

Object.assign(PhaseCanvas.prototype, {
  setScale(x, y) {
    this.scale = [x, y];
  },

  drawSegment(p0, p1) {
    let x0 = this.origin[0] + p0[0]*this.scale[0],
        y0 = this.origin[1] + p0[1]*this.scale[1],
        x1 = this.origin[0] + p1[0]*this.scale[0],
        y1 = this.origin[1] + p1[1]*this.scale[1];

    this.canvasCtx.beginPath();
    this.canvasCtx.moveTo(x0, y0);
    this.canvasCtx.lineTo(x1, y1);
    this.canvasCtx.stroke();
  }
});


let canvas = document.getElementById('phase-portrait');
window.phaseCanvas = new PhaseCanvas(canvas.getContext('2d'));

}());