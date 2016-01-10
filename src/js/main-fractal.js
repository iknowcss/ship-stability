if (!window.Worker) {
  alert('Error: This platform does not support Web Workers');
  throw 'This platform does not support Web Workers';
}

var worker = new Worker('capsize-test-worker.js');