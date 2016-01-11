const PointGrid = require('./point-grid');
const PointWorkerPool = require('./point-worker-pool');
const once = require('lodash/function/once');

if (!window.Worker) {
  alert('Error: This platform does not support Web Workers');
  throw 'This platform does not support Web Workers';
}

// let workerPool = new PointWorkerPool({ enableLogging: true });
let workerPool = new PointWorkerPool();

workerPool.on('result', points => {
  console.log(points);
});

let grid = new PointGrid({
  min: 0,
  max: 2,
  step: 0.1
}, {
  min: 0,
  max: 2,
  step: 0.1
});
let h = 0.001;
let steps = 1;

document.getElementById('the-button').addEventListener('click', function () {
  if (workerPool.isIdle()) {
    workerPool.run(grid, h, steps);  
  }
});