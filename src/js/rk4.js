(function () {

'use strict';

function rk4(F, tY, h, steps) {
  let i;

  if (steps > 1) {
    for (i = 0; i < steps; i++) {
      tY = rk4(F, tY, h);
    }
    return tY;
  }

  let t = tY[0];
  let Y = tY[1];
  let K1 = vectorF(F, t, Y),
      K2 = vectorF(F, t + h/2, vectorAdd(Y, scalarMultiply(h/2, K1))),
      K3 = vectorF(F, t + h/2, vectorAdd(Y, scalarMultiply(h/2, K2))),
      K4 = vectorF(F, t + h, vectorAdd(Y, scalarMultiply(h, K3)));

  return [
    t + h,
    vectorAdd(Y, 
      scalarMultiply(h/6,
        vectorAdd(
          K1, 
          scalarMultiply(2, K2), 
          scalarMultiply(2, K3), 
          K4
        )
      ) 
    )
  ];

  function vectorF(F, t, Y) {
    const len = F.length;
    const result = new Float64Array(len);
    for (let i = 0; i < len; i++) {
      result[i] = F[i](t, Y);
    }
    return result;
  }

}

/// - Util functions ---------------------------------------------------------

function vectorAdd() {
  let lenI = arguments.length;
  let lenJ = arguments[0].length;
  let result = vectorize(0, lenJ);
  let i, j, X;
  for (i = 0; i < lenI; i++) {
    X = arguments[i];
    for (j = 0; j < lenJ; j++) {
      result[j] += X[j];
    }
  }
  return result;
}

function scalarMultiply(s, X) {
  let len = X.length,
      r = new Float64Array(len);
  for (let i = 0; i < len; i++) {
    r[i] = s*X[i];
  }
  return r;
}

function vectorize(s, o) {
  return new Float64Array(o).fill(s);
}

/// - Export -------------------------------------------------------------------

window.rk4 = rk4;

}());