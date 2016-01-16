import GlslCanvas from './glsl-canvas';

const canvas = document.getElementById('glsl-canvas');

const glslCanvas = new GlslCanvas(canvas)
  .addVertexShader(require('./v-shader.glsl'))
  .addFragmentShader(require('./f-shader.glsl'))
  .init();

// look up where the vertex data needs to go.
var positionLocation = glslCanvas.getAttribLocation('a_position');

// set the resolution
var resolutionLocation = glslCanvas.gl.getUniformLocation(glslCanvas.program, "u_resolution");
glslCanvas.gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

// Create a buffer and put a single clipspace rectangle in
// it (2 triangles)
var pointArray = [
  10, 20,
  80, 20,
  10, 30,
  10, 30,
  80, 20,
  80, 30
];
var buffer = glslCanvas.gl.createBuffer();
glslCanvas.gl.bindBuffer(glslCanvas.gl.ARRAY_BUFFER, buffer);
glslCanvas.gl.bufferData(
  glslCanvas.gl.ARRAY_BUFFER,
  new Float32Array(pointArray),
  glslCanvas.gl.STATIC_DRAW
);
glslCanvas.gl.enableVertexAttribArray(positionLocation);
glslCanvas.gl.vertexAttribPointer(positionLocation, 2, glslCanvas.gl.FLOAT, false, 0, 0);
 
// draw
glslCanvas.gl.drawArrays(glslCanvas.gl.TRIANGLES, 0, pointArray.length / 2);