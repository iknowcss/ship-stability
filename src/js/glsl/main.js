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
  var textureSize = 512;
  var texture = self.gl.createTexture();
  self.gl.bindTexture(self.gl.TEXTURE_2D, texture);
  self.gl.texParameteri(self.gl.TEXTURE_2D, self.gl.TEXTURE_MIN_FILTER, self.gl.NEAREST);
  self.gl.texParameteri(self.gl.TEXTURE_2D, self.gl.TEXTURE_MAG_FILTER, self.gl.NEAREST);
  self.gl.texImage2D(self.gl.TEXTURE_2D, 0, self.gl.RGBA, textureSize, textureSize, 0, self.gl.RGBA, HALF_FLOAT_OES, null);

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
  console.log('step ' + i);

  // Render a step of the simulation to the framebuffer
  self.gl.bindTexture(self.gl.TEXTURE_2D, fbs[i%2].tex);
  self.gl.bindFramebuffer(self.gl.FRAMEBUFFER, fbs[(i + 1)%2].fb);
  self.setINumber(i);
  self.setShaderMode(ShaderMode.ITERATE);
  self.gl.drawArrays(self.gl.TRIANGLES, 0, pointArray.length / 2);

  // Direct texture to the rendered texture
  self.gl.bindTexture(self.gl.TEXTURE_2D, fbs[(i + 1)%2].tex);

  // Direct the framebuffer back to the canvas
  self.gl.bindFramebuffer(self.gl.FRAMEBUFFER, null);

  // Draw the buffer points as triangles in the GPU program
  self.setShaderMode(ShaderMode.PASSTHROUGH);
  self.gl.set
  self.gl.drawArrays(self.gl.TRIANGLES, 0, pointArray.length / 2);

  i++;

  if (i < 1000) {
    requestAnimationFrame(function () {
      animate();
    });
  } else {
    console.log('done');
  }
}

document.getElementById('step-button').addEventListener('click', animate);

////////////////////////////////////////////////////////////////////////////////

function shitFramebuffer(fb) {
  var pixelChannels = readPixelChannels(fb);
  console.log('r:', string32to16(convertFloatToBinary(pixelChannels[0])));
  console.log('g:', string32to16(convertFloatToBinary(pixelChannels[1])));
  console.log('b:', string32to16(convertFloatToBinary(pixelChannels[2])));
  console.log('a:', string32to16(convertFloatToBinary(pixelChannels[3])));
}

function readPixelChannels(framebuffer) {
  var pixels = new Float32Array(4);

  self.gl.bindFramebuffer(self.gl.FRAMEBUFFER, framebuffer);        
  self.gl.viewport(0, 0, 1, 1);
  self.gl.readPixels(0, 0, 1, 1, self.gl.RGBA, self.gl.FLOAT, pixels);
  self.gl.bindFramebuffer(self.gl.FRAMEBUFFER, null);

  return pixels;
}

var ebitcount = 8;
var mbitcount = 23;
var maxexp = 127;
var minexp = 126;

function convertFloatToBinary(f) {
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
  e = pad(e.toString(2), ebitcount);

  var m;
  if (f === 0) {
    m = 0;
  } else if (f < minfullmantissa) {
    m = Math.floor(f*Math.pow(2, -expn + mbitcount));
  } else {
    m = Math.floor(f*Math.pow(2, -expn + mbitcount) - Math.pow(2, mbitcount));
  }
  m = pad(m.toString(2), mbitcount);

  return s + '|' + e + '|' + m;
}

function string32to16(f) {
  var fsplit = f.split('|');
  var sf = fsplit[0];
  var ef = parseInt(fsplit[1], 2);
  var mf = fsplit[2];

  if (ef === 0) {
    ef = '0';
    mf = '0';
  } else if (ef < 127 - 15 + 1) {
    var delta = 127 - 15 + 1 - ef;
    ef = '0';
    // mf = '1' + mf.substr(0, 10 - delta);
    mf = delta > 10 ? '0' : ('1' + mf.substr(0, 10 - delta));
  } else if (ef < 127 + 15 + 1) {
    ef = (ef - 127 + 15).toString(2);
    mf = mf.substr(0, 10);
  } else {
    return 'OOPS';
  }

  mf = pad(mf, 10);
  ef = pad(ef, 5);

  return sf + '|' + ef + '|' + mf;
}

function deallocateBits(x, y) {
  var xsplit = x.split('|');
  var sx = xsplit[0];
  var ex = xsplit[1];
  var mx = xsplit[2];

  ex = pad((parseInt(ex, 2) - 127 + 31).toString(2), ebitcount);
  mx = mx.substr(0, 10);

  var ysplit = y.split('|');
  var sy = ysplit[0];
  var ey = ysplit[1];
  var my = ysplit[2];

  ey = pad((parseInt(ey, 2) - 127 + 31).toString(2), ebitcount);
  my = my.substr(0, 10);

  return ''
    + sx
    + '|'
    + ex[0] + ey[0] + mx.substr(0, 3) + my.substr(0, 3)
    + '|'
    + sy + my.substr(3) + mx.substr(3)
    + ey[1] + ex[1]
    + ey[2] + ex[2]
    + ey[3] + ex[3]
    + ey[4] + ex[4];
}

function pad(s, len) {
  while (s.length < len) s = '0' + s;
  return s;
}