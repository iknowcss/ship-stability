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

  var fuck = [];
  readPixels(renderTo.fb).forEach(function (f) {
    fuck.push(f);
  });
  console.log(fuck);
  console.log(fuck.map(convertFloatToBinary));

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

function convertFloatToBinary(f) {
  var ebitcount = 8;
  var mbitcount = 23;
  var maxexp = 127;
  var minexp = 126;
  var minfullmantissa = Math.pow(2, -(maxexp - 1));

  var s = f < 0 ? '1' : '0';
  f = Math.abs(f);

  var expn;
  var e = 0;
  if (f === 0) {
    expn = -maxexp;
  } else if (f < minfullmantissa) {
    expn = -maxexp + 1
  } else {
    expn = Math.floor(Math.log2(f));
    e = expn + maxexp;
  }
  e = e.toString(2);
  while (e.length < ebitcount) e = '0' + e;

  var m;
  if (f === 0) {
    m = 0;
  } else if (f < minfullmantissa) {
    m = Math.floor(f*Math.pow(2, -expn + mbitcount));
  } else {
    m = Math.floor(f*Math.pow(2, -expn + mbitcount) - Math.pow(2, mbitcount));
  }
  m = m.toString(2);
  while (m.length < mbitcount) m = '0' + m;

  return s + '|' + e + '|' + m;
}

document.getElementById('step-button').addEventListener('click', animate);