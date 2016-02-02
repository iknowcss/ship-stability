attribute vec2 a_position;

uniform vec2 u_span;
uniform vec2 u_offset;
 
varying vec2 v_tex_coord;
varying vec2 v_coord;
varying float v_hue_offset;

void main() {
  v_coord = a_position;

  
  // convert the rectangle from pixels to 0.0 to 1.0
  v_tex_coord = (a_position - u_offset)/u_span;
 
  // convert from 0->1 to 0->2
  // convert from 0->2 to -1->+1 (clipspace)
  vec2 clipSpace = v_tex_coord*2.0 - 1.0;
 
  gl_Position = vec4(clipSpace, 0, 1);
}