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

void main() {
  float w = v_coord.x;
  float a = v_coord.y;
  float t = 0.0;

  vec2 k0 = vec2(0.0, 0.0);
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
  
  gl_FragColor = vec4(k0.xy, 0, 1);
}