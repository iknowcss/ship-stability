function rk4(f, Y, h, steps) {
  var i;
  if (steps > 1) {
    for (i = 0; i < steps; i++) {
      Y = rk4(f, Y, h);
    }
    return Y;
  }

  var t = Y[0],
      y = Y[1],
      k1 = f(t, y),
      k2 = f(t + h/2, y + k1*h/2),
      k3 = f(t + h/2, y + k2*h/2),
      k4 = f(t + h, y + k3*h);

  return [
    t + h,
    y + (h/6)*(k1 +2*k2 + 2*k3 + k4)
  ];
}