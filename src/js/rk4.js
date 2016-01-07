function rk4(F, tY, h, steps) {
  var i = 0;

  if (steps > 1) {
    for (i = 0; i < steps; i++) {
      tY = rk4(F, tY, h);
    }
    return tY;
  }

  var t = tY[0];
  var Y = tY[1] instanceof Float64Array ? tY[1] : new Float64Array(tY[1]);
  var K1 = vectorF(F, t, Y);
  var K2 = vectorF(F, t + h/2, vectorAdd(Y, scalarMultiply(h/2, K1)));
  var K3 = vectorF(F, t + h/2, vectorAdd(Y, scalarMultiply(h/2, K2)));
  var K4 = vectorF(F, t + h, vectorAdd(Y, scalarMultiply(h, K3)));

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
    var len = F.length;
    var result = new Float64Array(len);
    var i = 0;
    for (; i < len; i++) {
      result[i] = F[i](t, Y);
    }
    return result;
  }

}

/// - Util functions ---------------------------------------------------------

function vectorAdd() {
  var lenI = arguments.length;
  var lenJ = arguments[0].length;
  var result = vectorize(0, lenJ);
  var i = 0;
  var j = 0;
  var X = arguments[0];
  for (; i < lenI; i++) {
    X = arguments[i];
    for (; j < lenJ; j++) {
      result[j] += X[j];
    }
  }
  return result;
}

function scalarMultiply(s, X) {
  var len = X.length;
  var r = new Float64Array(len);
  var i = 0;
  for (; i < len; i++) {
    r[i] = s*X[i];
  }
  return r;
}

function vectorize(s, o) {
  return new Float64Array(o).fill(s);
}

/// - Export -------------------------------------------------------------------

window.rk4 = rk4;
