(function () {

'use strict';

var ball = document.getElementById('ball');

var Y0 = [0, 300];
var Y = Y0;
setInterval(function () {
  Y = rk4((t, y) => -10 * y, Y, 0.0001, 100);
  ball.style.top = (Y[1] >> 0) + 'px';
}, 10);

document.addEventListener('click', function () {
  Y = Y0;
});

}());