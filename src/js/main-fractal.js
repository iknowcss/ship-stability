const PointGenerator = require('./point-generator');
const PointWorkerPool = require('./point-worker-pool');
const once = require('lodash/function/once');

if (!window.Worker) {
  alert('Error: This platform does not support Web Workers');
  throw 'This platform does not support Web Workers';
}

let workerPool = new PointWorkerPool();

workerPool.on('result', points => {
  console.log(points);
});

let generator = new PointGenerator({
  min: 0,
  max: 5000,
  step: 100
}, {
  min: 0,
  max: 5000,
  step: 100
});
let h = 0.001;
let steps = 5000;

document.getElementById('the-button').addEventListener('click', function () {
  if (workerPool.isIdle()) {
    workerPool.run(generator, h, steps);  
  }
});