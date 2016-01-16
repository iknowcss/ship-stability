import GlslCanvas from './glsl-canvas';

const canvas = document.getElementById('glsl-canvas');

const glslCanvas = new GlslCanvas(canvas)
  .addVertexShader(require('./v-shader.glsl'))
  .addFragmentShader(require('./f-shader.glsl'))
  .init();

// look up where the vertex data needs to go.
var positionLocation = glslCanvas.getAttribLocation('a_position');
 
// Create a buffer and put a single clipspace rectangle in
// it (2 triangles)
var buffer = glslCanvas.gl.createBuffer();
glslCanvas.gl.bindBuffer(glslCanvas.gl.ARRAY_BUFFER, buffer);
glslCanvas.gl.bufferData(
  glslCanvas.gl.ARRAY_BUFFER,
  new Float32Array([
    -1.0, -1.0,
     1.0, -1.0,
    -1.0,  1.0,
    -1.0,  1.0,
     1.0, -1.0,
     1.0,  1.0
   ]),
  glslCanvas.gl.STATIC_DRAW
);
glslCanvas.gl.enableVertexAttribArray(positionLocation);
glslCanvas.gl.vertexAttribPointer(positionLocation, 2, glslCanvas.gl.FLOAT, false, 0, 0);
 
// draw
glslCanvas.gl.drawArrays(glslCanvas.gl.TRIANGLES, 0, 6);