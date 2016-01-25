precision mediump float;

varying vec2 v_coord;

const int max_steps = 6000;
const float b = 0.05;
const float h = 0.001;
const float h2 = h/2.0;

const int c_ebitcount = 5;
const int c_mbitcount = 6;
const int c_maxexp = int(exp2(float(c_ebitcount - 1))) - 1;
const float c_minfullmantissa = exp2(-float(c_maxexp - 1));
const float c_minposvalue = exp2(float(-(c_maxexp - 1 + c_mbitcount)));
const float c_maxposvalue = exp2(float(c_maxexp - c_mbitcount))*(exp2(float(c_mbitcount + 1)) - 1.0);

void color_encode_state(in vec2 full_state, out vec3 rgb) {
  // Truncate to fit within max/min values
  vec2 state = full_state;

  if (abs(state.x) < c_minposvalue)       state.x = 0.0;
  else if (abs(state.x) > c_maxposvalue)  state.x = sign(state.x)*c_maxposvalue;
  
  if (abs(state.y) < c_minposvalue)       state.y = 0.0;
  else if (abs(state.y) > c_maxposvalue)  state.y = sign(state.y)*c_maxposvalue;

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

  int expnx, expny, ex, ey;

  ex = 0;
  if (state.x == 0.0) {
    expnx = -c_maxexp;
  } else if (state.x < c_minfullmantissa) {
    expnx = -c_maxexp + 1;
  } else {
    expnx = int(floor(log2(state.x)));
    ex = expnx + c_maxexp;
  }

  ey = 0;
  if (state.y == 0.0) {
    expny = -c_maxexp;
  } else if (state.y < c_minfullmantissa) {
    expny = -c_maxexp + 1;
  } else {
    expny = int(floor(log2(state.y)));
    ey = expny + c_maxexp;
  }

  /// - Mantissa ---------------------------------------------------------------

  int mx, my;

  if (state.x == 0.0) {
    mx = 0;
  } else if (state.x < c_minfullmantissa) {
    mx = int(floor(state.x*exp2(float(-expnx + c_mbitcount))));
  } else {
    mx = int(floor(state.x*exp2(float(-expnx + c_mbitcount)) - exp2(float(c_mbitcount))));
  }

  if (state.y == 0.0) {
    my = 0;
  } else if (state.y < c_minfullmantissa) {
    my = int(floor(state.y*exp2(float(-expny + c_mbitcount))));
  } else {
    my = int(floor(state.y*exp2(float(-expny + c_mbitcount)) - exp2(float(c_mbitcount))));
  }

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

  // rgb = vec3(ex, 0, 0) * -exp2(-33.0);
  rgb = vec3(float(r)/255.0, float(g)/255.0, float(b)/255.0);
}

void color_decode_state(in vec3 rgb, out vec2 full_state) {
  vec3 xrgb = rgb*255.0;

  float r = xrgb.x;
  float g = xrgb.y;
  float b = xrgb.z;

  // Red
  int sx = int(floor(r*exp2(-7.0)));
  int ex = int(floor((r - float(sx*128))*exp2(-2.0)));
  int mxr = int(floor(r - float(sx*128 + ex*4)));

  // Green
  int mxg = int(floor(g*exp2(-4.0)));
  int sy = int(floor((g - float(mxg*16))*exp2(-3.0)));
  int eyg = int(floor(g - float(mxg*16 + sy*8)));

  // Blue
  int eyb = int(floor(b*exp2(-6.0)));
  int my = int(floor(b - float(eyb*64)));

  // Merge split bits
  int mx = mxr*16 + mxg;
  int ey = eyg*4 + eyb;

  // Reconstitute
  float x, y;

  if (ex == 0) {
    x = float(mx)*exp2(float(-c_mbitcount -c_maxexp + 1));
  } else {
    x = (float(mx)*exp2(float(-c_mbitcount)) + 1.0)*exp2(float(-c_maxexp + ex));
  }
  if (sx > 0) x = -x;

  if (ey == 0) {
    y = float(my)*exp2(float(-c_mbitcount -c_maxexp + 1));
  } else {
    y = (float(my)*exp2(float(-c_mbitcount)) + 1.0)*exp2(float(-c_maxexp + ey));
  }
  if (sy > 0) y = -y;

  full_state = vec2(x, y);
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
  color_decode_state(rgb, k0);
  gl_FragColor = vec4(k0.x, k0.y, 0, 1);
}