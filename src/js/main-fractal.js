const PointGenerator = require('./point-generator');
const once = require('lodash/function/once');

if (!window.Worker) {
  alert('Error: This platform does not support Web Workers');
  throw 'This platform does not support Web Workers';
}

var generator = new PointGenerator({
  min: 0,
  max: 5000,
  step: 100
}, {
  min: 0,
  max: 5000,
  step: 100
});

var workerId = 0;
var finishedWorkers = 0;

var startTime,
    endTime;

function PointWorker(h, steps) {
  var self = this;
  var worker = new Worker('capsize-test-worker.js');

  this.workerId = ++workerId;

  worker.onmessage = function (e) {
    var { points } = e.data; 
    // console.log(`Worker ${self.workerId} finished`, points);

    processNext();
  };

  function processNext() {
    if (generator.hasNext()) {
      var points = generator.nextN(Math.ceil(2601 / 8));
      worker.postMessage({ points, h, steps });
    } else {
      if (++finishedWorkers >= workerId) {
        endTime = window.performance.now();
        let delta = (endTime - startTime).toFixed(2);
        console.log(`Done: ${delta}ms`);
      }
    }
  }

  this.run = function () {
    if (!startTime) {
      console.log('Starting');
      startTime = window.performance.now();
    }
    processNext();
  };
}

let h = 0.001;
let steps = 5000;
let workers = [
  new PointWorker(h, steps),
  new PointWorker(h, steps),
  // new PointWorker(h, steps),
  // new PointWorker(h, steps)
]

document.getElementById('the-button').addEventListener('click', once(() => workers.forEach(w => w.run())));