import first from 'lodash/fp/first';

const DEFAULT_CANVAS_SIZE = Math.pow(2, 8);
const DEFAULT_STEP_COUNT = 1000;

export const ShaderMode = {
  PASSTHROUGH: 0,
  ITERATE: 1
};

export default class GlslCanvas {
  constructor(canvas, options = {}) {
    if (!window.WebGLRenderingContext) {
      console.error('[GlslCanvas] No WebGLRenderingContext');
      return;
    }

    this.textureSize = options.scale
      ? Math.pow(2, options.scale) : DEFAULT_CANVAS_SIZE

    this.canvas = canvas;
    this.canvas.width = this.textureSize;
    this.canvas.height = this.textureSize;

    this.options = options;

    this.shaders = [];
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

  /// - Program init and checking

  init() {
    // Prepare the canvas context
    this.init3DContext();

    // Initialise the program and shaders
    this.initProgram();

    // Initialize the vertex buffer where we will send the points to render
    this.initVertexBuffer();

    // Initialize the framebuffers for "bouncing" state back and forth
    this.initFramebuffers();

    this.reset();

    // Return this so that we can chain methods
    return this;
  }

  init3DContext() {
    try {
      this.gl = this.canvas.getContext('experimental-webgl');
    } catch (e) {
      try {
        this.gl = this.canvas.getContext('webgl');
      } catch (e2) {
        console.error('[GlslCanvas] Could not initialize canvas context');
      }
    }
  }

  initProgram() {
    // Create the program, init the shaders, and link everything together
    this.program = this.gl.createProgram();
    this.shaders.forEach(({ source, type }) => {
      const shader = createShader(this.gl, this.gl[type], source);
      this.gl.attachShader(this.program, shader);
    });
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

  initVertexBuffer() {
    // Create an empty buffer where we will send the vertex points and bind it
    // to the context
    this.vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);

    // Activate the 'a_position' array in the GPU program and define its data
    // format look up where the vertex data needs to go.
    const positionLocation = this.getAttribLocation('a_position');
    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
  }

  initFramebuffers() {
    // TODO: try to use half float only if it's available. Otherwise full float
    let textureFormat = this.gl.getExtension('OES_texture_half_float').HALF_FLOAT_OES;
    this.framebuffers = [
      createFramebuffer(this.gl, textureFormat, this.textureSize),
      createFramebuffer(this.gl, textureFormat, this.textureSize)
    ];
  }

  /// - Variable location

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

  reset() {
    this.currentStep = 0;
  }

  renderNextStep() {
    console.log('Render step:', this.currentStep);
    const i = this.currentStep;

    // Render a step of the simulation to the framebuffer
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.framebuffers[i%2].tex);
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffers[(i + 1)%2].fb);
    this.setINumber(i);
    this.setShaderMode(ShaderMode.ITERATE);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexArray.length/2);

    // Direct texture to the rendered texture
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.framebuffers[(i + 1)%2].tex);

    // Direct the framebuffer back to the canvas
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

    // Draw the buffer points as triangles in the GPU program
    this.setShaderMode(ShaderMode.PASSTHROUGH);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexArray.length/2);

    this.currentStep++;
  }

  play () {
    if (!this.playing) {
      const animate = () => {
        this.renderNextStep();

        if (this.playing) {
          requestAnimationFrame(function () {
            animate();
          });
        }
      };

      this.playing = true;
      animate();
    }
  }

  pause () {
    if (this.playing) {
      this.playing = false;
    }
  }

  //render(steps = DEFAULT_STEP_COUNT) {
  //  const animate = () => {
  //    this.renderNextStep();
  //
  //    if (this.currentStep < steps) {
  //      requestAnimationFrame(function () {
  //        animate();
  //      });
  //    } else {
  //      console.log('done');
  //    }
  //  };
  //
  //  animate();
  //}
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

function createFramebuffer(gl, textureFormat, textureSize) {
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