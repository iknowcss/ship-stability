attribute vec2 a_position;
 
uniform vec2 u_domain_width;
uniform vec2 u_domain_offset;
 
varying vec2 v_coord;

void main() {
  v_coord = ((a_position + 1.0)/2.0)*u_domain_width + u_domain_offset;
 
  gl_Position = vec4(a_position, 0, 1);
}