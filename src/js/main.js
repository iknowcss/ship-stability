(function () {

'use strict';

let sq = x => Math.pow(x, 2);

let ship = document.getElementById('ship');

// Initial conditions
// let Y0 = [0, -0.59];
let Y0 = [0, -0.5915];

// Coefficients
let b = 0.01;
let w = 1;
let a = 0.01;
let maxAngle = 100;

// System of equations
// let force = t => a*Math.sin(w*t);
let force = t => 0;
let F = [
  (t, Y) => Y[1],
  (t, Y) => -b*Y[1] - Y[0] + sq(Y[0]) + force(t)
];

let simInterval;
function stopSim() {
  clearInterval(simInterval);
}

function runSim() {
  stopSim();
  let tY = [0, Y0];
  let Y = Y0;
  let angle;
  let prevY;
  simInterval = setInterval(function () {
    prevY = Y;
    tY = rk4(F, tY, 0.001, 100);
    Y = tY[1];
    angle = Y[0] * 90;

    // Stop the simulation if capsized
    if (angle > maxAngle) {
      angle = maxAngle;
      stopSim();
    }

    // Orient ship
    ship.style.transform = `rotate(${angle}deg)`;

    // Draw phase portrait line
    window.phaseCanvas.setScale(100, 100);
    window.phaseCanvas.drawSegment(prevY, Y);
  }, 10);
}

document.addEventListener('dblclick', stopSim);
runSim();

}());