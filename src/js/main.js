(function () {

'use strict';

let phaseCanvas = new window.PhaseCanvas(document.getElementById('phase-portrait'));

let sq = x => Math.pow(x, 2);

let ship = document.getElementById('ship');

// Coefficients
let b = 0.01;
let w = 1;
let a = 0.01;
let maxAngle = 90;

// System of equations
// let force = t => a*Math.sin(w*t);
let force = t => 0;
let F = [
  (t, Y) => Y[1],
  (t, Y) => -b*Y[1] - Y[0] + sq(Y[0]) + force(t)
];

// Listen to clicks to the canvas
phaseCanvas.addClickListener(co => {
  runSim([ co.x/200, co.y/200 ]);
});

let simInterval;
function stopSim() {
  clearInterval(simInterval);
}

function runSim(Y0) {
  console.log(Y0);
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

document.addEventListener('dblclick', stopSim);
runSim([0, -0.5915]);

}());