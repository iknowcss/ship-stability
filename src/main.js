(function () {

'use strict';

let ball = document.getElementById('ball');

// Initial conditions
let Y0 = [-150, 0];

// Coefficients
let b = 5;

// System of equations
let F = [
  (t, Y) => Y[1],
  (t, Y) => -100*Y[0] - b*Y[1]
];

let tY = [0, Y0];
setInterval(function () {
  tY = rk4(F, tY, 0.0001, 100);
  ball.style.top = (tY[1][0] >> 0) + 'px';
}, 10);

document.addEventListener('click', function () {
  tY = [0, Y0];
});

}());