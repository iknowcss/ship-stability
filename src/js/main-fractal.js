const hsv2rgb = require('./hsv2rgb');
const PointGrid = require('./point-grid');
const PointWorkerPool = require('./point-worker-pool');
const once = require('lodash/function/once');

require('../style/fractal.scss');

if (!window.Worker) {
  alert('Error: This platform does not support Web Workers');
  throw 'This platform does not support Web Workers';
}

// let workerPool = new PointWorkerPool({ enableLogging: true });
let workerPool = new PointWorkerPool();

let wDomain = {
  min: 0,
  max: 2,
  step: 0.02
};

let aDomain = {
  min: 0.2,
  max: 1,
  step: 0.02
};

let grid = new PointGrid(wDomain, aDomain);
let h = 0.001;
let steps = 5000;

document.getElementById('the-button').addEventListener('click', function () {
  if (workerPool.isIdle()) {
    workerPool.run(grid, h, steps);  
  }
});

function capsizeColor(stepsC) {
  const normStepDelta = (steps - stepsC)/steps;
  const { r, g, b } = hsv2rgb((60*2)*(1 - 1/(normStepDelta + 1)), 1, 1);
  return `rgb(${r}, ${g}, ${b})`;
}

// Canvas
let pixelSize = 5;
let { x: gridX, y: gridY, x0: gridX0, y0: gridY0 } = grid.getGridDimensions();
let canvasWidth = gridX * pixelSize;
let canvasHeight = gridY * pixelSize;
let canvas = document.getElementById('fractal-canvas');
let canvasCtx = canvas.getContext('2d');
canvas.width = canvasWidth;
canvas.height = canvasHeight;
workerPool.on('result', results => {
  results.forEach(r => {
    let { point, result } = r;
    let {x: gridX, y: gridY} = grid.getGridPointById(point.id);
    let x = pixelSize*(gridX - gridX0);
    let y = canvasHeight - pixelSize*(gridY - gridY0 + 1);
    let color = result.capsize ? capsizeColor(result.steps) : '#000000';
    canvasCtx.fillStyle = color;
    canvasCtx.fillRect(x, y, pixelSize, pixelSize);
  });
});