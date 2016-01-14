import FractalCanvas from './fractal-canvas';
import Domain from 'src/js/util/domain';
import PointGrid from './point-grid';
import formatMs from 'src/js/util/format-ms';

const PointWorkerPool = require('./point-worker-pool');
const once = require('lodash/function/once');

require('src/style/fractal.scss');

const canvasElement = document.getElementById('fractal-canvas');
const fractalCanvas = new FractalCanvas(canvasElement, { scale: 10 });
const domain = new Domain([0, 2], [0, 1]);
const grid = new PointGrid(fractalCanvas, domain);
const h = 0.001;
const maxSteps = 5000;

const workerPool = new PointWorkerPool();

let workerPoolStart;
document.getElementById('the-button').addEventListener('click', function () {
  if (workerPool.isIdle()) {
    workerPoolStart = window.performance.now();
    workerPool.run(grid, h, maxSteps);  
  }
});

workerPool
  .on('result', results => {
    const data = results.map(r => {
      const { point, result } = r;
      const { x, y } = grid.getGridPointById(point.id);
      const { capsize, steps } = result;

      return { 
        x, y, capsize, 
        stepRatio: (maxSteps - steps)/maxSteps 
      };
    });

    fractalCanvas.render(data);
  })
  .on('done', () => {
    const deltaMs = window.performance.now() - workerPoolStart;
    document.getElementById('fractal-timer').textContent = `Done in ${formatMs(deltaMs)}`;
  });