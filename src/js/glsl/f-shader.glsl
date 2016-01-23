precision mediump float;

varying vec2 v_coord;

const int max_steps = 6000;
const float b = 0.05;
const float h = 0.001;
const float h2 = h/2.0;

const int c_ebitcount = 5;
const int c_mbitcount = 6;
const int c_maxexp = int(exp2(float(c_ebitcount - 1))) - 1;
const float c_minposvalue = exp2(float(-(c_maxexp - 1) - c_mbitcount));
const float c_maxposvalue = exp2(float(c_maxexp - c_mbitcount))*(exp2(float(c_mbitcount + 1)) - 1.0);

void color_encode_state(in vec2 full_state, out vec3 rgb) {
  // Truncate to fit within max/min values

  vec2 state = full_state;
  if (abs(state.x) < c_minposvalue)
    state.x = 0.0;
  else if (abs(state.x) > c_maxposvalue)
    state.x = sign(state.x)*c_maxposvalue;
  if (abs(state.y) < c_minposvalue)
    state.y = 0.0;
  else if (abs(state.y) > c_maxposvalue)
    state.y = sign(state.y)*c_maxposvalue;

  /// - Sign -------------------------------------------------------------------

  vec2 s = vec2(0, 0);
  if (state.x < 0.0) s.x = 1.0;
  if (state.y < 0.0) s.y = 1.0;
  int sx = int(s.x);
  int sy = int(s.y);

  // Now that we know the sign, make the state positive so that
  // other functions work properly (e.g. log2)
  state = abs(state);

  /// - Exponent ---------------------------------------------------------------

  vec2 expn = floor(log2(state));
  int expnx = int(expn.x);
  int expny = int(expn.y);
  int ex = expnx + c_maxexp;
  int ey = expny + c_maxexp;

  /// - Mantissa ---------------------------------------------------------------

  vec2 m = (state*exp2(-expn) - 1.0)*exp2(float(c_mbitcount));
  int mx = int(m.x);
  int my = int(m.y);

  /// - Encode in RGB (24 bits) ------------------------------------------------

  // 12-bit float
  // s|eeeee|mmmmmm

  // |Red    |Green  | Blue
  // seeeeemmmmmmseeeeemmmmmm
  // rrrrrrrrggggggggbbbbbbbb
  // 765432107654321076543210

  int mxr = int(floor(exp2(-4.0)*float(mx)));
  int eyg = int(floor(exp2(-2.0)*float(ey)));

  int r = 128*sx + 4*ex + mxr;
  int g = 16*(mx - mxr*16) + 8*sy + eyg;
  int b = 64*(ey - eyg*4) + my;

  rgb = vec3(float(r)/255.0, float(g)/255.0, float(b)/255.0);
}

void main() {
  float w = v_coord.x;
  float a = v_coord.y;
  float t = 0.0;

  vec2 k0 = vec2(0.0, 0.0);
  vec2 k1, k1P, k2, k2P, k3, k3P, k4;
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

    if (k0.x >= 1.0) {
      k0.x = 1.0;
      break;
    }
  }

  vec3 rgb;
  color_encode_state(k0, rgb);
  gl_FragColor = vec4(rgb, 1);
}