import GlslCanvas, { ShaderMode } from './glsl-canvas';

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

var self = glslCanvas;

var HALF_FLOAT_OES = self.gl.getExtension('OES_texture_half_float').HALF_FLOAT_OES;

// Create an empty buffer where we will send the vertex points
// and bind it to the context
var buffer = self.gl.createBuffer();
self.gl.bindBuffer(self.gl.ARRAY_BUFFER, buffer);

// Fill the buffer with the vertex points
self.gl.bufferData(self.gl.ARRAY_BUFFER, new Float32Array(pointArray), self.gl.STATIC_DRAW);

// Activate the 'a_position' array in the GPU program and define its data format
self.gl.enableVertexAttribArray(positionLocation);
self.gl.vertexAttribPointer(positionLocation, 2, self.gl.FLOAT, false, 0, 0);

function createFramebuffer() {
  // Create a half-float texture
  var textureSize = 1;
  var texture = self.gl.createTexture();
  self.gl.bindTexture(self.gl.TEXTURE_2D, texture);
  self.gl.texParameteri(self.gl.TEXTURE_2D, self.gl.TEXTURE_MIN_FILTER, self.gl.NEAREST);
  self.gl.texParameteri(self.gl.TEXTURE_2D, self.gl.TEXTURE_MAG_FILTER, self.gl.NEAREST);
  self.gl.getExtension('OES_texture_float');
  self.gl.texImage2D(self.gl.TEXTURE_2D, 0, self.gl.RGBA, textureSize, textureSize, 0, self.gl.RGBA, self.gl.FLOAT, null);

  // Create a frame buffer to write to a texture
  var framebuffer = self.gl.createFramebuffer();
  self.gl.bindFramebuffer(self.gl.FRAMEBUFFER, framebuffer);
  self.gl.framebufferTexture2D(self.gl.FRAMEBUFFER, self.gl.COLOR_ATTACHMENT0, self.gl.TEXTURE_2D, texture, 0);
  if (self.gl.checkFramebufferStatus(self.gl.FRAMEBUFFER) !== self.gl.FRAMEBUFFER_COMPLETE) {
    console.error('[GlslCanvas] Cannot render to HALF_FLOAT_OES texture');
    throw 'shit';
  }

  // Direct texture and framebuffer back to defaults
  self.gl.bindTexture(self.gl.TEXTURE_2D, null);
  self.gl.bindFramebuffer(self.gl.FRAMEBUFFER, null);

  return { tex: texture, fb: framebuffer };
}

var fbs = [ createFramebuffer(), createFramebuffer() ];


console.log('huh?');
var i = 0;

function animate() {
  var renderTo = fbs[(i + 1)%2];

  // Render a step of the simulation to the framebuffer
  self.gl.bindTexture(self.gl.TEXTURE_2D, fbs[i%2].tex);
  self.gl.bindFramebuffer(self.gl.FRAMEBUFFER, renderTo.fb);
  self.setINumber(i);
  self.setShaderMode(ShaderMode.ITERATE);
  self.gl.drawArrays(self.gl.TRIANGLES, 0, pointArray.length / 2);

  // Direct texture to the rendered texture and framebuffer back to defaults
  self.gl.bindTexture(self.gl.TEXTURE_2D, renderTo.tex);
  self.gl.bindFramebuffer(self.gl.FRAMEBUFFER, null);

  // Draw the buffer points as triangles in the GPU program
  self.setShaderMode(ShaderMode.PASSTHROUGH);
  self.gl.drawArrays(self.gl.TRIANGLES, 0, pointArray.length / 2);

  console.log(readPixels(renderTo.fb));

  i++;
}

function readPixels(framebuffer) {
  var pixels = new Float32Array(4);

  self.gl.bindFramebuffer(self.gl.FRAMEBUFFER, framebuffer);        
  self.gl.viewport(0, 0, 1, 1);
  self.gl.readPixels(0, 0, 1, 1, self.gl.RGBA, self.gl.FLOAT, pixels);
  self.gl.bindFramebuffer(self.gl.FRAMEBUFFER, null);

  return pixels;
}

document.getElementById('step-button').addEventListener('click', animate);