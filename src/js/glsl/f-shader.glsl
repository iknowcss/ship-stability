precision mediump float;

varying vec2 v_coord;

// |Red    |Green  | Blue
// mmmmmmmmseeeee??seeeee??
// xxxxyyyyxxxxxx  yyyyyy  

// if exponent is 0b00000
// (m)*(2^(-([2^(ebitcount-1)-1]+mbitcount)))
// else 
// (m+2^(ebitcount-1))*(2^(-([2^(ebitcount-1)-1]+mbitcount)+e))

void color_encode_state(in vec2 state, out vec3 rgb) {
  int sx = 0;
  if (state.x < 0.0) sx = 1;

  int sy = 0;
  if (state.y < 0.0) sy = 1;

  int mx;
  if (state.x < )

  int r = 0;
  int g = sx*128;
  int b = sy*128;
  rgb = vec3(float(r)/256.0, float(g)/256.0, float(b)/256.0);
}

void main() {
  float w = v_coord.x;
  float a = v_coord.y;

  float b = 0.05;
  float h = 0.01;
  float h2 = h/2.0;
  float t = 0.0;
  const int max_steps = 1000;

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
    if (k0.x >= 1.0) {
      k0.x = 1.0;
      break;
    }
  }

  vec3 rgb;
  color_encode_state(k0, rgb);
  gl_FragColor = vec4(rgb, 1);
}