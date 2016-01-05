function rk4(F, tY, h, steps) {
  var i;
  if (steps > 1) {
    for (i = 0; i < steps; i++) {
      tY = rk4(F, tY, h);
    }
    return tY;
  }

  var f = F[0],
      t = tY[0],
      Y = tY[1],
      y = Y[0],
      k1 = f(t, y),
      k2 = f(t + h/2, y + k1*h/2),
      k3 = f(t + h/2, y + k2*h/2),
      k4 = f(t + h, y + k3*h);

  return [
    t + h,
    [y + (h/6)*(k1 +2*k2 + 2*k3 + k4)]
  ];
}