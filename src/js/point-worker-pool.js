const defer = require('lodash/function/defer');

const WORKER_COUNT = 2;
const WORKER_SRC = 'capsize-test-worker.js';

function PointWorkerPool(options = {}) {
  this.workerCount = WORKER_COUNT;
  this.workers = new Array(this.workerCount);
  this.idle = true;
  this.idleCount = this.workerCount;
  this.handlers = {};
  for (var i = 0; i < this.workerCount; i++) {
    this.workers[i] = new PointWorker(this, i + 1, WORKER_SRC);
  }

  function log(a, b) {
    if (!options.enableLogging) return;
    if (b) {
      console.log(a, b);
    } else {
      console.log(a);
    }
  }

  log('[PointWorkerPool] Initialized workers:', this.workerCount);

  this.isIdle = () => this.idle;

  this.run = (grid, h, steps) => {
    if (!this.idle) {
      throw `WorkerPool is not idle!`;
    }
    this.idle = false;
    this.runParams = { grid, h, steps };

    log('[PointWorkerPool] run');
    this.workers.forEach(w => this.startWorker(w));
  };

  this.handleIdleWorker = (worker) => {
    log('[PointWorkerPool] worker idle id:', worker.id);

    this.idleCount++;
    this.startWorker(worker);

    if (this.idleCount === this.workerCount) {
      this.idle = true;
      log('[PointWorkerPool] worker pool idle');
    }
  };

  this.startWorker = (worker) => {
    var { grid, h, steps } = this.runParams;
    var points;

    if (grid.hasMorePoints()) {
      log('[PointWorkerPool] points available; start worker id:', worker.id);
      points = this.nextGridPoints(5);
      worker.process(points, h, steps);
      this.idleCount--;
    } else {
      log('[PointWorkerPool] no more points; leave idle worker id:', worker.id);
    }
  };

  this.nextGridPoints = (n) => {
    let { grid } = this.runParams;
    let result = [];
    for (let i = 0; grid.hasMorePoints() && i < n; i++) {
      result.push(grid.getNextPoint());
    }
    return result;
  };

  this.on = (type, handler) => {
    if (!(this.handlers[type] instanceof Array)) {
      this.handlers[type] = [];
    }
    this.handlers[type].push(handler);
  };

  this.trigger = (type, data) => {
    var eventHandlers;
    if (!(this.handlers[type] instanceof Array)) {
      return;
    }
    this.handlers[type].forEach(fn => fn(data));
  };

  this.handlePointResult = (worker, points) => {
    log('[PointWorkerPool] receive result from worker id:', worker.id);
    defer(() => this.trigger('result', points));
  };
}

function PointWorker(pool, id, src) {
  this.pool = pool;
  this.id = id;
  this.worker = new Worker(src);
  this.idle = true;

  this.worker.onmessage = (e) => {
    var { points } = e.data;
    this.idle = true;
    this.pool.handlePointResult(this, points);
    this.pool.handleIdleWorker(this);
  };

  this.process = (points, h, steps) => {
    if (!this.idle) {
      throw `Worker ${this.id} is not idle!`;
    }
    this.idle = false;
    this.worker.postMessage({ points, h, steps });
  };
}

module.exports = PointWorkerPool;