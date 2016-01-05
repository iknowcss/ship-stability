(function () {

'use strict';

var ball = document.getElementById('ball');

var F = [
  (t, y) => -10 * y
];
var Y0 = [300];
var tY = [0, Y0];
setInterval(function () {
  tY = rk4(F, tY, 0.0001, 100);
  ball.style.top = (tY[1][0] >> 0) + 'px';
}, 10);

document.addEventListener('click', function () {
  tY = [0, Y0];
});

}());