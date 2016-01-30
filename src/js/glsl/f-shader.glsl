precision highp float;

varying vec2 v_coord;
uniform int u_mode;
uniform int u_inumber;
uniform sampler2D u_initial;

const int MODE_PASSTHROUGH = 0;
const int MODE_ITERATE = 1;

const int max_steps = 1;
const float b = 0.05;
// const float h = 0.0001;
const float h = exp2(-11.0);
const float h2 = h/2.0;

const int c_s1 = 2;
const int c_s2 = 4;
const int c_s3 = 8;
const int c_s4 = 16;
const int c_s5 = 32;
const int c_s6 = 64;
const int c_s7 = 128;
const int c_s8 = 256;
const int c_s9 = 512;
const int c_s10 = 1024;
const int c_s11 = 2048;
const int c_s12 = 4096;
const int c_s13 = 8192;
const int c_s15 = 32768;
const int c_s22 = 4194304;

const int c_16ebitcount = 5;
const int c_16mbitcount = 10;
const int c_16maxexp = int(exp2(float(c_16ebitcount - 1))) - 1;
const int c_16minexp = c_16maxexp - 1;
const int c_32ebitcount = 8;
const int c_32mbitcount = 23;
const int c_32maxexp = int(exp2(float(c_32ebitcount - 1))) - 1;
const int c_32minexp = c_32maxexp - 1;
const float c_32minfullmantissa = exp2(-float(c_32minexp));
const float c_32minposvalue = exp2(-float(c_32minexp + c_32mbitcount));

void extract_bits_16(in float f, out int s, out int e, out int m) {
  if (f < 0.0) s = 1;
  else s = 0;

  int expn;
  f = abs(f);
  e = 0;
  if (f == 0.0) {
    expn = -c_16maxexp;
    m = 0;
  } else {
    expn = int(floor(log2(f)));
    e = expn + c_32maxexp;
    m = int(floor(f*exp2(float(-expn + c_16mbitcount)) - exp2(float(c_16mbitcount))));
  }
}

void extract_bits_32(in float f, out int s, out int e, out int m) {
  if (f < 0.0) s = 1;
  else s = 0;

  float af = abs(f);
  int expn;

  e = 0;
  if (af == 0.0) {
    expn = -c_32maxexp;
    m = 0;
  } else if (af < c_32minfullmantissa) {
    expn = -c_32maxexp + 1;
    m = int(floor(af*exp2(float(-expn + c_32mbitcount))));  
  } else {
    expn = int(floor(log2(af)));
    e = expn + c_32maxexp;
    m = int(floor((af*exp2(float(-expn)) - 1.)*exp2(float(c_32mbitcount))));
  }
}

void intract_bits(in int sx, in int ex, in int mx, float f) {
  if (ex == 0) f = exp2(-float(c_32minexp + c_32mbitcount))*float(mx);
  else f = exp2(float(-c_32maxexp + ex))*(exp2(-float(c_32mbitcount))*float(mx) + 1.);
  if (sx > 0) f *= -1.;
}

void allocate_bits(in int s, in int e, in int m, out float x, out float y) {
  x = 0.;
  y = 0.;

  // // Slice-up the e bits
  // int e7 = e/c_s7;
  // e -= e7*c_s7;
  // int e6 = e/c_s6;
  // e -= e6*c_s6;
  // int e543 = e/c_s3;
  // e -= e543*c_s3;
  // int e210 = e;

  // // Slice-up m bits
  // int m22 = m/c_s22;
  // m -= m22*c_s22;
  // int m21t15 = m/c_s15;
  // m -= m21t15*c_s15;
  // int m14t8 = m/c_s8;
  // m -= m14t8*c_s8;

  // int temp;
  // int m6420 = 0;
  // int m7531 = 0;
  // temp = (m/c_s7)*c_s7;
  // m7531 += temp;
  // m -= temp;
  // temp = (m/c_s6)*c_s6;
  // m6420 += temp;
  // m -= temp;
  // temp = (m/c_s5)*c_s5;
  // m7531 += temp;
  // m -= temp;
  // temp = (m/c_s4)*c_s4;
  // m6420 += temp;
  // m -= temp;
  // temp = (m/c_s3)*c_s3;
  // m7531 += temp;
  // m -= temp;
  // temp = (m/c_s2)*c_s2;
  // m6420 += temp;
  // m -= temp;
  // temp = (m/c_s1)*c_s1;
  // m7531 += temp;
  // m -= temp;
  // m6420 += m;

  // // 32-bit |   s | e7 | m6420 | e543 | m14t8
  // // 16-bit |   s |  e |  eeee |  mmm |  mmmmmmm

  // // 32-bit | m22 | e6 | m7531 | e210 | m21t15
  // // 16-bit |   s |  e |  eeee |  mmm |  mmmmmmm

  // int sx = s;
  // int ex = e7*c_s4 + m6420;
  // int mx = e543*c_s7 + m14t8;
  // if (ex == 31) ex -= 1; // Prevents infinity
  // if (ex == 0) x = exp2(-float(c_16minexp + c_16mbitcount))*float(mx);
  // else x = exp2(float(-c_16maxexp + ex))*(exp2(-float(c_16mbitcount))*float(mx) + 1.);
  // if (sx > 0) x *= -1.;

  // int sy = m22;
  // int ey = e6*c_s4 + m7531;
  // int my = e210*c_s7 + m21t15;
  // if (ey == 31) ey -= 1; // Prevents infinity
  // if (ey == 0) y = exp2(-float(c_16minexp + c_16mbitcount))*float(my);
  // else y = exp2(float(-c_16maxexp + ey))*(exp2(-float(c_16mbitcount))*float(my) + 1.);
  // if (sy > 0) y *= -1.;
}

