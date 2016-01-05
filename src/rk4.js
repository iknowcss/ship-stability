(function () {

'use strict';

window.rk4 = rk4;

function rk4(F, tY, h, steps) {
  let i;

  if (steps > 1) {
    for (i = 0; i < steps; i++) {
      tY = rk4(F, tY, h);
    }
    return tY;
  }

  let f = (t, Y) => F.map(f => f(t, Y));
  let t = tY[0];
  let Y = tY[1];
  let K1 = f(t, Y),
      K2 = f(t + h/2, vectorAdd(Y, scalarMultiply(h/2, K1))),
      K3 = f(t + h/2, vectorAdd(Y, scalarMultiply(h/2, K2))),
      K4 = f(t + h, vectorAdd(Y, scalarMultiply(h, K3)));

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
}

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
  return X.map(x => x * s);
}

function vectorize(s, o) {
  return new Float64Array(o).fill(s);
}

}());