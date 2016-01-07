'use strict';

require('../style/phase.scss');

const PhaseCanvas = require('./phase-canvas');
const rk4 = require('./rk4');
const sq = x => x*x;

let canvasElement = document.getElementById('phase-portrait');
let ship = document.getElementById('ship');
let phaseCanvas = new PhaseCanvas(canvasElement);

/// - Initialise ---------------------------------------------------------------

// Run simulation path with initial conditions from click
phaseCanvas.addClickListener(co => {
  runSim([ co.x/200, co.y/200 ]);
});

// Pause simulation on document double-click
document.addEventListener('dblclick', stopSim);

// Coefficients
let b = 0.01;
let w = 1;
let a = 0.06;
let maxAngle = 90;

// System of equations
let Y0 = [0, -0.5915]
let force = t => 0;
let F = [
  (t, Y) => Y[1],
  (t, Y) => -b*Y[1] - Y[0] + sq(Y[0]) + force(t)
];

/// - Simulation functions -----------------------------------------------------

let simInterval;
function stopSim() {
  clearInterval(simInterval);
}

function runSim(Y0) {
  stopSim();
  let tY = [0, Y0];
  let Y = Y0;
  let angle;
  let prevY;
  simInterval = setInterval(function () {
    prevY = Y;
    tY = rk4(F, tY, 0.001, 50);
    Y = tY[1];
    angle = Y[0] * 90;

    // Stop the simulation if capsized
    if (angle > maxAngle) {
      angle = maxAngle;
      if (angle > 2 * maxAngle) {
        stopSim();
      }
    }

    // Orient ship
    ship.style.transform = `rotate(${angle}deg)`;

    // Draw phase portrait line
    phaseCanvas.setScale(200, 200);
    phaseCanvas.drawSegment(prevY, Y);
  }, 5);
}

/// - Start the simulation -----------------------------------------------------

runSim(Y0);