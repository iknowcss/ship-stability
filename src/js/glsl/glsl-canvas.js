import first from 'lodash/array/first';

export const ShaderMode = {
  PASSTHROUGH: 0,
  ITERATE: 1
};

export default class GlslCanvas {
  constructor(canvas, options = {}) {
    if (!window.WebGLRenderingContext) {
      console.error('[GlslCanvas] No WebGLRenderingContext');
      return null;
    }

    this.canvas = canvas;
    this.options = options;

    this.shaders = [];
  }

  /// - Context

  init3DContext() {
    // Refactor this later
    try {
      this.gl = this.canvas.getContext('experimental-webgl');
    } catch (e) {
      try {
        this.gl = this.canvas.getContext('webgl');
      } catch (e2) {
        console.error('[GlslCanvas] Could not initialize canvas context');
        return;
      }
    }
  }

  /// - Builder functions

  addVertexShader(source) {
    return this.addShader('VERTEX_SHADER', source);
  }

  addFragmentShader(source) {
    return this.addShader('FRAGMENT_SHADER', source);
  }

  addShader(type, source) {
    this.shaders.push({ type, source });
    return this;
  }

  init() {
    this.init3DContext();
    this.initProgram();
    this.initVertexBuffer();
    this.initFramebuffers();
    return this;
  }

  /// - Location

  getAttribLocation(name) {
    const location = this.gl.getAttribLocation(this.program, name);
    if (location < 0) console.warn('[GlslCanvas] Could not find attrib location:', name);
    return location;
  }

  getUniformLocation(name) {
    const location = this.gl.getUniformLocation(this.program, name);
    if (location < 0) console.warn('[GlslCanvas] Could not find uniform location:', name);
    return location;
  }

  /// - Program init and checking

  initProgram() {
    this.program = this.gl.createProgram();
    this.initShaders();
    this.gl.linkProgram(this.program);

    // Verify that program linked correctly. If not, clean up and give up
    const isLinked = this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS);
    if (!isLinked) {
      console.error('[GlslCanvas] Error in program linking:', this.program);
      this.gl.deleteProgram(this.program);
      this.program = null;
      return;
    }

    // Everything is good
    this.gl.useProgram(this.program);
  }

  initShaders() {
    this.shaders.forEach(({ source, type }) => {
      this.gl.attachShader(
        this.program, 
        createShader(this.gl, this.gl[type], source)
      );
    });
  }

  initVertexBuffer() {
    // Create an empty buffer where we will send the vertex points
    // and bind it to the context
    this.vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);

    // Activate the 'a_position' array in the GPU program and define its data format
    // look up where the vertex data needs to go.
    const positionLocation = this.getAttribLocation('a_position');
    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
  }

  initFramebuffers() {
    let textureFormat = this.gl.getExtension('OES_texture_half_float').HALF_FLOAT_OES;
    this.framebuffers = [
      createFramebuffer(this.gl, textureFormat),
      createFramebuffer(this.gl, textureFormat)
    ];
  }

  /// - Mode 

  setShaderMode(mode) {
    this.gl.uniform1i(this.getUniformLocation('u_mode'), mode);
  }

  setINumber(i) {
    this.gl.uniform1i(this.getUniformLocation('u_inumber'), i);
  }

  /// - Rendering

  setDomain(domain) {
    this.domain = domain;
    this.domain.x.span = this.domain.x.to - this.domain.x.from;
    this.domain.y.span = this.domain.y.to - this.domain.y.from;

    // Provide offset and span sizes to calculate clipspace
    this.gl.uniform2f(this.getUniformLocation('u_span'), this.domain.x.span, this.domain.y.span);
    this.gl.uniform2f(this.getUniformLocation('u_offset'), this.domain.x.from, this.domain.y.from);

    this.updateVertexBufferPoints();
  }

  updateVertexBufferPoints() {
    this.vertexArray = [
      this.domain.x.from, this.domain.y.from,
      this.domain.x.from, this.domain.y.to,
      this.domain.x.to,   this.domain.y.from,
      this.domain.x.to,   this.domain.y.from,
      this.domain.x.from, this.domain.y.to,
      this.domain.x.to,   this.domain.y.to
    ];

    // Fill the buffer with the vertex points
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertexArray), this.gl.STATIC_DRAW);
  }

  render() {
    console.log('render');

    var self = this;
    var i = 0;

    animate();

    function animate() {
      console.log('step ' + i);

      // Render a step of the simulation to the framebuffer
      self.gl.bindTexture(self.gl.TEXTURE_2D, self.framebuffers[i%2].tex);
      self.gl.bindFramebuffer(self.gl.FRAMEBUFFER, self.framebuffers[(i + 1)%2].fb);
      self.setINumber(i);
      self.setShaderMode(ShaderMode.ITERATE);
      self.gl.drawArrays(self.gl.TRIANGLES, 0, self.vertexArray.length / 2);

      // Direct texture to the rendered texture
      self.gl.bindTexture(self.gl.TEXTURE_2D, self.framebuffers[(i + 1)%2].tex);

      // Direct the framebuffer back to the canvas
      self.gl.bindFramebuffer(self.gl.FRAMEBUFFER, null);

      // Draw the buffer points as triangles in the GPU program
      self.setShaderMode(ShaderMode.PASSTHROUGH);
      self.gl.drawArrays(self.gl.TRIANGLES, 0, self.vertexArray.length / 2);

      i++;

      if (i < 1000) {
        requestAnimationFrame(function () {
          animate();
        });
      } else {
        console.log('done');
      }
    }
  }
}

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const isCompiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!isCompiled) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createFramebuffer(gl, textureFormat, textureSize = 256) {
  // Create a half-float texture
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, textureSize, textureSize, 0, gl.RGBA, textureFormat, null);

  // Create a frame buffer to write to a texture
  const framebuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
    console.error('[GlslCanvas] Cannot render to texture format:', textureFormat);
    throw 'Could not create framebuffer';
  }

  // Direct texture and framebuffer back to defaults
  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  return { 
    tex: texture, 
    fb: framebuffer 
  };
}