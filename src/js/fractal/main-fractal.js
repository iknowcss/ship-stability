import FractalCanvas from './fractal-canvas';
import Domain from 'src/js/util/domain';
import PointGrid from './point-grid';
import formatMs from 'src/js/util/format-ms';

const PointWorkerPool = require('./point-worker-pool');
const once = require('lodash/once');
const camelCase = require('lodash/camelCase');
const { h } = require('src/js/standard-coefficients');

require('src/style/fractal.less');

const canvasElement = document.getElementById('fractal-canvas');
const fractalCanvas = new FractalCanvas(canvasElement);
const domain = new Domain([0, 2], [0, 0.5]);
const grid = new PointGrid(fractalCanvas, domain);
const maxSteps = 60000;

/// - Elements

const elIds = [
  'parameters-resolution-select',
  'parameters-start-button',
  'fractal-timer'
];
const el = {};
elIds.forEach(id => {
  el[camelCase(id)] = document.getElementById(id);
});

const parameterInputs = [
  el.parametersStartButton,
  el.parametersResolutionSelect,
];
function disableInputs() {
  parameterInputs.forEach(e => e.setAttribute('disabled', 'disabled'));
}

function enableInputs() {
  parameterInputs.forEach(e => e.removeAttribute('disabled'));
}

/// - Worker pool

const workerPool = new PointWorkerPool();

let workerPoolStart;
el.parametersStartButton.addEventListener('click', function () {
  if (workerPool.isIdle()) {
    const scale = parseInt(el.parametersResolutionSelect.value, 10);
    fractalCanvas.setScale(scale);
    // Have to manually reset here. Maybe refactor so that 
    // the fractal canvas notifies listeners of scale change?
    grid.reset();

    disableInputs();
    el.parametersStartButton.textContent = 'Processing...';
    el.fractalTimer.innerHTML = '';
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
    enableInputs();
    el.parametersStartButton.textContent = 'Push the button';

    const deltaMs = window.performance.now() - workerPoolStart;
    el.fractalTimer.innerHTML = `Done in <b>${formatMs(deltaMs)}</b>`;
  });