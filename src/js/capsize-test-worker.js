const rk4 = require('./rk4');
const sq = function (x) { return x*x; };

const enableLogging = false;

function log(a, b) {
  if (!enableLogging) return;
  if (b) {
    console.log(a, b);
  } else {
    console.log(a);
  }
}

log('worker loaded');

// Coefficients
var b = 0.01;
var maxAngle = 100;

onmessage = function (e) {
  const { points, h, steps } = e.data;
  log('worker receive data:', { points, h, steps });
  const result = points.map(point => ({
    point,
    result: isCapsize(point, h, steps)
  }));
  log('worker done');
  postMessage(result);
};

function isCapsize(point, h, steps) {
  // System of equations
  var a = point.x/1000;
  var w = point.y/1000;
  var tY = [0, [0, 0]];
  var force = function (t) { return a*Math.sin(w*t); };
  var F = [
    function (t, Y) { return Y[1]; },
    function (t, Y) { return -b*Y[1] - Y[0] + sq(Y[0]) + force(t); }
  ];

  var angle;
  var capsize = false;
  for (var i = 0; i < steps; i++) {
    tY = rk4(F, tY, h);
    angle = tY[1][0]*90;
    if (angle > maxAngle) {
      capsize = true;
      break;
    }
  }

  return { capsize, steps: i } ;
}