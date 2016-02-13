'use strict';

var extend = require('lodash/extend');

function PhaseCanvas(canvas) {
  var self = this;

  this.canvas = canvas;
  this.scale = [1, 1];
  this.origin = [300, 150];
  this.canvasCtx = this.canvas.getContext('2d');
  this.clickListeners = [];

  this.canvasCtx.scale(2, 2);

  var eventName = 'click';
  if ('ontouchstart' in document.documentElement) {
    eventName = 'touchstart';
  }

  this.canvas.addEventListener(eventName, function (e) {
    let coords = getClickCoords(self.canvas, e),
        x = coords.x - self.origin[0],
        y = coords.y - self.origin[1];
    self.clickListeners.forEach(fn => fn({ x, y }))
  });
}

extend(PhaseCanvas.prototype, {
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
  },

  addClickListener(fn) {
    this.clickListeners.push(fn);
  }
});

function getClickCoords(canvas, e) {
  // http://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element
  var totalOffsetX = 0;
  var totalOffsetY = 0;
  var canvasX = 0;
  var canvasY = 0;
  var currentElement = canvas;

  do {
    totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
    totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
  }
  while (currentElement = currentElement.offsetParent);

  canvasX = e.pageX - totalOffsetX - document.body.scrollLeft;
  canvasY = e.pageY - totalOffsetY - document.body.scrollTop;

  return { x: canvasX, y: canvasY };
}

module.exports = PhaseCanvas;