void deallocate_bits(in float x, in float y, out int s, out int e, out int m) {
  int sx, ex, mx;
  extract_bits_16(x, sx, ex, mx);

  int sy, ey, my;
  extract_bits_16(y, sy, ey, my);

  // 32-bit |   s | e7 | m6420 | e543 | m14t8
  // 16-bit |   s |  e |  eeee |  mmm |  mmmmmmm

  // 32-bit | m22 | e6 | m7531 | e210 | m21t15
  // 16-bit |   s |  e |  eeee |  mmm |  mmmmmmm

  s = sx;
  int m22 = sy;

  int e7 = ex/c_s4;
  ex -= e7*c_s4;
  int e6 = ey/c_s4;
  ey -= e6*c_s4;

  int temp;
  int m7t0 = 0;

  temp = ex/c_s3;
  m7t0 += temp*c_s6;
  ex -= temp*c_s3;
  temp = ex/c_s2;
  m7t0 += temp*c_s4;
  ex -= temp*c_s2;
  temp = ex/c_s1;
  m7t0 += temp*c_s2;
  ex -= temp*c_s1;
  m7t0 += ex;

  temp = ey/c_s3;
  m7t0 += temp*c_s7;
  ey -= temp*c_s3;
  temp = ey/c_s2;
  m7t0 += temp*c_s5;
  ey -= temp*c_s2;
  temp = ey/c_s1;
  m7t0 += temp*c_s3;
  ey -= temp*c_s1;
  m7t0 += ey*c_s2;

  int e543 = mx/c_s6;
  mx -= e543*c_s6;
  int m14t8 = mx;
  int e210 = my/c_s6;
  my -= e210*c_s6;
  int m21t15 = my;

  e = e7*c_s7 + e6*c_s6 + e543*c_s3 + e210;
  m = m22*c_s22 + m21t15*c_s15 + m14t8*c_s8 + m7t0;
}

void encode_state(in vec2 state, out vec4 rgba) {
  float r, g, b, a;

  int sx, ex, mx;
  extract_bits_32(state.x, sx, ex, mx);
  allocate_bits(sx, ex, mx, r, g);

  int sy, ey, my;
  extract_bits_32(state.y, sy, ey, my);
  allocate_bits(sy, ey, my, b, a);

  rgba = vec4(r, g, b, a);
}

void decode_state(out vec2 state, in vec4 rgba) {
  vec2 result = vec2(0., 0.);

  float r = rgba.x;
  float g = rgba.y;
  float b = rgba.z;
  float a = rgba.w;

  int sx, ex, mx;
  deallocate_bits(r, g, sx, ex, mx);
  intract_bits(sx, ex, mx, result.x);

  int sy, ey, my;
  deallocate_bits(b, a, sy, ey, my);
  intract_bits(sy, ey, my, result.y);

  state = result;
}

void main() {
  vec4 rgba = texture2D(u_initial, v_coord);
  vec2 state;
  decode_state(state, rgba);

  vec2 k0 = state;
  float t0 = float(u_inumber*max_steps)*h;

  float w = v_coord.x;
  float a = v_coord.y;
  float t = t0;
  if (u_mode == MODE_ITERATE) {
    vec2 k1, k1P, k2, k2P, k3, k3P, k4;
    for (int i = 0; i < max_steps; i++) {
      if (k0.x >= 1.0) {
        k0.x = 1.0;
        break;
      }

      k1 = vec2( k0.y,  -b*k0.y  - k0.x +   k0.x*k0.x + a*sin(w*t));
      k1P = k0 + h2*k1;
      k2 = vec2(k1P.y, -b*k1P.y - k1P.x + k1P.x*k1P.x + a*sin(w*(t + h2)));
      k2P = k0 + h2*k2;
      k3 = vec2(k2P.y, -b*k2P.y - k2P.x + k2P.x*k2P.x + a*sin(w*(t + h2)));
      k3P = k0 + h*k3;
      k4 = vec2(k3P.y, -b*k3P.y - k3P.x + k3P.x*k3P.x + a*sin(w*(t + h)));

      t += h;
      k0 += (h/6.0)*(k1 + 2.0*(k2 + k3) + k4);
    }

    float phase = (sin(w*t0) + 1.0)/2.0;
    encode_state(k0, rgba);
    gl_FragColor = rgba;
  } else {
    vec2 phase = vec2(0.0, 0.0);
    float b = 0.0;
    if (state.x >= 1.0) {
      // b = 1.0;
    } else {
      phase = state.x*vec2(-1.0, 1.0);
    }
    gl_FragColor = vec4(phase, b, 1);
  }

  
}