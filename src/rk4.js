function rk4(F, tY, h, steps) {
  var i;

  if (steps > 1) {
    for (i = 0; i < steps; i++) {
      tY = rk4(F, tY, h);
    }
    return tY;
  }

  var f = (t, Y) => F.map(f => f(t, Y));
  var t = tY[0];
  var Y = tY[1];
  var K1, K2, K3, K4;
  K1 = f(t, Y),
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
  var lenI = arguments.length;
  var lenJ = arguments[0].length;
  var result = vectorize(0, lenJ);
  var i, j, X;
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
  return Array.apply(null, Array(o)).map(Number.prototype.valueOf, s);
}