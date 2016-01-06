(function () {

'use strict';

let sq = x => Math.pow(x, 2);

let ship = document.getElementById('ship');

// Initial conditions
// let Y0 = [0, -0.72];
let Y0 = [0, 0];

// Coefficients
let b = 0.01;
let w = 1;
let a = 0.01;

// System of equations
let force = t => a*Math.sin(w*t);
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
  let angle;
  simInterval = setInterval(function () {
    tY = rk4(F, tY, 0.001, 100);
    angle = tY[1][0] * 90;
    if (angle > 90) {
      angle = 90;
      stopSim();
    }
    ship.style.transform = `rotate(${angle}deg)`;
    
  }, 10);
}

document.addEventListener('click', runSim);
runSim();

}());