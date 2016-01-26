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
var pointArray = [
  0.0, 0.0,
  0.0, 1.0,
  1.0, 0.0,
  1.0, 0.0,
  0.0, 1.0,
  1.0, 1.0
];

(function () {
  var HALF_FLOAT_OES = this.gl.getExtension('OES_texture_half_float').HALF_FLOAT_OES;

  // Create an empty buffer where we will send the vertex points
  // and bind it to the context
  var buffer = this.gl.createBuffer();
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);

  // Fill the buffer with the vertex points
  this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(pointArray), this.gl.STATIC_DRAW);

  // Activate the 'a_position' array in the GPU program and define its data format
  this.gl.enableVertexAttribArray(positionLocation);
  this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);

  // Create a half-float texture
  var textureSize = 512;
  var texture = this.gl.createTexture();
  this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
  this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
  this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
  this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, textureSize, textureSize, 0, this.gl.RGBA, HALF_FLOAT_OES, null);

  // Create a frame buffer to write to the texture
  var framebuffer = this.gl.createFramebuffer();
  this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, framebuffer);
  this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, texture, 0);
  if (this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER) !== this.gl.FRAMEBUFFER_COMPLETE) {
    console.error('[GlslCanvas] Cannot render to HALF_FLOAT_OES texture');
    return;
  }
  this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

  // Draw the buffer points as triangles in the GPU program
  this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
  this.gl.drawArrays(this.gl.TRIANGLES, 0, pointArray.length / 2);

}).call(glslCanvas);