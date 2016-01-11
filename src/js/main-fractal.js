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
  step: 0.05
};

let aDomain = {
  min: 0,
  max: 1,
  step: 0.05
};

let grid = new PointGrid(wDomain, aDomain);
let h = 0.001;
let steps = 5000;

document.getElementById('the-button').addEventListener('click', function () {
  if (workerPool.isIdle()) {
    workerPool.run(grid, h, steps);  
  }
});


// Canvas
let { x: gridX, y: gridY } = grid.getGridDimensions();
let pixelSize = 10;
let canvasWidth = gridX * pixelSize;
let canvasHeight = gridY * pixelSize;
let canvas = document.getElementById('fractal-canvas');
let canvasCtx = canvas.getContext('2d');
canvas.width = canvasWidth;
canvas.height = canvasHeight;
workerPool.on('result', results => {
  results.forEach(r => {
    let { point, result } = r;
    if (result.capsize) {
      let {x: gridX, y: gridY} = grid.getGridPointById(point.id);
      let x = pixelSize*gridX;
      let y = canvasHeight - pixelSize*(gridY + 1);

      console.log(x, y)

      canvasCtx.fillRect(x, y, pixelSize, pixelSize);
    }
  });
});