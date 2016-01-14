'use strict';

require('src/style/phase.scss');

var PhaseCanvas = require('./phase-canvas');
var rk4 = require('src/js/util/rk4');

var canvasElement = document.getElementById('phase-portrait');
var ship = document.getElementById('ship');
var phaseCanvas = new PhaseCanvas(canvasElement);

/// - Initialise ---------------------------------------------------------------

// Run simulation path with initial conditions from click
phaseCanvas.addClickListener(function (co) {
  runSim([ co.x/200, co.y/200 ]);
});

// Pause simulation on document double-click
document.addEventListener('dblclick', stopSim);

// Coefficients
var b = 0.05;
var w = 0.8;
var a = .05;
var maxAngle = 90;

// System of equations
var Y0 = [0, -0.62];
var force = function (t) { return 0; };
var sq = function (x) { return x*x; };
var F = [
  function (t, Y) { return Y[1]; },
  function (t, Y) { return -b*Y[1] - Y[0] + sq(Y[0]) + force(t); }
];

/// - Simulation functions -----------------------------------------------------

var simInterval;
function stopSim() {
  clearInterval(simInterval);
}

function runSim(Y0) {
  stopSim();
  var tY = [0, Y0];
  var Y = Y0;
  var angle;
  var prevY;
  simInterval = setInterval(function () {
    prevY = Y;
    tY = rk4(F, tY, 0.001, 25);
    Y = tY[1];
    angle = Y[0]*90;

    // Stop the simulation if capsized
    if (angle > maxAngle) {
      angle = maxAngle;
      if (angle > 2*maxAngle) {
        stopSim();
      }
    }

    // Orient ship
    var transformString = 'rotate(' + angle + 'deg)';
    ship.style.transform = transformString;
    ship.style.webkitTransform = transformString;
    
    // Draw phase portrait line
    phaseCanvas.setScale(200, 200);
    phaseCanvas.drawSegment(prevY, Y);
  }, 5);
}

/// - Start the simulation -----------------------------------------------------

runSim(Y0);