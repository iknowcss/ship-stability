attribute vec2 a_position;
 
uniform vec2 u_resolution;
 
varying vec2 v_coord;
varying float v_hue_offset;

void main() {
  v_coord = a_position;

  // convert the rectangle from pixels to 0.0 to 1.0
  vec2 zeroToOne = a_position / u_resolution;
 
  // convert from 0->1 to 0->2
  vec2 zeroToTwo = zeroToOne * 2.0;
 
  // convert from 0->2 to -1->+1 (clipspace)
  vec2 clipSpace = zeroToTwo - 1.0;
 
  gl_Position = vec4(clipSpace, 0, 1);
}