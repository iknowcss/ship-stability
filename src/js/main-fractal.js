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

var startTime,
    endTime;

function PointWorker(h, steps) {
  var self = this;
  var worker = new Worker('capsize-test-worker.js');

  this.workerId = ++workerId;

  worker.onmessage = function (e) {
    var { points } = e.data;
    // console.log(`Worker ${self.workerId}: finished`);
    processNext();
  };

  function processNext() {
    if (generator.hasNext()) {
      var points = generator.nextN(5);
      worker.postMessage({ points, h, steps });
    } else {
      if (!endTime) {
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

document.getElementById('the-button').addEventListener('click', once(function () {
  new PointWorker(h, steps).run();
  new PointWorker(h, steps).run();
  new PointWorker(h, steps).run();
  new PointWorker(h, steps).run();
}));