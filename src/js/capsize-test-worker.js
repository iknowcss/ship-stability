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
  const [w, A, h, steps] = e.data;
  log('worker receive data:', {w, A, h, steps});
  const result = isCapsize(w, A, h, steps);
  log('worker result:', result.capsize ? 'capsize' : 'no capsize');
  postMessage(result);
};

function isCapsize(w, A, h, steps) {
  // System of equations
  var tY = [0, [0, 0]];
  var force = function (t) { return A*Math.sin(t); };
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