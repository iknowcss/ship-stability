(function () {

'use strict';

var ball = document.getElementById('ball');

var F = [
  (t, Y) => Y[1],
  (t, Y) => -200 * Y[0] - 5 * Y[1]
];

var Y0 = [-150, 0];
var tY = [0, Y0];
setInterval(function () {
  tY = rk4(F, tY, 0.0001, 100);
  ball.style.top = ((tY[1][0] >> 0) + 150) + 'px';
}, 10);

document.addEventListener('click', function () {
  tY = [0, Y0];
});

}());