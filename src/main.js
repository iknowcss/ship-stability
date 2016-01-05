(function () {

'use strict';

let sq = x => Math.pow(x, 2);

let ball = document.getElementById('ball');

// Initial conditions
let Y0 = [-.50, 0];

// Coefficients
let b = 0.001;
let scale = [ 150, 1 ];

// System of equations
let F = [
  (t, Y) => Y[1],
  (t, Y) => -b*Y[1] - Y[0] + sq(Y[0])
];

let tY = [0, Y0];
setInterval(function () {
  tY = rk4(F, tY, 0.001, 100);
  ball.style.top = ((scale[0] * tY[1][0]) >> 0) + 'px';
}, 10);

document.addEventListener('click', function () {
  tY = [0, Y0];
});

}());