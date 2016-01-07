'use strict';

const rk4 = require('../src/js/rk4');
const sq = x => Math.pow(x, 2);

function printStatus(fn) {
  switch(%GetOptimizationStatus(fn)) {
    case 1: console.log('Function is optimized'); break;
    case 2: console.log('Function is not optimized'); break;
    case 3: console.log('Function is always optimized'); break;
    case 4: console.log('Function is never optimized'); break;
    case 6: console.log('Function is maybe deoptimized'); break;
    case 7: console.log('Function is optimized by TurboFan'); break;
    default: console.log('Unknown optimization status'); break;
  }
}

/// - Setup --------------------------------------------------------------------

// Coefficients
const b = 0.01;
const w = 1;
const a = 0.06;

// Initial conditions and forcing functions
const Y0 = [0, 0];
const force = t => a*Math.sin(w*t);

// Equations of motion
const F = [
  (t, Y) => Y[1],
  (t, Y) => -b*Y[1] - Y[0] + sq(Y[0]) + force(t)
];

let tY = [0, Y0];

/// - Testing ------------------------------------------------------------------

// Fill type-info
rk4(F, tY, 0.001);
// 2 calls are needed to go from uninitialized -> pre-monomorphic -> monomorphic
rk4(F, tY, 0.001);

%OptimizeFunctionOnNextCall(rk4);
// The next call
rk4(F, tY, 0.001);

// Check
printStatus(rk4);