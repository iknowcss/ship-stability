(function () {

'use strict';

let sq = x => Math.pow(x, 2);

let ship = document.getElementById('ship');

// Initial conditions
let Y0 = [-.50, 0];

// Coefficients
let b = 0.001;

// System of equations
let F = [
  (t, Y) => Y[1],
  (t, Y) => -b*Y[1] - Y[0] + sq(Y[0])
];

let tY = [0, Y0];
let angle;
setInterval(function () {
  tY = rk4(F, tY, 0.001, 100);
  angle = tY[1][0] * 90;
  ship.style.transform = `rotate(${angle}deg)`;
}, 10);

document.addEventListener('click', function () {
  tY = [0, Y0];
});

}());