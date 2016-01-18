precision mediump float;

varying vec2 v_coord;

void color_encode_steps(in int steps, out vec3 rgb) {
  int r = steps/65536;
  int g = (steps - r*65536)/256;
  int b = steps - r*65536 - g*256;

  rgb = vec3(float(r)/256.0, float(g)/256.0, float(b)/256.0);
}

void color_wheel(in float hue, out vec3 rgb) {
  float x;
  if (0.0 <= hue && hue < 60.0) {
    x = 1.0 - hue/60.0;
    rgb = vec3(1.0, x, 0.0);
  } else if (hue < 120.0) {
    x = (hue - 60.0)/60.0;
    rgb = vec3(x, 1.0, 0.0);
  } else if (hue < 180.0) {
    x = 1.0 - (hue - 120.0)/60.0;
    rgb = vec3(0.0, 1.0, x);
  } else if (hue < 240.0) {
    x = (hue - 180.0)/60.0;
    rgb = vec3(0.0, x, 1.0);
  } else if (hue < 300.0) {
    x = 1.0 - (hue - 240.0)/60.0;
    rgb = vec3(x, 0.0, 1.0);
  } else if (hue < 360.0) {
    x = (hue - 300.0)/60.0;
    rgb = vec3(1.0, 0.0, x);
  } else {
    rgb = vec3(0.0, 0.0, 0.0);
  }
}

void color_step_ratio(in int steps, in int max_steps, out vec3 rgb) {
  if (steps == max_steps) {
    rgb = vec3(0.0, 0.0, 0.0);
  } else {
    float ratio = float(steps)/float(max_steps);
    color_wheel(60.0*(1.0 - ratio), rgb);
  } 
}

void main() {
  float w = v_coord.x;
  float a = v_coord.y;

  float b = 0.05;
  float h = 0.001;
  float h2 = h/2.0;
  float t = 0.0;
  const int max_steps = 60000;

  vec2 k0 = vec2(0.0, 0.0);
  vec2 k1, k1P, k2, k2P, k3, k3P, k4;
  int steps = 0;
  for (int i = 0; i < max_steps; i++) {
    k1 = vec2( k0.y,  -b*k0.y  - k0.x +   k0.x*k0.x + a*sin(w*t));
    k1P = k0 + h2*k1;
    k2 = vec2(k1P.y, -b*k1P.y - k1P.x + k1P.x*k1P.x + a*sin(w*(t + h2)));
    k2P = k0 + h2*k2;
    k3 = vec2(k2P.y, -b*k2P.y - k2P.x + k2P.x*k2P.x + a*sin(w*(t + h2)));
    k3P = k0 + h*k3;
    k4 = vec2(k3P.y, -b*k3P.y - k3P.x + k3P.x*k3P.x + a*sin(w*(t + h)));

    t += h;
    k0 += (h/6.0)*(k1 + 2.0*(k2 + k3) + k4);

    steps++;
    if (k0.x >= 1.0) break;
  }

  vec3 rgb;
  color_step_ratio(steps, max_steps, rgb);
  gl_FragColor = vec4(rgb, 1);
}