import first from 'lodash/array/first';

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

    var prec = this.gl.getShaderPrecisionFormat(this.gl.FRAGMENT_SHADER, this.gl.MEDIUM_FLOAT);
    console.log(prec);

    this.initProgram();
    this.gl.useProgram(this.program);

    return this;
  }

  /// - Attrib logic

  getAttribLocation(attrib) {
    return this.gl.getAttribLocation(this.program, attrib);
  }

  /// - Program init and checking

  initProgram() {
    this.program = this.gl.createProgram();
    this.initShaders();
    this.gl.linkProgram(this.program);

    const isLinked = this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS);
    if (!isLinked) {
      console.error('[GlslCanvas] Error in program linking:', this.program);
      this.gl.deleteProgram(this.program);
      this.program = null;
    }
  }

  initShaders() {
    this.shaders.forEach(({ source, type }) => {
      this.gl.attachShader(
        this.program, 
        createShader(this.gl, this.gl[type], source)
      );
    });
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